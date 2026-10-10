"use client";

import { createAuthClient } from "better-auth/client";

// BetterAuth browser client. It talks to the API routes mounted at
// /api/auth/[...rest] by hitting `<baseURL>/api/auth/<endpoint>`.
//   - signIn.email({ email, password })
//   - signUp.email({ name, email, password })
//   - signIn.social({ provider: "google" | "github" })
//   - updateUser({ name, image })
//   - getSession(), useSession(), signOut()
export const authClient = createAuthClient({
  // Falls back to the same origin, which works for same-origin deployments.
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL,
});

export type AuthClient = typeof authClient;
