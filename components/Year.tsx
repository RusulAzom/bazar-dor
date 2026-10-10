"use client";

import { useSyncExternalStore } from "react";

// Stable fallback rendered during SSR and the first client render pass so the
// markup matches exactly (avoids a hydration mismatch from new Date()).
const FALLBACK = "২০২৬";

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Year() {
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  return <span suppressHydrationWarning>{mounted ? new Date().getFullYear() : FALLBACK}</span>;
}
