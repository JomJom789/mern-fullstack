# syntax=docker/dockerfile:1.7
# Build context: repository root  →  docker build -f frontend/Dockerfile .
ARG NODE_VERSION=26.13.1

# ---- build (Node LTS alpine) --------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app
ENV npm_config_update_notifier=false npm_config_fund=false npm_config_audit=false
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY backend/package.json backend/
COPY frontend/package.json frontend/
RUN --mount=type=cache,target=/root/.npm \
    npm ci -w @jomel/shared -w @jomel/frontend --include-workspace-root=false

COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY frontend frontend

# Public build-time values (all end up in the browser bundle — never pass secrets here).
ARG VITE_API_URL
ARG VITE_SITE_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_ADMIN_PATH
ARG VITE_TURNSTILE_SITE_KEY=""
ENV VITE_API_URL=$VITE_API_URL VITE_SITE_URL=$VITE_SITE_URL VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY VITE_ADMIN_PATH=$VITE_ADMIN_PATH \
    VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY
RUN npm run build -w @jomel/shared && npm run build -w @jomel/frontend

# ---- serve (unprivileged nginx, runs as a non-root user on :8080) -------------
FROM nginxinc/nginx-unprivileged:1.29-alpine AS runtime
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1
