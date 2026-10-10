import Link from "next/link";
import Image from "next/image";

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-amber-100">
              <Image src="/img/logo-icon.png" alt="বাজার দর লোগো" width={26} height={26} priority />
            </span>
          </Link>
          <h1 className="mt-3 text-xl font-bold text-zinc-900">{title}</h1>
          <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
}
