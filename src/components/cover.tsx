"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCoverImage } from "@/hooks/use-cover-image";
import { updateDocument } from "@/lib/api/updateDocument";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

interface CoverImageProps {
  url?: string | null;
  preview?: boolean;
}

export const Cover = ({ url, preview }: CoverImageProps) => {
  const params = useParams();
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();

  const onRemove = () => {
    if (!url) return;
    edgestore.publicFiles.delete({ url });
    updateDocument(params.documentId as string, {
      coverImage: "",
    });
  };

  return (
    <div className={cn("group relative h-[35vh] w-full", !url && "h-[12vh]", url && "bg-muted")}>
      {!!url && <Image src={url} alt={"Cover"} fill className={"object-cover"} />}
      {url && !preview && (
        <div
          className={
            "absolute bottom-5 right-5 flex items-center gap-x-2 opacity-0 group-hover:opacity-100"
          }
        >
          <Button
            onClick={() => coverImage.onReplace(url)}
            className={"text-xs text-muted-foreground"}
            variant={"outline"}
            size={"sm"}
          >
            <ImageIcon className={"mr-2 size-4"} />
            Change cover
          </Button>
          <Button
            onClick={onRemove}
            className={"text-xs text-muted-foreground"}
            variant={"outline"}
            size={"sm"}
          >
            <X className={"mr-2 size-4"} />
            Remove cover
          </Button>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className={"h-[35vh] w-full"} />;
};
