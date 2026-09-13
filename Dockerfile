# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build arguments for frontend build
ARG GEMINI_API_KEY
ARG STRIPE_PUBLISHABLE_KEY
ARG PRINTFUL_STORE_ID=17464534
ENV GEMINI_API_KEY=$GEMINI_API_KEY
ENV STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY
ENV PRINTFUL_STORE_ID=$PRINTFUL_STORE_ID

RUN npm run build

# Production runtime stage
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
