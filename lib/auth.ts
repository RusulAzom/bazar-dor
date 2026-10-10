import { betterAuth } from "better-auth";

// Better Auth instance.
// - Uses the built-in in-memory adapter (no external DB required for this demo).
// - Exposes email/password sign-up and sign-in.
// - `baseURL` is read from the environment with a sane fallback.
export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "bazar-dor-dev-secret-change-me-32chars!!",
  baseURL: process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      // Keep the profile UI in sync with a simple display name.
      displayName: {
        type: "string",
        required: false,
      },
    },
  },
});

export type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;