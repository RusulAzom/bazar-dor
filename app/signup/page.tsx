"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import AuthShell from "@/components/AuthShell";
import SocialButtons from "@/components/SocialButtons";
import { authClient } from "@/lib/auth-client";

function SignUpForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm") || "");

    if (!name) {
      toast.error("আপনার নাম লিখুন।");
      setIsPending(false);
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।");
      setIsPending(false);
      return;
    }

    if (password !== confirm) {
      toast.error("পাসওয়ার্ড দুটি মিলছে না। আবার দেখুন।");
      setIsPending(false);
      return;
    }

    const { error } = await authClient.signUp.email({ name, email, password });

    if (error) {
      toast.error(
        error.message || "সাইন আপ ব্যর্থ হয়েছে। সম্ভবত এই ইমেইল আগেই ব্যবহৃত হয়েছে।",
      );
      setIsPending(false);
      return;
    }

    toast.success("অ্যাকাউন্ট তৈরি হয়েছে! বাজার দরে স্বাগতম।");
    router.replace("/");
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
          autoComplete="name"
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
          minLength={8}
          autoComplete="new-password"
          placeholder="অন্তত ৮ অক্ষর"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="confirm" className="block text-sm font-medium text-zinc-700">
          পাসওয়ার্ড নিশ্চিত করুন
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="পাসওয়ার্ড আবার লিখুন"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-zinc-900 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60"
      >
        {isPending ? "অপেক্ষা করুন..." : "সাইন আপ"}
      </button>
    </form>
  );
}

export default function SignUpPage() {
  return (
    <AuthShell
      title="সাইন আপ"
      subtitle="বাজার দরের সকল তথ্য ও পণ্যের বিস্তারিত দাম দেখতে একাউন্ট খুলুন।"
    >
      <Suspense fallback={<div className="mt-6 h-72 rounded-2xl bg-zinc-50" />}>
        <SignUpForm />
      </Suspense>

      <SocialButtons />

      <p className="mt-5 text-center text-sm text-zinc-500">
        আগেই একাউন্ট আছে?{" "}
        <Link href="/signin" className="font-medium text-amber-600 hover:text-amber-700">
          সাইন ইন করুন
        </Link>
      </p>
    </AuthShell>
  );
}
