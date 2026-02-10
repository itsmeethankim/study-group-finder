FROM node:20-alpine AS builder
WORKDIR /app

# Dummy DB URL for build-time only (prevents Next build from crashing).
# Runtime DATABASE_URL comes from docker-compose on EC2.
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/studygroups"

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3000
CMD ["npm", "run", "start"]
