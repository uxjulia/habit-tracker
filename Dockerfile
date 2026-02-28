# ---- Dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY client/package.json ./client/
COPY server/package.json ./server/
RUN npm ci

# ---- Build client ----
FROM deps AS client-build
COPY client/ ./client/
COPY tsconfig.base.json ./
RUN npm run build --workspace=client

# ---- Build server ----
FROM deps AS server-build
COPY server/ ./server/
COPY tsconfig.base.json ./
RUN npm run build --workspace=server
# Generate Prisma client for production
RUN cd server && npx prisma generate

# ---- Production image ----
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Copy root node_modules (npm workspaces hoists deps here)
COPY --from=server-build /app/node_modules ./node_modules
COPY --from=server-build /app/package.json ./package.json

# Copy server build
COPY --from=server-build /app/server/dist ./server/dist
COPY --from=server-build /app/server/prisma ./server/prisma
COPY server/package.json ./server/

# Copy client build (served as static files by Express)
COPY --from=client-build /app/client/dist ./client/dist

EXPOSE 3000

# Run migrations then start
CMD ["sh", "-c", "cd server && node -e \"require('@prisma/client')\" 2>/dev/null; npx prisma migrate deploy && node dist/index.js"]
