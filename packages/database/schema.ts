import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import type { z } from "zod";

/**
 * Schema for shortened URLs
 */
export const urlLinks = pgTable("url_links", {
  id: serial("id").primaryKey(),
  originalUrl: text("original_url").notNull(),
  shortCode: varchar("short_code", { length: 20 }).notNull().unique(),
  alias: varchar("alias", { length: 20 }).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  clickCount: integer("click_count").default(0).notNull(),
});

/**
 * Relations for URL links
 */
export const urlLinksRelations = relations(urlLinks, ({ many }) => ({
  visits: many(visitLogs),
}));

/**
 * Schema for visit analytics
 */
export const visitLogs = pgTable("visit_logs", {
  id: serial("id").primaryKey(),
  urlLinkId: integer("url_link_id")
    .references(() => urlLinks.id, { onDelete: "cascade" })
    .notNull(),
  visitorIp: varchar("visitor_ip", { length: 45 }).notNull(),
  visitedAt: timestamp("visited_at").defaultNow().notNull(),
});

/**
 * Relations for visit logs
 */
export const visitLogsRelations = relations(visitLogs, ({ one }) => ({
  urlLink: one(urlLinks, {
    fields: [visitLogs.urlLinkId],
    references: [urlLinks.id],
  }),
}));

// Zod schemas for URL links
export const insertUrlLinkSchema = createInsertSchema(urlLinks);
export const selectUrlLinkSchema = createSelectSchema(urlLinks);

// Zod schemas for visit logs
export const insertVisitLogSchema = createInsertSchema(visitLogs);
export const selectVisitLogSchema = createSelectSchema(visitLogs);

export type UrlLink = z.infer<typeof selectUrlLinkSchema>;
export type VisitLog = z.infer<typeof selectVisitLogSchema>;
