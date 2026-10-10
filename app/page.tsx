import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Hero from "@/components/Hero";
import RiserSection from "@/components/RiserSection";
import FallerSection from "@/components/FallerSection";
import AllProducts from "@/components/AllProducts";
import Year from "@/components/Year";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <Ticker />
      <main className="flex-1">
        <Hero />
        <RiserSection />
        <FallerSection />
        <AllProducts />
      </main>
      <footer className="border-t border-zinc-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-zinc-400 sm:px-6">
          © <Year /> বাজার দর — বাংলাদেশের প্রতিদিনের বাজারের দাম।
        </div>
      </footer>
    </div>
  );
}