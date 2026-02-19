FROM node:20-alpine AS base

# Stage 1: Install dependencies
FROM base AS installer
RUN apk add libc6-compat
RUN npm install -g turbo
WORKDIR /app

COPY turbo.json turbo.json
COPY package.json package-lock.json ./
RUN npm install

# Stage 2: Development (with source code and deps)
FROM installer AS development
WORKDIR /app

CMD ["npm", "run", "dev"]

# Stage 3: Build the project
FROM installer AS builder-web

COPY . .
RUN npm run build

# Stage 4: Runner
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
