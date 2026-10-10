"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

function SignUpForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।");
      setIsPending(false);
      return;
    }

    if (password !== String(form.get("confirm") || "")) {
      toast.error("পাসওয়ার্ড দুটি মিলছে না। আবার দেখুন।");
      setIsPending(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || "সাইন আপ ব্যর্থ হয়েছে। সম্ভবত এই ইমেইল আগেই ব্যবহৃত হয়েছে।");
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এখন সাইন আপ করুন।");
      router.replace("/signin");
    } catch {
      toast.error("একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
          নাম
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
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
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-amber-100">
              <Image src="/img/logo-icon.png" alt="বাজার দর লোগো" width={26} height={26} />
            </span>
          </Link>
          <h1 className="mt-3 text-xl font-bold text-zinc-900">সাইন আপ</h1>
          <p className="mt-1 text-sm text-zinc-500">
            বাজার দরের সকল তথ্য ও পণ্যের বিস্তারিত দাম দেখতে একাউন্ট খুলুন।
          </p>
        </div>

        <Suspense fallback={<div className="mt-6 h-72 rounded-2xl bg-zinc-50" />}>
          <SignUpForm />
        </Suspense>

        <p className="mt-4 text-center text-sm text-zinc-500">
          আগেই একাউন্ট আছে?{" "}
          <Link href="/signin" className="font-medium text-amber-600 hover:text-amber-700">
            সাইন ইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
}