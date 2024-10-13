"use client";

import { DocumentList } from "@/app/(main)/_components/documentlist";
import { Item } from "@/app/(main)/_components/item";
import { Navbar } from "@/app/(main)/_components/navbar";
import { TrashBox } from "@/app/(main)/_components/trash-box";
import { UserItem } from "@/app/(main)/_components/user-item";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { useSidebarDocuments } from "@/hooks/use-sidebar-documents";
import { cn } from "@/lib/utils";
import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";

export const Navigation = () => {
  const router = useRouter();
  const search = useSearch();
  const settings = useSettings();
  const params = useParams();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { create } = useSidebarDocuments({ parentDocumentId: "" });
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 240px)");
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
    }
    setTimeout(() => {
      setIsResetting(false);
    }, 300);
  };

  const handleCreate = () => {
    const promise = create?.().then((document) => {
      router.push(`/documents/${document.document.id}`);
    });

    toast.promise(promise, {
      loading: "Creating...",
      success: "Document created",
      error: "Error creating document",
    });
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar relative z-[99999] flex h-full w-60 flex-col overflow-y-auto bg-secondary",
          isResetting && "transition-all duration-300 ease-in-out",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={collapse}
          role={"button"}
          className={cn(
            "absolute right-2 top-3 size-6 rounded-sm text-muted-foreground opacity-0 hover:bg-neutral-300 group-hover/sidebar:opacity-100 dark:hover:bg-neutral-600",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className={"size-6"} />
        </div>
        <div>
          <UserItem />
          <Item label={"Search"} icon={Search} isSearch onClick={search.onOpen} />
          <Item label={"Settings"} icon={Settings} onClick={settings.onOpen} />
          <Item onClick={handleCreate} label={"New Page"} icon={PlusCircle} />
        </div>
        <div className={"mt-4"}>
          <DocumentList parentDocumentId={""} />
          <Item onClick={handleCreate} icon={Plus} label={"Add a page"} />
          <Popover>
            <PopoverTrigger className={"mt-4 w-full"}>
              <Item label={"Trash"} icon={Trash} />
            </PopoverTrigger>
            <PopoverContent side={isMobile ? "bottom" : "right"} className={"w-72 p-0"}>
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className={
            "absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-primary/10 opacity-0 transition group-hover/sidebar:opacity-100"
          }
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute left-60 top-0 z-[99999] w-[calc(100%-240px)]",
          isResetting && "transition-all duration-300 ease-in-out",
          isMobile && "left-0 w-full"
        )}
      >
        {!!params.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav className={"w-full bg-transparent px-3 py-2"}>
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                role={"button"}
                className={"size-6 text-muted-foreground"}
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};
