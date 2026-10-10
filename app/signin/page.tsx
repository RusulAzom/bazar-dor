"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import AuthShell from "@/components/AuthShell";
import SocialButtons from "@/components/SocialButtons";
import { authClient } from "@/lib/auth-client";

/** Shows the "sign in required" toast when redirected from a protected route. */
function AuthRequiredToast() {
  const searchParams = useSearchParams();
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current) return;
    if (searchParams.get("error") === "auth_required") {
      shown.current = true;
      toast.error("পণ্যের বিস্তারিত দাম দেখতে আগে সাইন ইন করুন।");
    }
  }, [searchParams]);

  return null;
}

function SignInForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    if (!email || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড উভয়ই দিন।");
      setIsPending(false);
      return;
    }

    const { error } = await authClient.signIn.email({ email, password });

    if (error) {
      toast.error(error.message || "সাইন ইন ব্যর্থ হয়েছে। ইমেইল বা পাসওয়ার্ড যাচাই করুন।");
      setIsPending(false);
      return;
    }

    toast.success("সফলভাবে সাইন ইন হয়েছে!");
    router.replace("/");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
          ইমেইল
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="example@mail.com"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
          পাসওয়ার্ড
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="********"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-zinc-900 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60"
      >
        {isPending ? "অপেক্ষা করুন..." : "সাইন ইন"}
      </button>
    </form>
  );
}

export default function SignInPage() {
  return (
    <AuthShell
      title="সাইন ইন"
      subtitle="পণ্যের বিস্তারিত দাম দেখতে আপনার একাউন্টে সাইন ইন করুন।"
    >
      <Suspense fallback={null}>
        <AuthRequiredToast />
      </Suspense>

      <Suspense fallback={<div className="mt-6 h-64 rounded-2xl bg-zinc-50" />}>
        <SignInForm />
      </Suspense>

      <SocialButtons />

      <p className="mt-5 text-center text-sm text-zinc-500">
        একাউন্ট নেই?{" "}
        <Link href="/signup" className="font-medium text-amber-600 hover:text-amber-700">
          সাইন আপ করুন
        </Link>
      </p>
    </AuthShell>
  );
}
