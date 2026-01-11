# --- ETAPA 1: Dependencias ---
FROM node:22.21-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Instalamos solo dependencias (frozen-lockfile es más rápido y seguro)
RUN npm ci

# --- ETAPA 2: Construcción (Builder) ---
FROM node:22.21-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desactivar telemetría de Next.ts (opcional pero recomendado)
ENV NEXT_TELEMETRY_DISABLED 1

# Construir el proyecto
RUN npm run build

# --- ETAPA 3: Ejecución (Runner) ---
FROM node:22.21-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Crear usuario no-root para 
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar solo los archivos necesarios de la etapa de construcción
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]