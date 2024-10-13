"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { updateDocument } from "@/lib/api/updateDocument";
import { Document } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

type TitleProps = {
  initialData: Document;
};

export const Title = ({ initialData }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialData.title || "Untitled");
  const debouncedTitle = useDebounce(title, 500);

  useEffect(() => {
    if (debouncedTitle !== initialData.title && isEditing) {
      updateDocument(initialData.id, { title: debouncedTitle || "Untitled" });
    }
  }, [debouncedTitle, initialData.id, initialData.title, isEditing]);

  const enableInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateDocument(initialData.id, { title: title || "Untitled" });
      disableInput();
    }
  };

  const onBlur = () => {
    updateDocument(initialData.id, { title: title || "Untitled" });
    disableInput();
  };

  return (
    <div className={"flex items-center gap-x-1"}>
      {!!initialData.title && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          className={"h-7 px-2 focus-visible:ring-transparent"}
          value={title}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      ) : (
        <Button variant={"ghost"} onClick={enableInput} className={"h-auto p-1 font-normal"}>
          <span className={"truncate"}>{initialData.title}</span>
        </Button>
      )}
    </div>
  );
};

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className={"h-9 w-16 rounded-md"} />;
};
