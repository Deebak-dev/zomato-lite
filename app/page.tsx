import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-tyrolean to-tyrolean">
      <section className="mx-auto flex max-w-[560px] flex-col items-center px-6 pb-14 pt-20 text-center">
        <p className="rounded-full bg-cranberry/10 px-3 py-1 text-xs font-semibold tracking-wider text-cranberry">
          REVIEW APP
        </p>
        <h1 className="mt-6 text-5xl font-bold tracking-tight text-peppercorn">
          Ludhiana Burrito
        </h1>
        <p className="mt-4 text-base text-peppercorn/60">Indian · Sector 32</p>
        <Link
          href="/restaurant/1"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-cranberry px-8 py-3 text-sm font-medium text-white shadow-md shadow-cranberry/30 transition-colors hover:bg-cranberry-dark"
        >
          See reviews
        </Link>
        <p className="mt-4 text-xs text-peppercorn/40">
          Powered by real reviews from real foodies.
        </p>
      </section>

      <section className="mx-auto max-w-[560px] px-6 pb-16">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-peppercorn/10 bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-cranberry">01</p>
            <p className="mt-2 text-sm font-medium text-peppercorn">Explore</p>
            <p className="mt-1 text-xs text-peppercorn/50">
              Find your next meal
            </p>
          </div>
          <div className="rounded-xl border border-peppercorn/10 bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-rating-green">02</p>
            <p className="mt-2 text-sm font-medium text-peppercorn">Rate</p>
            <p className="mt-1 text-xs text-peppercorn/50">
              Tap the stars that fit
            </p>
          </div>
          <div className="rounded-xl border border-peppercorn/10 bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-star-amber">03</p>
            <p className="mt-2 text-sm font-medium text-peppercorn">Share</p>
            <p className="mt-1 text-xs text-peppercorn/50">
              Help others decide
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-white p-5 text-center shadow-sm">
          <p className="text-sm font-medium text-peppercorn">
            Ratings are calculated live from every review.
          </p>
          <p className="mt-1 text-xs text-peppercorn/50">
            One restaurant, one page, one honest average.
          </p>
        </div>
      </section>
    </main>
  );
}