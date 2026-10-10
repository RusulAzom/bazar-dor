"use client";

import { useSyncExternalStore } from "react";
import { getBnDate } from "@/lib/bn-date";

// Stable fallback text rendered during SSR and the first client render pass.
// It keeps the element's text content identical between server and client so
// React never reports a hydration mismatch before the store updates.
const FALLBACK = "তারিখ তৈরি হচ্ছে...";

// useSyncExternalStore is the canonical React way to swap in client-only
// values without a setState-in-effect round trip.
const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function BnDate() {
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  // suppressHydrationWarning also guards against any browser-extension
  // injected attributes (e.g. cz-shortcut-listen) on this element.
  return (
    <span suppressHydrationWarning className="text-xs font-medium text-zinc-500">
      {mounted ? getBnDate() : FALLBACK}
    </span>
  );
}
