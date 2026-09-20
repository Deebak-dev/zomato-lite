import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(join(dir, "schema.sql"), "utf8");
const seed = readFileSync(join(dir, "seed.sql"), "utf8");

const envPath = join(dir, "..", ".env.local");
const envContents = readFileSync(envPath, "utf8");
const urlLine = envContents.split(/\r?\n/).find((line) => line.trim().startsWith("DATABASE_URL="));
if (!urlLine) {
  console.error("DATABASE_URL not found in .env.local");
  process.exit(1);
}
const url = urlLine.split("=").slice(1).join("=").replace(/^"|"$/g, "");

const sql = neon(url);

const statements = (file) =>
  file
    .split(/;\s*(?:\r?\n|$)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => s + ";");

await sql.query("DROP TABLE IF EXISTS reviews CASCADE");
await sql.query("DROP TABLE IF EXISTS restaurants CASCADE");

for (const stmt of [...statements(schema), ...statements(seed)]) {
  await sql.query(stmt);
}

console.log("Schema applied and seeded.");
console.log("Restaurants:");
console.table(await sql.query("SELECT id, name, cuisine, area FROM restaurants"));
console.log("Reviews:");
console.table(await sql.query("SELECT id, restaurant_id, rating, comment, created_at FROM reviews ORDER BY id"));