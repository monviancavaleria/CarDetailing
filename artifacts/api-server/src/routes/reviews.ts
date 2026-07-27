import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db } from "@workspace/db";
import { reviewsTable, insertReviewSchema } from "@workspace/db/schema";

const router: IRouter = Router();

// Límite sencillo de envíos por IP: máx. 3 reseñas por hora
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const submissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    submissions.set(ip, recent);
    return true;
  }
  recent.push(now);
  submissions.set(ip, recent);
  // Evitar crecimiento sin límite del mapa
  if (submissions.size > 5000) {
    for (const [key, times] of submissions) {
      if (times.every((t) => now - t >= WINDOW_MS)) submissions.delete(key);
    }
  }
  return false;
}

router.get("/reviews", async (_req, res) => {
  try {
    const reviews = await db
      .select()
      .from(reviewsTable)
      .orderBy(desc(reviewsTable.createdAt));
    res.json(reviews);
  } catch (err) {
    console.error("GET /reviews failed:", err);
    res.status(500).json({ error: "No se pudieron cargar las reseñas" });
  }
});

router.post("/reviews", async (req, res) => {
  const ip = req.ip ?? "unknown";
  if (isRateLimited(ip)) {
    res.status(429).json({
      error: "Has enviado varias reseñas seguidas. Inténtalo de nuevo más tarde.",
    });
    return;
  }
  const parsed = insertReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Datos de la reseña no válidos" });
    return;
  }
  try {
    const [review] = await db
      .insert(reviewsTable)
      .values(parsed.data)
      .returning();
    res.status(201).json(review);
  } catch (err) {
    console.error("POST /reviews failed:", err);
    res.status(500).json({ error: "No se pudo guardar la reseña" });
  }
});

export default router;
