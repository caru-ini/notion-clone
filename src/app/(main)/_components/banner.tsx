"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useDocument } from "@/hooks/use-document";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type BannerProps = {
  documentId: string;
};

export const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();

  const { remove, restore } = useDocument({ documentId });

  const onRemove = () => {
    const promise = remove().then(() => router.push("/documents"));

    toast.promise(promise, {
      loading: "Removing...",
      success: "Document removed",
      error: "Error removing document",
    });
  };

  const onRestore = () => {
    const promise = restore();

    toast.promise(promise, {
      loading: "Restoring...",
      success: "Document restored",
      error: "Error restoring document",
    });
  };

  return (
    <div
      className={
        "flex w-full items-center justify-center gap-x-2 bg-rose-500 p-2 text-center text-sm text-white"
      }
    >
      <p>This page is in the Trash.</p>
      <Button
        size={"sm"}
        variant={"outline"}
        className={"h-auto border-white bg-transparent p-1 px-2 font-normal hover:text-white"}
        onClick={onRestore}
      >
        Restore page
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size={"sm"}
          variant={"outline"}
          className={"h-auto border-white bg-transparent p-1 px-2 font-normal hover:text-white"}
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
};
