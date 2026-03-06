# Multi-stage build: build app with Node, serve with nginx
FROM node:lts-alpine AS build

WORKDIR /app

# Build-time args (Vite embeds VITE_ prefixed vars at build time)
ARG VITE_GA_ID
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_GOOGLE_API_KEY

ENV VITE_GA_ID=$VITE_GA_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_API_KEY=$VITE_GOOGLE_API_KEY

# Install dependencies (use package-lock if present)
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

## Production image
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
