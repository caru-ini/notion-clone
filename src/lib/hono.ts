import { type AppType } from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";

const client = hc<AppType>(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000");

export default client;
