# বাজার দর / BazarDor

BazarDor is a real-time essential commodities price tracking web application for Bangladesh. It presents everyday market prices in Bengali, with category browsing, price sorting, and product-level market comparisons.

> **Price data note:** The current app uses a bundled sample catalog in `lib/products.ts`. The ticker and price views update with the app's data; a live external market data feed is not connected yet.

## Features

- **Price tracking and marquee ticker:** Browse commodity prices, daily changes, and a scrolling ticker of selected items.
- **Category browsing and Bengali numeric sorting:** Filter by category and sort prices from low to high or high to low. Bengali numerals are parsed as numbers for correct ordering.
- **Protected product details:** Signed-in users can view dynamic product pages with average, minimum, and maximum prices plus a market-by-market breakdown.
- **User authentication:** Sign up and sign in with email and password. Google and GitHub social login are available when their OAuth credentials are configured through BetterAuth.
- **Profile management:** View the signed-in profile and update the account name.
- **Responsive Bengali interface:** Navigate the catalog on desktop and mobile, with Bengali-formatted numbers and toast feedback for actions.

## Technologies

- [Next.js](https://nextjs.org/) 16 with the App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [BetterAuth](https://www.better-auth.com/)
- [MongoDB Node.js driver](https://www.mongodb.com/docs/drivers/node/current/)
- [Lucide React](https://lucide.dev/) for icons
- [React Hot Toast](https://react-hot-toast.com/) for notifications

## Requirements

- Node.js compatible with the installed Next.js version
- npm (or another Node.js package manager)
- A MongoDB database and connection URI

## Local development

1. Clone the repository and move into the project directory:

   ```bash
   git clone <repository-url>
   cd bazar-dor
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local`, then replace the MongoDB placeholder username and password with your database credentials. Set a strong BetterAuth secret. MongoDB is required for the app to start:

   ```dotenv
   MONGODB_URI=mongodb+srv://<db_username>:<db_password>@bazar-dor-db.tlgt8xu.mongodb.net/?appName=bazar-dor-db
   BETTER_AUTH_SECRET=replace-with-a-long-random-secret
   BETTER_AUTH_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_BETTER_AUTH_BASE_URL=http://localhost:3000
   ```

   Email/password authentication works without OAuth credentials. Add these values to enable social login:

   ```dotenv
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=
   ```

   For each social provider, set its OAuth callback URL to `http://localhost:3000/api/auth/callback/google` or `http://localhost:3000/api/auth/callback/github`, as applicable. Use your deployed origin and provider callback configuration in production.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Authentication storage

BetterAuth stores user, session, and account records in the `bazar-dor` MongoDB database. The MongoDB client is shared across Next.js module reloads, and the official BetterAuth MongoDB adapter uses the client for transactions.

## Deployment

Deploy the Next.js app on a platform that supports App Router applications. Set `MONGODB_URI`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_BASE_URL` in the deployment environment; add OAuth provider credentials when enabling social login.

**Live deployment:** [Add the BazarDor deployment URL here](#)
