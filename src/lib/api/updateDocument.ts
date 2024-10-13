import client from "@/lib/hono";
import { documentUpdateSchema } from "@/schemas/documents";
import { mutate } from "swr";
import { z } from "zod";

export const updateDocument = async (id: string, params: z.infer<typeof documentUpdateSchema>) => {
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
