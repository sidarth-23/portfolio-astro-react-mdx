# syntax=docker/dockerfile:1

# ============================================================
# Stage 1: Dependencies
# ============================================================
FROM oven/bun:1 AS deps
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# ============================================================
# Stage 2: Build
# ============================================================
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Astro app
ENV NODE_ENV=production
RUN bun run build

# ============================================================
# Stage 3: Runtime
# ============================================================
FROM oven/bun:1-slim AS runtime
WORKDIR /app

# Install runtime libraries needed by sharp (libvips)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips42 \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Copy built application
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/package.json ./package.json

# Switch to non-root user
USER appuser

# Expose the port Astro standalone runs on
EXPOSE 4321

# Bind to all interfaces so Docker/Dokploy can reach the container
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

# Start the Astro standalone server
CMD ["bun", "./dist/server/entry.mjs"]
