FROM node:20-alpine AS base

# Stage 1: Prune
FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune web --docker

# Stage 2: Install dependencies
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN npm install

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

# Stage 3: Development (with source code and deps)
FROM installer AS development
WORKDIR /app
RUN npm install -g turbo

CMD ["npm", "run", "dev"]

# Stage 4: Build the project
FROM installer AS builder-web
# Declare build arguments
ARG API_URL
ARG GOOGLE_CLIENT_ID

# Set environment variables for the build
ENV NEXT_PUBLIC_API_URL=${API_URL}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}

RUN turbo build --filter=web

# Stage 3: Runner
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder-web /app/apps/web/next.config.js .
COPY --from=builder-web /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder-web --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder-web --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder-web --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/web/server.js"]
