import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  let body: { restaurantId?: unknown; rating?: unknown; comment?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be valid JSON." }, { status: 400 });
  }

  const { restaurantId, rating, comment } = body;

  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be a whole number from 1 to 5." },
      { status: 400 }
    );
  }

  const trimmedComment = typeof comment === "string" ? comment.trim() : "";
  if (trimmedComment === "") {
    return NextResponse.json({ error: "Comment cannot be empty." }, { status: 400 });
  }

  if (typeof restaurantId !== "number" || !Number.isInteger(restaurantId)) {
    return NextResponse.json({ error: "Restaurant ID must be a whole number." }, { status: 400 });
  }

  const restaurants = await sql`SELECT id FROM restaurants WHERE id = ${restaurantId}`;
  if (restaurants.length === 0) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 400 });
  }

  const inserted = await sql`
    INSERT INTO reviews (restaurant_id, rating, comment)
    VALUES (${restaurantId}, ${rating}, ${trimmedComment})
    RETURNING id
  `;

  return NextResponse.json(
    { success: true, reviewId: inserted[0].id },
    { status: 201 }
  );
}