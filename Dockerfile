# Stage 1: build static web bundle
FROM node:20-bullseye AS build
WORKDIR /app
ENV CI=true
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npx expo export --platform web --non-interactive --output-dir dist

# Stage 2: serve static files
FROM node:20-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
RUN npm install -g serve \
  && npm cache clean --force
COPY --from=build /app/dist ./dist
USER node
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:8080"]
