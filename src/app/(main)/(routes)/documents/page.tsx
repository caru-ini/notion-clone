"use client";

import { Button } from "@/components/ui/button";
import { useDocuments } from "@/hooks/use-documents";
import { PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DocumentPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { create } = useDocuments();

  const onCreate = () => {
    const promise = create().then((document) => {
      if (document) {
        router.push(`/documents/${document.document.id}`);
      }
    });

    toast.promise(promise, {
      loading: "Creating document...",
      success: "Document created",
      error: "Failed to create document",
    });
  };

  return (
    <div className={"flex h-full flex-col items-center justify-center space-y-4"}>
      <Image
        src={"/hero-illustration.png"}
        alt={"Empty"}
        width={1000}
        height={760}
        className={"dark:invert"}
      />
      <h2 className={"text-lg font-medium"}>Welcome to {session?.user?.name}&apos;s Notion</h2>
      <Button onClick={onCreate}>
        <PlusCircle className={"mr-2 size-4"} />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentPage;
