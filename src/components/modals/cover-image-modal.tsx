"use client";

import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { updateDocument } from "@/lib/api/updateDocument";
import { useEdgeStore } from "@/lib/edgestore";
import { useParams } from "next/navigation";
import { useState } from "react";

export const CoverImageModal = () => {
  const params = useParams();
  const { edgestore } = useEdgeStore();
  const coverImage = useCoverImage();

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      let res;

      if (coverImage.url) {
        res = await edgestore.publicFiles.upload({
          file,
          options: {
            replaceTargetUrl: coverImage.url,
          },
        });
      } else {
        res = await edgestore.publicFiles.upload({
          file,
        });
      }

      await updateDocument(params.documentId as string, {
        coverImage: res.url,
      });

      onClose();
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className={"text-center text-lg font-semibold"}>Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className={"w-full outline-none"}
          onChange={onChange}
          disabled={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
