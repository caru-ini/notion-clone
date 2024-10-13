import { z } from "zod";

export const documentCreateSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  icon: z.string().optional(),
  isPublished: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  parentDocumentId: z.string().optional(),
});

export const documentUpdateSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  icon: z.string().optional(),
  isPublished: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  parentDocumentId: z.string().optional(),
});
