import client from "@/lib/hono";
import useSWR, { mutate } from "swr";

export const useSidebarDocuments = ({ parentDocumentId }: { parentDocumentId: string }) => {
  const fetcher = async (_: string) => {
    const res = await client.api.documents.sidebar[":parentDocId"].$get({
      param: { parentDocId: parentDocumentId },
    });
    if (!res.ok) {
      return [];
    }
    return res.json().then((data) => data.documents);
  };

  const query = useSWR(`/api/documents/sidebar/${parentDocumentId}`, fetcher);

  const create = async (id?: string) => {
    const res = await client.api.documents.$post({
      json: {
        title: "Untitled",
        parentDocumentId: id,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to create document");
    }
    mutate((key) => typeof key === "string" && key.includes("/api/documents"));
    return res.json();
  };

  const archive = async (id: string) => {
    const res = await client.api.documents[":id"].archive.$post({
      param: { id },
    });
    if (!res.ok) {
      throw new Error("Failed to archive document");
    }
    mutate((key) => typeof key === "string" && key.startsWith("/api/documents"));
    return res.json();
  };

  return { ...query, create, archive };
};
