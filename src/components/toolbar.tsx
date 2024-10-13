"use client";

import { IconPicker } from "@/components/icon-picker";
import { Button } from "@/components/ui/button";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useDebounce } from "@/hooks/use-debounce";
import { updateDocument } from "@/lib/api/updateDocument";
import { Document } from "@prisma/client";
import { ImageIcon, Smile, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

type ToolbarProps = {
  initialData: Document;
  preview?: boolean;
};

export const Toolbar: React.FC<ToolbarProps> = ({ initialData, preview }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialData.title);
  const coverImage = useCoverImage();
  const debouncedTitle = useDebounce(title, 500);

  useEffect(() => {
    if (debouncedTitle !== initialData.title && isEditing) {
      updateDocument(initialData.id, { title: debouncedTitle || "Untitled" });
    }
  }, [debouncedTitle, initialData.id, initialData.title, isEditing]);

  const enableInput = () => {
    if (preview) return;

    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onInput = (value: string) => {
    setTitle(value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      updateDocument(initialData.id, { title: title || "Untitled" });
      disableInput();
    }
  };

  const onIconSelect = (icon: string) => {
    updateDocument(initialData.id, { icon });
  };

  const removeIcon = () => {
    updateDocument(initialData.id, { icon: "" });
  };

  return (
    <div className={"group relative pl-[54px]"}>
      {!!initialData.icon && !preview && (
        <div className={"group/icon flex items-center gap-x-2 pt-6"}>
          <IconPicker onChange={onIconSelect} asChild>
            <p className={"text-6xl transition hover:opacity-75"}>{initialData.icon}</p>
          </IconPicker>
          <Button
            onClick={removeIcon}
            className={
              "rounded-full text-xs text-muted-foreground opacity-0 transition group-hover/icon:opacity-100"
            }
            size={"icon"}
            variant={"ghost"}
          >
            <X className={"size-4"} />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && <p className={"pt-6 text-6xl"}>{initialData.icon}</p>}
      <div className={"flex items-center gap-x-1 py-4 opacity-0 group-hover:opacity-100 "}>
        {!initialData.icon && !preview && (
          <IconPicker onChange={onIconSelect} asChild>
            <Button className={"text-xs text-muted-foreground"} variant={"outline"} size={"sm"}>
              <Smile className={"mr-2 size-4"} />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className={"text-xs text-muted-foreground"}
            variant={"outline"}
            size={"sm"}
          >
            <ImageIcon className={"mr-2 size-4"} />
            Add cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={title}
          onChange={(e) => onInput(e.target.value)}
          className={
            "resize-none break-words bg-transparent text-5xl font-bold text-[#3F3F3F] outline-none dark:text-[#CFCFCF]"
          }
        />
      ) : (
        <div
          className={
            "break-words pb-[11.5px] text-5xl font-bold text-[#3F3F3F] outline-none dark:text-[#CFCFCF]"
          }
          onClick={enableInput}
        >
          {initialData.title}
        </div>
      )}
    </div>
  );
};
