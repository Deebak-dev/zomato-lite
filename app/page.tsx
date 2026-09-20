import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 pt-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-peppercorn">
        Ludhiana Burrito
      </h1>
      <p className="mt-3 text-base text-peppercorn/60">
        Indian · Sector 32
      </p>
      <Link
        href="/restaurant/1"
        className="mt-10 rounded-full bg-cranberry px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-cranberry-dark"
      >
        See reviews
      </Link>
    </main>
  );
}