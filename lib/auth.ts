import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// Better Auth stores users, sessions, and accounts in MongoDB.
// Email/password and configured social providers use the same database.

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error(
    "MONGODB_URI is required. Add your MongoDB connection string to .env.local.",
  );
}

// Reuse one connection pool across Next.js module reloads and server bundles.
const globalForMongo = globalThis as typeof globalThis & {
  __bazarDorMongoClient?: MongoClient;
};

const mongoClient =
  globalForMongo.__bazarDorMongoClient ?? new MongoClient(mongoUri);
globalForMongo.__bazarDorMongoClient = mongoClient;
const db = mongoClient.db("bazar-dor");

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

export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "bazar-dor-dev-secret-change-me-32chars!!",
  baseURL,
  database: mongodbAdapter(db, { client: mongoClient }),
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
