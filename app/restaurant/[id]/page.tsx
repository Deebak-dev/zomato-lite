"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
};

type RestaurantData = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  latestReview: Review | null;
  reviews: Review[];
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-star-amber" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-peppercorn/15">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function RestaurantPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<RestaurantData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/restaurants/${params.id}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (json) setData(json);
      })
      .catch(() => setNotFound(true));
  }, [params.id]);

  if (notFound) {
    return (
      <main className="mx-auto flex min-h-screen max-w-[560px] flex-col justify-center px-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Restaurant not found.
        </h1>
        <p className="mt-2 text-sm text-peppercorn/60">
          This restaurant doesn&apos;t exist on Zomato Lite.
        </p>
        <Link href="/" className="mt-6 text-sm font-medium text-cranberry hover:underline">
          Back home
        </Link>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto flex min-h-screen max-w-[560px] items-center justify-center px-6">
        <p className="text-sm text-peppercorn/60">Loading…</p>
      </main>
    );
  }

  const hasReviews = data.latestReview !== null;

  return (
    <main className="mx-auto max-w-[560px] px-6 py-10">
      <Link href="/" className="text-sm font-medium text-cranberry hover:underline">
        ← Back
      </Link>

      <section className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex gap-2">
          <span className="rounded-full bg-tyrolean px-3 py-1 text-xs font-medium text-peppercorn/70">
            {data.cuisine}
          </span>
          <span className="rounded-full bg-tyrolean px-3 py-1 text-xs font-medium text-peppercorn/70">
            {data.area}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-peppercorn">
          {data.name}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          {hasReviews ? (
            <div>
              <div className="flex items-center gap-1 rounded-lg bg-rating-green px-3 py-2 text-white">
                <span className="text-sm font-bold">★</span>
                <span className="text-2xl font-bold">{data.averageRating}</span>
              </div>
              <p className="mt-2 text-xs text-peppercorn/50">
                {data.totalReviews} review{data.totalReviews === 1 ? "" : "s"} at Zomato Lite
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-1 rounded-lg bg-rating-green px-3 py-2 text-white">
                <span className="text-2xl font-bold">—</span>
              </div>
              <p className="mt-2 text-xs text-peppercorn/50">
                0 reviews yet — be the first
              </p>
            </div>
          )}

          <Link
            href={`/review/${params.id}`}
            className="ml-auto rounded-full bg-cranberry px-6 py-3 text-sm font-medium text-white shadow-md shadow-cranberry/30 transition-colors hover:bg-cranberry-dark"
          >
            Write a review
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="px-1 text-sm font-semibold tracking-wide text-peppercorn/60">
          OVERVIEW
        </h2>
        <div className="mt-3 space-y-4">
          <div className="rounded-xl border border-cranberry/15 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-wider text-cranberry">
              LATEST REVIEW
            </p>
            <p className="mt-2 text-lg font-semibold text-peppercorn">
              {data.latestReview?.comment}
            </p>
            {data.latestReview && (
              <p className="mt-2 text-sm">
                <Stars rating={data.latestReview.rating} />
              </p>
            )}
          </div>

          {data.reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl bg-white p-5 shadow-sm"
            >
              <p className="text-peppercorn">{review.comment}</p>
              <p className="mt-2 text-sm">
                <Stars rating={review.rating} />
              </p>
            </div>
          ))}

          {!hasReviews && (
            <div className="rounded-xl bg-white p-6 text-center shadow-sm">
              <p className="text-sm text-peppercorn/60">
                No reviews yet.
                <Link
                  href={`/review/${params.id}`}
                  className="ml-1 font-medium text-cranberry hover:underline"
                >
                  Write the first one.
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}