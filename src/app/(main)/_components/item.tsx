"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { mutate } from "swr";

type ItemProps = {
  id?: string;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick?: () => void;
  create?: (id: string) => Promise<any>;
  icon: LucideIcon;
  archive?: (id: string) => Promise<any>;
};

export const Item = ({
  id,
  documentIcon,
  active,
  expanded,
  isSearch,
  level = 0,
  onExpand,
  label,
  onClick,
  icon: Icon,
  create,
  archive,
}: ItemProps) => {
  const session = useSession();
  const handleExpand = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    onExpand?.();
  };

  const router = useRouter();

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;
    const promise = archive?.(id).then(() => {
      router.push("/documents");
    });

    if (promise === undefined) return;

    toast.promise(promise, {
      loading: "Archiving document...",
      success: "Document archived!",
      error: "Failed to archive document",
    });
  };

  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!id) return;
    event.stopPropagation();
    const promise = create?.(id).then((document) => {
      if (!expanded) onExpand?.();
      router.push(`/documents/${document.document.id}`);
    });

    if (promise === undefined) return;

    toast.promise(promise, {
      loading: "Creating document...",
      success: "Document created!",
      error: "Failed to create document",
    });

    mutate((key) => typeof key === "string" && key.startsWith("/api/documents"));
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      onClick={onClick}
      role={"button"}
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : "12px",
      }}
      className={cn(
        "group flex min-h-[27px] w-full select-none items-center px-3 py-1 text-sm font-medium text-muted-foreground hover:bg-primary/5",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          role={"button"}
          className={"mr-1 h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"}
          onClick={handleExpand}
        >
          <ChevronIcon
            className={"size-4 shrink-0 text-muted-foreground/50 dark:text-muted-foreground"}
          />
        </div>
      )}
      {documentIcon ? (
        <div className={"mr-2 shrink-0 text-[18px]"}>{documentIcon}</div>
      ) : (
        <Icon className={"mr-2 size-[18px] shrink-0 text-muted-foreground"} />
      )}
      <span className={"truncate"}>{label}</span>
      {isSearch && (
        <kbd
          className={
            "pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[13px] font-medium text-muted-foreground opacity-100"
          }
        >
          <span className={"text-xs"}>⌘</span>K
        </kbd>
      )}
      {!!id && (
        <div className={"ml-auto flex items-center gap-x-2"}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div
                role={"button"}
                className={
                  "ml-auto h-full rounded-sm opacity-0 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600"
                }
              >
                <MoreHorizontal className={"size-4 text-muted-foreground"} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={"w-60"} align={"start"} side={"right"} forceMount>
              <DropdownMenuItem onClick={onArchive}>
                <Trash className={"mr-2 size-4"} />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className={"p-2 text-xs text-muted-foreground"}>
                Last edited by {session.data?.user?.name}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            className={
              "ml-auto h-full rounded-sm opacity-0 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600"
            }
            role={"button"}
            onClick={onCreate}
          >
            <Plus className={"size-4 text-muted-foreground"} />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : "12px",
      }}
      className={"flex gap-x-2 py-[3px]"}
    >
      <Skeleton className={"size-4"} />
      <Skeleton className={"h-4 w-[30%]"} />
    </div>
  );
};
