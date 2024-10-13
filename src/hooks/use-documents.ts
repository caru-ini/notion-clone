import client from "@/lib/hono";
import { documentUpdateSchema } from "@/schemas/documents";
import useSWR, { mutate } from "swr";
import { z } from "zod";

export const useDocuments = () => {
  const fetcher = async (_: string) => {
    const res = await client.api.documents.$get();
    if (!res.ok) {
      return [];
    }
    return await res.json().then((data) => data.documents);
  };

  const query = useSWR("/api/documents", fetcher);

  const create = async () => {
    const res = await client.api.documents.$post({
      json: {
        title: "Untitled",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to create document");
    }
    mutate((key) => typeof key === "string" && key.includes("/api/documents"));
    return res.json();
  };

  const update = async (id: string, params: z.infer<typeof documentUpdateSchema>) => {
    const res = await client.api.documents[":id"].$put({
      param: { id },
      json: params,
    });
    if (!res.ok) {
      return [];
    }
    const document = await res.json().then((data) => data.document);
    mutate((key) => typeof key === "string" && key.includes("/api/documents"));
    return document;
  };

  return { create, update, ...query };
};
