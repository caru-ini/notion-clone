"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";

import { useEdgeStore } from "@/lib/edgestore";
import "@blocknote/mantine/style.css";
import { useEffect, useState } from "react";

type EditorProps = {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
};

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const [content, setContent] = useState(initialContent ?? "");
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  const debouncedContent = useDebounce(content, 800);

  const handleUpload = async (file: File) => {
    const url = await edgestore.publicFiles.upload({ file });
    return url;
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    uploadFile: handleUpload,
  });

  useEffect(() => {
    if (debouncedContent !== initialContent) {
      onChange(debouncedContent);
    }
  }, [debouncedContent, initialContent, onChange]);

  editor.onEditorContentChange(() => {
    const jsonContent = JSON.stringify(editor.document, null, 2);
    setContent(jsonContent);
  });

  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
};

export default Editor;
