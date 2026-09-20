"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
    <main className="mx-auto flex min-h-screen max-w-[560px] flex-col justify-center px-6">
      <h2 className="text-sm text-stone-500">Writing a review for</h2>
      <h1 className="mb-10 mt-1 text-2xl font-semibold tracking-tight">
        {restaurantName ?? "…"}
      </h1>

      <div className="mb-2 flex gap-2" aria-label="Pick a rating from 1 to 5">
        {STARS.map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => setRating(star)}
            className="text-3xl leading-none transition-colors"
          >
            <span
              className={
                rating !== null && star <= rating
                  ? "text-amber-600"
                  : "text-stone-300"
              }
            >
              ★
            </span>
          </button>
        ))}
      </div>
      <p className="mb-8 text-sm text-stone-500">
        {rating === null ? "Tap a star to rate." : `You picked ${rating} star${rating > 1 ? "s" : ""}.`}
      </p>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="How was your meal?"
        rows={4}
        className="min-h-32 resize-none rounded-lg border border-stone-300 bg-white p-4 text-stone-900 outline-none focus:border-amber-600"
      />

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="mt-6 rounded-lg bg-stone-900 px-6 py-3 text-sm font-medium text-white transition-colors enabled:hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Submit review
      </button>
    </main>
  );
}