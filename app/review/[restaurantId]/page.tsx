"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const STARS = [1, 2, 3, 4, 5];

export default function ReviewPage() {
  const params = useParams<{ restaurantId: string }>();
  const router = useRouter();
  const restaurantId = Number(params.restaurantId);

  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/restaurants/${restaurantId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setRestaurantName(data.name);
      });
  }, [restaurantId]);

  const canSubmit = rating !== null && comment.trim() !== "" && !submitting;

  async function handleSubmit() {
    if (rating === null) return;
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId, rating, comment: comment.trim() }),
    });

    if (res.ok) {
      router.push(`/restaurant/${restaurantId}`);
      return;
    }

    const body = await res.json().catch(() => null);
    setError(body?.error ?? "Something went wrong.");
    setSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-tyrolean">
      <div className="mx-auto max-w-[520px] px-6 py-10">
        <Link
          href={`/restaurant/${restaurantId}`}
          className="text-sm font-medium text-cranberry hover:underline"
        >
          ← Back to restaurant
        </Link>

        <section className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold tracking-wider text-peppercorn/50">
            WRITING A REVIEW FOR
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-peppercorn">
            {restaurantName ?? "…"}
          </h1>

          <div className="mt-6 flex gap-2" aria-label="Pick a rating from 1 to 5">
            {STARS.map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                onClick={() => setRating(star)}
                className="text-4xl leading-none transition-transform hover:scale-110"
              >
                <span
                  className={
                    rating !== null && star <= rating
                      ? "text-star-amber"
                      : "text-peppercorn/15 hover:text-star-amber/60"
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-peppercorn/60">
            {rating === null
              ? "Tap a star to rate your experience."
              : `You picked ${rating} star${rating > 1 ? "s" : ""}.`}
          </p>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was your meal?"
            rows={4}
            className="mt-6 min-h-32 w-full resize-none rounded-xl border border-peppercorn/15 bg-tyrolean/60 p-4 text-peppercorn outline-none transition-colors focus:border-cranberry focus:bg-white"
          />

          {error && <p className="mt-4 text-sm text-cranberry">{error}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="mt-6 w-full rounded-full bg-cranberry px-6 py-3 text-sm font-medium text-white shadow-md shadow-cranberry/30 transition-colors enabled:hover:bg-cranberry-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit review
          </button>
        </section>

        <p className="mt-6 text-center text-xs text-peppercorn/40">
          Your review is checked by the server before it is saved.
        </p>
      </div>
    </main>
  );
}