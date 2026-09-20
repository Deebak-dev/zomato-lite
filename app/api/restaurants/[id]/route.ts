import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const restaurantId = Number(id);

  if (!Number.isInteger(restaurantId)) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const restaurants = await sql`
    SELECT id, name, cuisine, area FROM restaurants WHERE id = ${restaurantId}
  `;

  if (restaurants.length === 0) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const restaurant = restaurants[0];

  const [summary] = await sql`
    SELECT
      ROUND(AVG(rating)::numeric, 1) AS average_rating,
      COUNT(*)::int AS total_reviews
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
  `;

  const latest = await sql`
    SELECT id, rating, comment, created_at::text AS created_at
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const older = await sql`
    SELECT id, rating, comment, created_at::text AS created_at
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
    ORDER BY created_at DESC
    OFFSET 1
  `;

  const latestReview = latest[0]
    ? {
        id: latest[0].id,
        rating: latest[0].rating,
        comment: latest[0].comment,
        createdAt: latest[0].created_at,
      }
    : null;

  const reviews = older.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.created_at,
  }));

  return NextResponse.json({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    area: restaurant.area,
    averageRating: summary.average_rating === null ? null : Number(summary.average_rating),
    totalReviews: summary.total_reviews,
    latestReview,
    reviews,
  });
}