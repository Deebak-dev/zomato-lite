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
    <span className="text-amber-600" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-stone-300">{"★".repeat(5 - rating)}</span>
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
        <Link href="/" className="mt-4 text-sm text-amber-700 underline">
          Back home
        </Link>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto flex min-h-screen max-w-[560px] items-center justify-center px-6">
        <p className="text-stone-500">Loading…</p>
      </main>
    );
  }

  const hasReviews = data.latestReview !== null;

  return (
    <main className="mx-auto max-w-[560px] px-6 py-16">
      <h2 className="text-sm text-stone-500">
        {data.cuisine} · {data.area}
      </h2>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{data.name}</h1>

      {hasReviews ? (
        <div className="mt-10">
          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-semibold tracking-tighter">
              {data.averageRating}
            </span>
            <span className="text-sm text-stone-500">
              {data.totalReviews} review{data.totalReviews === 1 ? "" : "s"}
            </span>
          </div>
          <p className="mt-2 text-sm text-stone-500">Average rating</p>
        </div>
      ) : (
        <div className="mt-10">
          <p className="text-6xl font-semibold tracking-tighter">—</p>
          <p className="mt-2 text-sm text-stone-500">
            0 reviews yet. Be the first.
          </p>
        </div>
      )}

      <div className="mt-12">
        <Link
          href={`/review/${params.id}`}
          className="inline-block rounded-lg bg-stone-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-700"
        >
          Write a review
        </Link>
      </div>

      {data.latestReview && (
        <section className="mt-12 rounded-lg border border-amber-300 bg-amber-50 p-5">
          <p className="text-xs font-medium tracking-wide text-amber-700">
            LATEST REVIEW
          </p>
          <p className="text-lg font-semibold text-stone-900">
            {data.latestReview.comment}
          </p>
          <p className="mt-2 text-sm text-stone-500">
            <Stars rating={data.latestReview.rating} />
          </p>
        </section>
      )}

      {data.reviews.length > 0 && (
        <section className="mt-8">
          <ul className="divide-y divide-stone-200">
            {data.reviews.map((review) => (
              <li key={review.id} className="py-4">
                <p className="text-stone-900">{review.comment}</p>
                <p className="mt-1 text-sm text-stone-500">
                  <Stars rating={review.rating} />
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!hasReviews && (
        <p className="mt-12 text-sm text-stone-500">
          No reviews yet.
          <Link
            href={`/review/${params.id}`}
            className="ml-1 text-amber-700 underline"
          >
            Write the first one.
          </Link>
        </p>
      )}
    </main>
  );
}