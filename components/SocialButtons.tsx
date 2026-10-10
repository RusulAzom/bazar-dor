"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.06 12.25c0-.85-.08-1.67-.22-2.45H12v4.64h6.2a5.31 5.31 0 0 1-2.3 3.48v2.9h3.72c2.18-2 3.44-4.96 3.44-8.57Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.12 0 5.74-1.03 7.65-2.8l-3.72-2.89c-1.03.69-2.36 1.1-3.93 1.1-3.01 0-5.57-2.03-6.48-4.77H1.68v3a11.99 11.99 0 0 0 10.32 7.36Z"
      />
      <path
        fill="#FBBC05"
        d="M5.52 14.64A7.2 7.2 0 0 1 5.14 12c0-.92.16-1.8.38-2.64v-3H1.68a11.99 11.99 0 0 0 0 10.84l3.84-3.2Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.7 0 3.22.58 4.42 1.73l3.3-3.3C17.73 1.19 15.11 0 12 0 7.04 0 2.76 2.9.68 7.36l4.84 3c.91-2.74 3.47-4.6 6.48-4.6Z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.38 7.86 10.9.58.1.79-.25.79-.55v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.42.36.79 1.07.79 2.16v3.2c0 .3.21.66.8.55A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export default function SocialButtons() {
  const [pending, setPending] = useState<string | null>(null);

  async function onSocial(provider: "google" | "github") {
    setPending(provider);
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/profile",
      });

      // On success the browser is sent to the provider's consent screen, so any
      // resolved response here means the flow did not start.
      if (error) {
        toast.error(
          error.message || "সামাজিক লগইন শুরু করা যায়নি। সরবারাহকারী সক্রিয় কিনা যাচাই করুন।",
        );
      }
    } catch {
      toast.error("সামাজিক লগইনে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="mt-5">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-zinc-400">অথবা</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSocial("google")}
          disabled={pending !== null}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60"
        >
          {pending === "google" ? (
            <Spinner />
          ) : (
            <GoogleIcon />
          )}
          Google
        </button>
        <button
          type="button"
          onClick={() => onSocial("github")}
          disabled={pending !== null}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60"
        >
          {pending === "github" ? <Spinner /> : <GithubIcon />}
          GitHub
        </button>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4.5 w-4.5 animate-spin text-zinc-400" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
    </svg>
  );
}
