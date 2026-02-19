FROM node:25.6.1-alpine AS base
RUN apk add --no-cache libc6-compat
RUN npm install -g turbo

# Stage 2: Prune the project
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune --scope=web --docker

# Stage 3: Install dependencies
FROM base AS installer
WORKDIR /app

# First install dependencies from pruned json
COPY --from=pruner /app/out/json/ ./
RUN npm ci

# Stage 4: Build the project
FROM base AS builder
WORKDIR /app
COPY --from=installer /app/ ./
COPY --from=pruner /app/out/full/ ./
COPY turbo.json turbo.json
RUN npm run build --filter=web

# Stage 5: Runner
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/apps/web/next.config.js .
COPY --from=builder /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
