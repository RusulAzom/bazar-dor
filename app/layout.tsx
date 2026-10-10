import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "বাজার দর — বাংলাদেশের প্রতিদিনের বাজারের দাম",
  description: "বাজার দর প্লাটফর্মের মাধ্যমে বাংলাদেশের প্রধান বাজারগুলোর দৈনিক পণ্যের দাম সংক্রান্ত তথ্য একত্রিত করে ব্যবসায়ী, খামারি ও গৃহবাসীদের সিদ্ধান্ত গ্রহণকে সহজ করে।",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col"
      >
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}