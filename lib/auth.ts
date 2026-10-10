import { betterAuth, getAuthTables } from "better-auth";
import { memoryAdapter, type MemoryDB } from "@better-auth/memory-adapter";

// Better Auth instance.
// - Uses the built-in in-memory adapter (no external DB required for this demo).
// - Exposes email/password sign-up + sign-in and social providers.

// Better Auth validates the incoming `Origin` against its resolved base URL.
// Hardcoding `http://localhost:3000` breaks origin checks whenever the dev
// server runs on another port, so localhost hosts are resolved dynamically and
// the explicit env var (used in production) still wins.
const isProduction = process.env.NODE_ENV === "production";

// `baseURL` accepts either a static string or a dynamic host config. Typed via
// the `DynamicBaseURLConfig` shape so the mutable `string[]` is satisfied.
const dynamicBaseURL = {
  allowedHosts: [
    "localhost",
    "127.0.0.1",
    // Covers any dev/preview port, e.g. localhost:3300.
    "localhost:*",
    "127.0.0.1:*",
  ] as string[],
  protocol: (isProduction ? "https" : "http") as "https" | "http",
  fallback: process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000",
};

// The explicit env var (production / previews) wins; localhost hosts resolve
// dynamically so origin checks pass on whatever port the dev server runs on.
const baseURL: string | typeof dynamicBaseURL =
  process.env.BETTER_AUTH_BASE_URL || dynamicBaseURL;

// `socialProviders` is a keyed record (`{ google, github }`), so providers are
// only registered when their credentials exist. That keeps the app bootable in
// local development without OAuth secrets while still wiring up Google/GitHub
// in any environment where they are configured.
const socialProviders: Record<
  string,
  { clientId: string; clientSecret: string }
> = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

const hasSocialProviders = Object.keys(socialProviders).length > 0;

/**
 * In-memory store backed by the official `memoryAdapter`.
 *
 * The *default* (adapter-less) setup accepts writes and returns `{status:true}`
 * but does not persist them, which silently breaks profile updates. Passing a
 * real adapter (even an in-memory one) makes CRUD — including
 * `authClient.updateUser()` — actually stick.
 *
 * `getAuthTables()` seeds every table better-auth needs.
 */
// Next.js can instantiate `lib/auth.ts` several times in one process (once per
// bundle layer: route handlers, server components, etc.). Without a shared
// singleton each instance would get its own empty store, so a sign-up written by
// the API route handler would be invisible to a server component reading the
// session — which silently broke route protection and profile updates.
const globalForAuth = globalThis as typeof globalThis & {
  __bazarDorMemoryDB?: MemoryDB;
};

const memoryDB: MemoryDB =
  globalForAuth.__bazarDorMemoryDB ??
  Object.fromEntries(
    Object.entries(getAuthTables({})).map(([name]) => [name, [] as unknown[]]),
  );
globalForAuth.__bazarDorMemoryDB = memoryDB;

export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "bazar-dor-dev-secret-change-me-32chars!!",
  baseURL,
  database: memoryAdapter(memoryDB),
  emailAndPassword: {
    enabled: true,
  },
  ...(hasSocialProviders ? { socialProviders } : {}),
  user: {
    additionalFields: {
      // Keeps the profile UI in sync with a simple display name.
      displayName: {
        type: "string",
        required: false,
      },
    },
  },
});

export type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;
export type AuthUser = NonNullable<AuthSession>["user"];
