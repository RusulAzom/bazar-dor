import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "প্রোফাইল — বাজার দর",
};

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse px-4 py-8 sm:px-6">
      <div className="h-6 w-40 rounded bg-zinc-100" />
      <div className="mt-4 h-16 w-16 rounded-full bg-zinc-100" />
      <div className="mt-4 h-20 rounded bg-zinc-100" />
      <div className="mt-8 h-4 w-28 rounded bg-zinc-100" />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Suspense fallback={<div className="h-[84px] bg-white" />}>
        <Navbar />
      </Suspense>
      <Ticker />
      <main className="flex-1">
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileDetails />
        </Suspense>
      </main>
      <footer className="border-t border-zinc-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-zinc-400 sm:px-6">
          © ২০২৬ বাজার দর — বাংলাদেশের প্রতিদিনের বাজারের দাম।
        </div>
      </footer>
    </div>
  );
}

async function ProfileDetails() {
  const session = await auth.api.getSession({ headers: await headers() });

  // Protected route: bounce guests to the sign-in page.
  if (!session) {
    redirect("/signin?error=auth_required");
  }

  const user = session.user;
  const initial = (user.name || user.email || "ই").trim().charAt(0);

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 pt-8 sm:px-6">
        <h1 className="text-2xl font-bold text-zinc-900">আমার প্রোফাইল</h1>
        <p className="mt-1 text-sm text-zinc-500">
          আপনার একাউন্টের তথ্য ও সংরূপিত বিবরণ নিচে দেখানো হচ্ছে।
        </p>

        <div className="mt-6 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-amber-700">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-zinc-900">
                {user.name || "নাম দেওয়া হয়নি"}
              </p>
              <p className="truncate text-sm text-zinc-500">{user.email}</p>
            </div>
          </div>

          <dl className="mt-6 divide-y divide-zinc-100">
            <Row label="নাম" value={user.name || "নাম দেওয়া হয়নি"} />
            <Row label="ইমেইল" value={user.email} />
          </dl>

          <Link
            href="/profile/update"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            তথ্য হালনাগাদ করুন
          </Link>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-sm text-zinc-500">{label}</dt>
      <dd className="truncate text-sm font-medium text-zinc-900">{value}</dd>
    </div>
  );
}
