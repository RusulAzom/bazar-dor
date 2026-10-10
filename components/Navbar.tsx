"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { CATEGORIES } from "@/lib/types";
import BnDate from "@/components/BnDate";
import { authClient } from "@/lib/auth-client";

type SessionUser = { id: string; name?: string | null; email: string };

// Module-level cache so the desktop and mobile auth areas share one request.
let sessionCache: { user: SessionUser | null } | null = null;
let sessionRequest: Promise<void> | null = null;

function loadSession(): Promise<void> {
  if (sessionCache) return Promise.resolve();
  if (!sessionRequest) {
    sessionRequest = (async () => {
      try {
        const { data } = await authClient.getSession();
        sessionCache = { user: (data?.user as SessionUser) ?? null };
      } catch {
        sessionCache = { user: null };
      }
    })();
  }
  return sessionRequest;
}

/**
 * Hydration-safe session hook.
 *
 * The server and the first client render both yield `user = null`, so the markup
 * matches. The session is then resolved asynchronously (the setState calls live
 * inside a promise callback, never synchronously in the effect body).
 */
function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    void loadSession().then(() => {
      if (!active) return;
      setUser(sessionCache?.user ?? null);
      setLoaded(true);
    });

    return () => {
      active = false;
    };
  }, []);

  function clearSession() {
    sessionCache = { user: null };
    sessionRequest = null;
    setUser(null);
  }

  return { user, loaded, clearSession };
}

function UserAvatar({ name }: { name?: string | null }) {
  const initial = (name || "ই").trim().charAt(0);
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
      {initial}
    </span>
  );
}

function AuthPlaceholder() {
  return (
    <span className="inline-block h-9 w-24 rounded-full bg-zinc-100" aria-hidden />
  );
}

function DesktopAuth() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const { user, loaded, clearSession } = useSession();

  async function handleSignOut() {
    setLoggingOut(true);
    const { error } = await authClient.signOut();
    setLoggingOut(false);

    if (error) {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
      return;
    }

    clearSession();
    toast.success("সাইন আউট হয়েছে।");
    router.replace("/");
  }

  if (!loaded) {
    return (
      <div className="hidden sm:flex" aria-hidden>
        <AuthPlaceholder />
      </div>
    );
  }

  if (user) {
    return (
      <div className="hidden items-center gap-2 sm:flex">
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-full border border-zinc-200 py-1.5 pl-1.5 pr-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          <UserAvatar name={user.name} />
          প্রোফাইল
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={loggingOut}
          className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60"
        >
          {loggingOut ? "..." : "সাইন আউট"}
        </button>
      </div>
    );
  }

  return (
    <nav className="hidden items-center gap-2 sm:flex">
      <Link
        href="/signin"
        className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
      >
        সাইন ইন
      </Link>
      <Link
        href="/signup"
        className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-700"
      >
        সাইন আপ
      </Link>
    </nav>
  );
}

function MobileAuth() {
  const router = useRouter();
  const { user, loaded, clearSession } = useSession();

  async function handleSignOut() {
    await authClient.signOut();
    clearSession();
    toast.success("সাইন আউট হয়েছে।");
    router.replace("/");
  }

  if (!loaded) {
    return (
      <div className="h-12 rounded-full bg-zinc-100" aria-hidden />
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/profile"
          className="flex flex-1 items-center gap-2 rounded-full border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700"
        >
          <UserAvatar name={user.name} />
          প্রোফাইল
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700"
        >
          সাইন আউট
        </button>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/signin"
        className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700"
      >
        সাইন ইন
      </Link>
      <Link
        href="/signup"
        className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
      >
        সাইন আপ
      </Link>
    </>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top row */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <Image
              src="/img/logo-icon.png"
              alt="বাজার দর লোগো"
              width={22}
              height={22}
              priority
            />
          </span>
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            বাজার দর
          </span>
        </Link>

        <div className="ml-auto hidden text-right sm:block">
          <p className="text-xs font-medium text-zinc-500">
            <BnDate />
          </p>
        </div>

        <DesktopAuth />

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-zinc-700 sm:hidden"
          aria-label="মেনু টুলগ"
          onClick={() => setIsOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-zinc-100 bg-white px-4 py-3 sm:hidden">
          <p className="mb-3 text-xs font-medium text-zinc-500">
            <BnDate />
          </p>
          <div className="flex flex-col gap-2">
            <MobileAuth />
          </div>
        </div>
      )}

      {/* Category row */}
      <div className="border-t border-zinc-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav
            aria-label="ক্যাটাগরি"
            className="-mx-1 flex gap-1 overflow-x-auto py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none [scrollbar-width:none] [&>a]:shrink-0"
          >
            {CATEGORIES.map((c) => {
              const active = pathname === `/category/${c.key}`;
              return (
                <Link
                  key={c.key}
                  href={`/category/${c.key}`}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-amber-100 text-amber-800"
                      : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  <span aria-hidden className="text-base leading-none">
                    {c.icon}
                  </span>
                  {c.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
