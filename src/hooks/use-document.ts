import { updateDocument } from "@/lib/api/updateDocument";
import client from "@/lib/hono";
import { documentUpdateSchema } from "@/schemas/documents";
import useSWR, { mutate } from "swr";
import { z } from "zod";

export const useDocument = ({ documentId }: { documentId: string }) => {
  const fetcher = async (_: string) => {
    const res = await client.api.documents[":id"].$get({ param: { id: documentId } });
    if (!res.ok) {
      return null;
    }
    return await res.json().then((data) => data.document);
  };

  const query = useSWR(`/api/documents/${documentId}`, fetcher);

  const update = async (params: z.infer<typeof documentUpdateSchema>) => {
    return updateDocument(documentId, params);
  };

  const remove = async () => {
    const res = await client.api.documents[":id"].$delete({ param: { id: documentId } });
    if (!res.ok) {
      return null;
    }
    mutate((key) => typeof key === "string" && key.startsWith(`/api/documents`));
  };

  const restore = async () => {
    const res = await client.api.documents[":id"].restore.$post({ param: { id: documentId } });
    if (!res.ok) {
      return null;
    }
    mutate((key) => typeof key === "string" && key.startsWith(`/api/documents`));
  };

  const archive = async () => {
    const res = await client.api.documents[":id"].archive.$post({ param: { id: documentId } });
    if (!res.ok) {
      return null;
    }
    mutate((key) => typeof key === "string" && key.startsWith(`/api/documents`));
  };

  return { update, remove, restore, archive, ...query };
};
