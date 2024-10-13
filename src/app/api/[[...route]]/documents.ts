import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { documentCreateSchema, documentUpdateSchema } from "@/schemas/documents";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const documents = new Hono()
  .get("/", async (c) => {
    const session = await auth();
    if (!session?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const documents = await prisma.document.findMany({
      where: {
        userId: session?.user?.id,
        isArchived: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return c.json({ documents });
  })
  .get("/sidebar", async (c) => {
    const session = await auth();
    if (!session?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const documents = await prisma.document.findMany({
      where: {
        userId: session?.user?.id,
        parentDocumentId: null,
        isArchived: false,
      },
    });
    return c.json({ documents });
  })
  .get("/sidebar/:parentDocId", async (c) => {
    const session = await auth();
    if (!session?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const { parentDocId } = c.req.param();
    const documents = await prisma.document.findMany({
      where: {
        userId: session?.user?.id,
        parentDocumentId: parentDocId,
        isArchived: false,
      },
    });
    return c.json({ documents });
  })
  .get("/trash", async (c) => {
    const session = await auth();
    if (!session?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const documents = await prisma.document.findMany({
      where: { userId: session.user.id, isArchived: true },
    });
    return c.json({ documents });
  })
  .get("/:id", async (c) => {
    const session = await auth();
    const { id } = c.req.param();
    const document = await prisma.document.findUnique({
      where: {
        id,
      },
    });
    if (!document || (!document.isPublished && session?.user?.id !== document.userId)) {
      return c.json({ error: "Document not found" }, 404);
    }
    return c.json({ document });
  })
  .post("/", zValidator("json", documentCreateSchema), async (c) => {
    const session = await auth();

    if (!session?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const newDocument = c.req.valid("json");
    const document = await prisma.document.create({
      data: {
        ...newDocument,
        userId: session.user.id!,
        parentDocumentId: newDocument.parentDocumentId ?? null,
      },
    });
    if (!document) {
      return c.json({ error: "Failed to create document" }, 500);
    }
    return c.json({ document });
  })
  .put("/:id", zValidator("json", documentUpdateSchema), async (c) => {
    const session = await auth();
    if (!session?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const { id } = c.req.param();
    const existingDocument = await prisma.document.findUnique({
      where: { id, userId: session.user.id },
    });
    if (!existingDocument) {
      return c.json({ error: "Document not found" }, 404);
    }
    const newDocument = c.req.valid("json");
    const updatedDocument = await prisma.document.update({
      where: { id },
      data: newDocument,
    });
    return c.json({ document: updatedDocument });
  })
  .post("/:id/archive", async (c) => {
    const session = await auth();
    if (!session?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { id } = c.req.param();

    const existingDocument = await prisma.document.findUnique({
      where: { id, userId: session.user.id },
    });
    if (!existingDocument) {
      return c.json({ error: "Document not found" }, 404);
    }

    const recursiveArchive = async (id: string) => {
      // recursively archive all children
      const children = await prisma.document.findMany({
        where: {
          userId: session?.user?.id,
          parentDocumentId: id,
        },
      });
      for (const child of children) {
        await prisma.document.update({
          where: { id: child.id },
          data: { isArchived: true },
        });

        await recursiveArchive(child.id);
      }
    };

    await recursiveArchive(id);

    const document = await prisma.document.update({
      where: { id, userId: session.user.id },
      data: { isArchived: true },
    });
    return c.json({ document });
  })
  .post("/:id/restore", async (c) => {
    const session = await auth();
    if (!session?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const { id } = c.req.param();
    const existingDocument = await prisma.document.findUnique({
      where: { id, userId: session.user.id },
    });
    if (!existingDocument) {
      return c.json({ error: "Document not found" }, 404);
    }

    const recursiveRestore = async (id: string) => {
      const children = await prisma.document.findMany({
        where: {
          userId: session?.user?.id,
          parentDocumentId: id,
        },
      });
      for (const child of children) {
        await prisma.document.update({
          where: { id: child.id },
          data: { isArchived: false },
        });

        await recursiveRestore(child.id);
      }
    };

    if (existingDocument.parentDocumentId) {
      const parentDocument = await prisma.document.findUnique({
        where: { id: existingDocument.parentDocumentId, userId: session.user.id },
      });
      if (!parentDocument) {
        return c.json({ error: "Parent document not found" }, 404);
      }
      await prisma.document.update({
        where: { id: parentDocument.id },
        data: {
          isArchived: false,
          parentDocumentId: parentDocument.parentDocumentId
            ? null
            : parentDocument.parentDocumentId,
        },
      });

      await recursiveRestore(parentDocument.id);
    }

    const restoredDocument = await prisma.document.update({
      where: { id, userId: session.user.id },
      data: { isArchived: false },
    });

    return c.json({ document: restoredDocument });
  })
  .delete("/:id", async (c) => {
    const session = await auth();
    if (!session?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const { id } = c.req.param();
    const res = await prisma.document.delete({
      where: { id, userId: session.user.id },
    });
    if (!res) {
      return c.json({ error: "Document not found" }, 404);
    }
    return c.json({ success: true });
  });
