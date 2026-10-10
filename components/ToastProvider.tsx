"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-center"
      gutter={12}
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: "Arial, Helvetica, sans-serif",
          background: "#1f2937",
          color: "#f9fafb",
          borderRadius: "9999px",
          padding: "10px 18px",
          fontSize: "14px",
        },
      }}
    />
  );
}