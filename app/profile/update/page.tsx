"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

type SessionUser = { id: string; name?: string | null; email: string };

/**
 * Hydration-safe session loader.
 *
 * SSR renders the "loading" state so server and client always match. The session
 * is fetched client-side only, and the setState calls sit inside a promise
 * callback rather than the effect body.
 */
function useSessionUser() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "guest">("loading");

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const { data, error } = await authClient.getSession();
        if (!active) return;
        if (error || !data?.user) {
          setStatus("guest");
          return;
        }
        setUser(data.user as SessionUser);
        setStatus("authenticated");
      } catch {
        if (active) setStatus("guest");
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { user, status };
}

function UpdateForm({ user }: { user: SessionUser }) {
  const [name, setName] = useState(user.name ?? "");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("নাম খালি রাখা যাবে না।");
      return;
    }

    setIsPending(true);

    const { error: updateError } = await authClient.updateUser({ name: trimmed });

    if (updateError) {
      const message = updateError.message || "তথ্য হালনাগাদ ব্যর্থ হয়েছে।";
      setError(message);
      toast.error(message);
      setIsPending(false);
      return;
    }

    toast.success("তথ্য সফলভাবে হালনাগাদ হয়েছে!");
    router.replace("/profile");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
          নাম
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="আপনার নাম"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
          ইমেইল
        </label>
        <input
          id="email"
          type="email"
          value={user.email}
          disabled
          readOnly
          className="mt-1 w-full cursor-not-allowed rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500"
        />
        <p className="mt-1 text-xs text-zinc-400">ইমেইল ঠিকানা পরিবর্তন করা যাবে না।</p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="flex flex-col gap-2 pt-2 sm:flex-row">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-full bg-zinc-900 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60"
        >
          {isPending ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
        </button>
        <Link
          href="/profile"
          className="flex-1 rounded-full border border-zinc-300 py-2.5 text-center text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          বাতিল
        </Link>
      </div>
    </form>
  );
}

export default function UpdateProfilePage() {
  const { user, status } = useSessionUser();

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-xl font-bold text-zinc-900">তথ্য হালনাগাদ</h1>
          <p className="mt-1 text-sm text-zinc-500">
            আপনার নাম হালনাগাদ করে প্রোফাইলটি নিজের প্রয়োজন অনুযায়ী সাজান।
          </p>
        </div>

        {status === "loading" && (
          <div className="mt-6 animate-pulse space-y-4">
            <div className="h-10 rounded bg-zinc-100" />
            <div className="h-10 rounded bg-zinc-100" />
          </div>
        )}

        {status === "guest" && (
          <div
            className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
            role="alert"
          >
            তথ্য হালনাগাদ করতে আগে সাইন ইন করুন।{" "}
            <Link href="/signin" className="font-semibold underline">
              সাইন ইন পেজে যান
            </Link>
            ।
          </div>
        )}

        {/* `key` remounts the form so the controlled input seeds from user.name
            without needing a prefill effect. */}
        {status === "authenticated" && user && (
          <UpdateForm key={user.id} user={user} />
        )}
      </div>
    </div>
  );
}
