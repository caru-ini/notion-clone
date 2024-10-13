"use client";

import { Cover } from "@/components/cover";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocument } from "@/hooks/use-document";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { useMemo } from "react";

type DocumentIdPageProps = {
  params: { documentId: string };
};

const DocumentIdPage: React.FC<DocumentIdPageProps> = ({ params }) => {
  const { data: document, update, isLoading } = useDocument({ documentId: params.documentId });

  const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);

  if (isLoading)
    return (
      <div>
        <Cover.Skeleton />
        <div className={"mx-auto mt-10 md:max-w-3xl lg:max-w-4xl"}>
          <div className={"space-y-4 pl-8 pt-4"}>
            <Skeleton className={"h-14 w-1/2"} />
            <Skeleton className={"h-4 w-4/5"} />
            <Skeleton className={"h-4 w-2/5"} />
            <Skeleton className={"h-4 w-3/5"} />
          </div>
        </div>
      </div>
    );

  if (!document) return redirect("/");

  return (
    <div className={"pb-40"}>
      <Cover preview url={document.coverImage} />
      <div className={"mx-auto md:max-w-3xl lg:max-w-4xl "}>
        <Toolbar
          preview
          initialData={{
            ...document,
            createdAt: new Date(document.createdAt),
            updatedAt: new Date(document.updatedAt),
          }}
        />
        <Editor
          editable={false}
          initialContent={document.content ?? ""}
          onChange={(content) => update({ content })}
        />
      </div>
    </div>
  );
};

export default DocumentIdPage;
