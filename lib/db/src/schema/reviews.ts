import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  author: text("author").notNull(),
  car: text("car"),
  rating: integer("rating").notNull(),
  quote: text("quote").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviewsTable)
  .omit({ id: true, createdAt: true })
  .extend({
    author: z.string().trim().min(2).max(80),
    car: z
      .string()
      .trim()
      .max(60)
      .optional()
      .transform((v) => (v ? v : null))
      .nullable(),
    rating: z.number().int().min(1).max(5),
    quote: z.string().trim().min(10).max(600),
  });

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviewsTable.$inferSelect;
