import client from "@/lib/hono";
import useSWR, { mutate } from "swr";

export const useTrash = () => {
  const fetcher = async (_: string) => {
    const res = await client.api.documents.trash.$get();
    if (!res.ok) {
      return [];
    }
    return res.json().then((data) => data.documents);
  };

  const query = useSWR(`/api/documents/trash`, fetcher);

  const restore = async (id: string) => {
    const res = await client.api.documents[":id"].restore.$post({ param: { id } });
    if (!res.ok) {
      throw new Error("Failed to restore document");
    }
    mutate((key) => typeof key === "string" && key.startsWith("/api/documents"));
  };

  const deleteDocument = async (id: string) => {
    const res = await client.api.documents[":id"].$delete({ param: { id } });
    if (!res.ok) {
      throw new Error("Failed to delete document");
    }
    mutate((key) => typeof key === "string" && key.startsWith("/api/documents"));
  };

  return { ...query, restore, deleteDocument };
};
