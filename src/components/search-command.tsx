"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDocuments } from "@/hooks/use-documents";
import { useSearch } from "@/hooks/use-search";
import { File } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const SearchCommand = () => {
  const session = useSession();
  const router = useRouter();
  const { data: documents } = useDocuments();
  const [isMounted, setIsMounted] = useState(false);
  const toggle = useSearch((state) => state.toggle);
  const isOpen = useSearch((state) => state.isOpen);
  const onClose = () => toggle();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
  };

  if (!isMounted) return null;

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${session.data?.user?.name}'s notion...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading={"Documents"} className={"pb-3"}>
          {documents?.map((document) => (
            <CommandItem
              key={`${document.id}-${document.title}`}
              title={document.title}
              value={document.id}
              onSelect={() => onSelect(document.id)}
            >
              {document.icon ? (
                <p className={"mr-2 text-[18px]"}>{document.icon}</p>
              ) : (
                <span className={"mr-2 size-4"}>
                  <File className={"size-4"} />
                </span>
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
