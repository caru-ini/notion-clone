"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { useTrash } from "@/hooks/use-trash";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { MouseEvent, useMemo, useState } from "react";
import { toast } from "sonner";

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const { data: documents, restore, deleteDocument, isLoading } = useTrash();

  const [search, setSearch] = useState("");

  const filteredDocuments = useMemo(() => {
    return documents?.filter((document) =>
      document.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [documents, search]);

  const onClick = (id: string) => {
    router.push(`/documents/${id}`);
  };

  const onRestore = (event: MouseEvent<HTMLDivElement>, documentId: string) => {
    event.stopPropagation();
    const promise = restore(documentId);
    toast.promise(promise, {
      loading: "Restoring...",
      success: "Restored!",
      error: "Failed to restore",
    });
  };

  const onDelete = (event: MouseEvent<HTMLDivElement>, documentId: string) => {
    event.stopPropagation();
    const promise = deleteDocument(documentId);
    toast.promise(promise, {
      loading: "Deleting...",
      success: "Deleted!",
      error: "Failed to delete",
    });

    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  if (isLoading)
    return (
      <div className={"flex h-full items-center justify-center p-4"}>
        <Spinner size={"lg"} />
      </div>
    );

  return (
    <div className={"text-sm"}>
      <div className={"flex items-center gap-x-1 p-2"}>
        <Search className={"size-4"} />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={"Search"}
          className={"h-7 bg-secondary px-2 focus-visible:ring-transparent"}
        />
      </div>
      <div className={"mt-2 px-1 pb-1"}>
        <p className={"hidden pb-2 text-center text-xs text-muted-foreground last:block"}>
          No documents found.
        </p>
        {filteredDocuments?.map((document) => (
          <div
            key={document.id}
            role={"button"}
            onClick={() => onClick(document.id)}
            className={
              "flex w-full items-center justify-between rounded-sm text-sm text-primary hover:bg-primary/5"
            }
          >
            <span className={"truncate pl-2"}>{document.title}</span>
            <div className={"flex items-center"}>
              <div
                onClick={(e) => onRestore(e, document.id)}
                role={"button"}
                className={"rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"}
              >
                <Undo className={"size-4"} />
              </div>
              <ConfirmModal onConfirm={() => deleteDocument(document.id)}>
                <div
                  role={"button"}
                  className={"rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"}
                >
                  <Trash className={"size-4 text-muted-foreground"} />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
