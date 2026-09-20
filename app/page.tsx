import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold tracking-tight">Ludhiana Burrito</h1>
      <p className="mt-3 text-stone-500">Indian · Sector 32</p>
      <Link
        href="/restaurant/1"
        className="mt-8 rounded-lg bg-stone-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-700"
      >
        See reviews
      </Link>
    </main>
  );
}