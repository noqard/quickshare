import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold">QuickShare</h1>
      <p className="text-gray-600">Shorten links. Track clicks.</p>
      <Link href="/login" className="rounded bg-black px-4 py-2 text-white">
        Get Started
      </Link>
    </main>
  );
}
