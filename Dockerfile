# Stage 1: Dependencies
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Stage 2: Builder
FROM node:24-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code (includes .env from CI / local build context)
COPY . .

ENV NODE_ENV=production

# Build the static site (.env is loaded by docusaurus.config via dotenv)
RUN npm run build

# Stage 3: Runner
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# curl: healthcheck
RUN apk add --no-cache curl \
  && npm install -g serve \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 docusaurus

# Copy static build from builder
COPY --from=builder --chown=docusaurus:nodejs /app/build ./build

USER docusaurus

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=60s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["serve", "-s", "build", "-l", "tcp://0.0.0.0:3000"]
