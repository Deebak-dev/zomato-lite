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

      <div className="mt-6 flex gap-2">
        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-peppercorn/70">
          {data.cuisine}
        </span>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-peppercorn/70">
          {data.area}
        </span>
      </div>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-peppercorn">
        {data.name}
      </h1>

      {hasReviews ? (
        <div className="mt-6 flex items-center gap-3">
          <span className="inline-flex items-center gap-1 rounded-md bg-rating-green px-2 py-1 text-sm font-semibold text-white">
            <span aria-hidden>★</span>
            {data.averageRating}
          </span>
          <span className="text-sm text-peppercorn/60">
            {data.totalReviews} review{data.totalReviews === 1 ? "" : "s"}
          </span>
        </div>
      ) : (
        <div className="mt-6 flex items-center gap-3">
          <span className="inline-flex items-center gap-1 rounded-md bg-rating-green px-2 py-1 text-sm font-semibold text-white">
            <span aria-hidden>★</span>—
          </span>
          <span className="text-sm text-peppercorn/60">0 reviews yet</span>
        </div>
      )}

      <div className="mt-8">
        <Link
          href={`/review/${params.id}`}
          className="inline-block rounded-full bg-cranberry px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-cranberry-dark"
        >
          Write a review
        </Link>
      </div>

      {data.latestReview && (
        <section className="mt-10 rounded-lg border border-cranberry/20 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium tracking-wide text-cranberry">
            LATEST REVIEW
          </p>
          <p className="mt-2 text-lg font-semibold text-peppercorn">
            {data.latestReview.comment}
          </p>
          <p className="mt-2 text-sm">
            <Stars rating={data.latestReview.rating} />
          </p>
        </section>
      )}

      {data.reviews.length > 0 && (
        <section className="mt-6">
          <ul className="space-y-4">
            {data.reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-lg bg-white p-5 shadow-sm"
              >
                <p className="text-peppercorn">{review.comment}</p>
                <p className="mt-1 text-sm">
                  <Stars rating={review.rating} />
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!hasReviews && (
        <p className="mt-10 text-sm text-peppercorn/60">
          No reviews yet.
          <Link
            href={`/review/${params.id}`}
            className="ml-1 font-medium text-cranberry hover:underline"
          >
            Write the first one.
          </Link>
        </p>
      )}
    </main>
  );
}