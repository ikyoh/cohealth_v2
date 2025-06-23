# syntax=docker/dockerfile:1

# Versions
FROM node:lts AS node_upstream

# Base stage for dev and build
FROM node_upstream AS base

WORKDIR /srv/app

RUN npm install -g corepack@latest && \
	corepack enable

# Désactiver la télémétrie Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# ============================================================
# Development image
# ============================================================
FROM base as dev

WORKDIR /srv/app

COPY package.json package-lock.json ./
COPY . .

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME localhost

CMD ["sh", "-c", "npm install --legacy-peer-deps && npm run dev"]

# ============================================================
# Build stage
# ============================================================
FROM base AS builder

WORKDIR /srv/app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

RUN npm run build

# ============================================================
# Production image, copy all the files and run next
# ============================================================
FROM node_upstream AS prod

WORKDIR /srv/app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --gid 1001 nodejs && \
	adduser --uid 1001 nextjs

COPY --from=builder --link /srv/app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next && \
	chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --link --chown=1001:1001 /srv/app/.next/standalone ./
COPY --from=builder --link --chown=1001:1001 /srv/app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]