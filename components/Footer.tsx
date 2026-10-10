"use client";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-700">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm">
            <p>বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে。</p>
            <p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়。</p>
          </div>
          <div className="text-right text-sm">
            <p>© 2026 বাজার দর — বাংলাদেশের প্রতিদিনের বাজারের দাম。</p>
          </div>
        </div>
      </div>
    </footer>
  );
}