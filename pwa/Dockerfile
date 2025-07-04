# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS node_upstream

# Install dependencies only when needed
FROM node_upstream AS base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /srv/app

# Install dependencies based on the preferred package manager
COPY package.json  ./
RUN npm install;

# Development image
FROM base AS dev

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME localhost

CMD ["sh", "-c", "npm install; npm run dev"]


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /srv/app
COPY --from=base /srv/app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN \
	if [ -f yarn.lock ]; then yarn run build; \
	elif [ -f package-lock.json ]; then npm run build; \
	elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
	else echo "Lockfile not found." && exit 1; \
	fi

# Production image, copy all the files and run next
FROM node_upstream AS prod
WORKDIR /srv/app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /srv/app/public ./public


RUN mkdir .next; \
	chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /srv/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /srv/app/.next/static ./.next/static


USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]