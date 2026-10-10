"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

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
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    try {
      const res = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || "সাইন ইন ব্যর্থ হয়েছে। ইমেইল বা পাসওয়ার্ড যাচাই করুন।");
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে!");
      router.replace("/");
    } catch {
      toast.error("একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
          ইমেইল
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
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
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Suspense fallback={null}>
          <AuthRequiredToast />
        </Suspense>

        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-amber-100">
              <Image src="/img/logo-icon.png" alt="বাজার দর লোগো" width={26} height={26} />
            </span>
          </Link>
          <h1 className="mt-3 text-xl font-bold text-zinc-900">সাইন ইন</h1>
          <p className="mt-1 text-sm text-zinc-500">
            পণ্যের বিস্তারিত দাম দেখতে আপনার একাউন্টে সাইন ইন করুন।
          </p>
        </div>

        <Suspense fallback={<div className="mt-6 h-64 rounded-2xl bg-zinc-50" />}>
          <SignInForm />
        </Suspense>

        <p className="mt-4 text-center text-sm text-zinc-500">
          একাউন্ট নেই?{" "}
          <Link href="/signup" className="font-medium text-amber-600 hover:text-amber-700">
            সাইন আপ করুন
          </Link>
        </p>
      </div>
    </div>
  );
}