import { Hono } from "hono";
import { handle } from "hono/vercel";
import { Session } from "next-auth";
import { documents } from "./documents";

export type Variables = {
  session: Session;
};

const app = new Hono<{ Variables: Variables }>().basePath("/api");

const route = app.route("/documents", documents);

export type AppType = typeof route;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
