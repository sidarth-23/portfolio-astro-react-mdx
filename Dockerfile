# syntax=docker/dockerfile:1

# ============================================================
# Stage 1: Dependencies
# ============================================================
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# ============================================================
# Stage 2: Build
# ============================================================
FROM oven/bun:1 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# ============================================================
# Stage 3: Runtime
# ============================================================
FROM oven/bun:1-slim AS runtime
WORKDIR /app

# Runtime libs for sharp
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips42 \
    && rm -rf /var/lib/apt/lists/*

# Copy only production package.json and install ONLY production deps
COPY --from=builder /app/package.json ./package.json
RUN bun install --production --frozen-lockfile

# Copy the built app
COPY --from=builder /app/dist ./dist

# Copy source images for SSR image optimization (required by astro:assets getImage() in API routes)
COPY --from=builder /app/src/content ./src/content
COPY --from=builder /app/src/assets ./src/assets

# Astro standalone env
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

EXPOSE 4321

CMD ["bun", "./dist/server/entry.mjs"]
