"use client";

import { Item } from "@/app/(main)/_components/item";
import { useSidebarDocuments } from "@/hooks/use-sidebar-documents";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

type DocumentListProps = {
  parentDocumentId: string;
  level?: number;
};

export const DocumentList: React.FC<DocumentListProps> = ({ parentDocumentId, level = 0 }) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const {
    data: documents,
    create,
    archive,
    isLoading,
  } = useSidebarDocuments({
    parentDocumentId,
  });

  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (isLoading) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : undefined,
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No pages inside
      </p>
      {documents?.map((document) => (
        <div key={document.id}>
          <Item
            id={document.id}
            onClick={() => onRedirect(document.id)}
            label={document.title}
            documentIcon={document.icon ?? undefined}
            active={params.documentId === document.id}
            level={level}
            onExpand={() => onExpand(document.id)}
            create={create}
            archive={archive}
            expanded={expanded[document.id]}
            icon={FileIcon}
          />
          {expanded[document.id] && (
            <DocumentList parentDocumentId={document.id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};
