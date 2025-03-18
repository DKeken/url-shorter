# Use Bun as the base image
FROM imbios/bun-node:20-alpine AS base

FROM base AS deps
WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app .

RUN bun run build --filter=@app/frontend

FROM base AS runner
WORKDIR /app
COPY --from=builder /app .

# Start only the frontend package
CMD ["bun", "run", "--filter=@app/frontend", "start"]