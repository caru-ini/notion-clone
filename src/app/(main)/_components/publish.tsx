"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useOrigin } from "@/hooks/use-origin";
import { updateDocument } from "@/lib/api/updateDocument";
import { Document } from "@prisma/client";
import { Check, Copy, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type PublishProps = {
  initialData: Document;
};

export const Publish = ({ initialData }: PublishProps) => {
  const origin = useOrigin();

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/preview/${initialData.id}`;

  const onPublish = async () => {
    setIsSubmitting(true);

    const promise = updateDocument(initialData.id, {
      isPublished: true,
    });

    toast.promise(promise, {
      loading: "Publishing...",
      success: "Note published",
      error: "Failed to publish note",
    });

    setIsSubmitting(false);
  };

  const onUnpublish = async () => {
    setIsSubmitting(true);

    const promise = updateDocument(initialData.id, {
      isPublished: false,
    });

    toast.promise(promise, {
      loading: "Unpublishing...",
      success: "Note unpublished",
      error: "Failed to unpublish note",
    });

    setIsSubmitting(false);
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={"sm"} variant={"ghost"}>
          Publish
          {initialData.isPublished && <Globe className={"ml-2 size-4 text-sky-500"} />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={"w-72"} align={"end"} alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className={"space-y-4"}>
            <div className={"flex items-center gap-x-2"}>
              <Globe className={"size-4 animate-pulse text-sky-500"} />
              <p className={"text-sm font-medium text-sky-500"}>This note is live on web.</p>
            </div>
            <div className={"flex items-center"}>
              <input
                className={"h-8 flex-1 truncate rounded-l-md border bg-muted px-2 text-xs"}
                value={url}
                disabled
              />
              <Button
                onClick={onCopy}
                className={"h-8 rounded-l-none"}
                size={"sm"}
                disabled={copied}
              >
                {copied ? <Check className={"size-4"} /> : <Copy className={"size-4"} />}
              </Button>
            </div>
            <Button
              onClick={onUnpublish}
              size={"sm"}
              className={"w-full text-xs"}
              disabled={isSubmitting}
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className={"flex flex-col items-center justify-center gap-y-2"}>
            <Globe className={"mb-2 size-8 text-muted-foreground"} />
            <p className={"mb-2 text-sm font-medium"}>Publish this note</p>
            <span className={"mb-4 text-xs text-muted-foreground"}>
              Share your work with others
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className={"w-full text-xs"}
              size={"sm"}
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
