"use client";

import { Banner } from "@/app/(main)/_components/banner";
import { Menu } from "@/app/(main)/_components/menu";
import { Publish } from "@/app/(main)/_components/publish";
import { Title } from "@/app/(main)/_components/title";

import { useDocument } from "@/hooks/use-document";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";

type NavbarProps = {
  isCollapsed: boolean;
  onResetWidth: () => void;
};

export const Navbar: React.FC<NavbarProps> = ({ isCollapsed, onResetWidth }) => {
  const params = useParams();
  const { data: document, isLoading } = useDocument({
    documentId: (params.documentId as string) || "",
  });

  if (isLoading)
    return (
      <nav
        className={
          "flex w-full items-center justify-between bg-background px-3 py-2 dark:bg-[#1F1F1F]"
        }
      >
        <Title.Skeleton />
        <div className={"flex items-center gap-x-2"}>
          <Menu.Skeleton />
        </div>
      </nav>
    );

  if (!document) {
    return null;
  }

  return (
    <>
      <nav className={"flex w-full items-center bg-background px-3 py-2 dark:bg-[#1F1F1F]"}>
        {isCollapsed && (
          <MenuIcon
            role={"button"}
            onClick={onResetWidth}
            className={"size-6 text-muted-foreground"}
          />
        )}
        <div className={"flex w-full items-center justify-between"}>
          <Title
            initialData={{
              ...document,
              createdAt: new Date(document.createdAt),
              updatedAt: new Date(document.updatedAt),
            }}
          />
          <div className={"flex items-center gap-x-2"}>
            <Publish
              initialData={{
                ...document,
                createdAt: new Date(document.createdAt),
                updatedAt: new Date(document.updatedAt),
              }}
            />
            <Menu documentId={document.id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document.id} />}
    </>
  );
};
