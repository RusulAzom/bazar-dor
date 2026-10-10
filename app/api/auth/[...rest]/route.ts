import { auth } from "@/lib/auth";

// Better Auth exposes a single `fetch`-compatible handler, so we wrap it and
// export it directly as the route methods.
export const GET = auth.handler;
export const POST = auth.handler;