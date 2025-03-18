import { z } from "zod";

// Analytics type for the frontend
export type Analytics = {
  clickCount: number;
  recentVisitors: string[];
};

// Validation schemas for form inputs
export const createUrlSchema = z.object({
  originalUrl: z.string().url("Please enter a valid URL"),
  alias: z.string().max(20, "Alias must be 20 characters or less").optional(),
  expiresAt: z.string().optional(),
});

export type CreateUrlInput = z.infer<typeof createUrlSchema>;
