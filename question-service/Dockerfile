# -------- Build stage --------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json tsconfig.test.json ./
COPY src ./src

RUN npm run build

# -------- Runtime stage --------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY drizzle ./drizzle

EXPOSE 4002

# Graceful shutdown is handled in src/server.ts (SIGTERM/SIGINT)
CMD ["node", "dist/server.js"]
