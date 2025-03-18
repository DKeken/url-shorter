import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().default('1d'),
  CORS_ORIGIN: z.string().url().default('http://localhost:3000'),
  BASE_URL: z.string().url().default('http://localhost:3333'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),

  // Throttler configuration
  THROTTLE_GLOBAL_TTL: z.string().transform(Number).default('60000'),
  THROTTLE_GLOBAL_LIMIT: z.string().transform(Number).default('20'),
  THROTTLE_HEALTH_TTL: z.string().transform(Number).default('60000'),
  THROTTLE_HEALTH_LIMIT: z.string().transform(Number).default('5'),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
