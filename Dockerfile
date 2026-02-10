# Etapa 1: Construcción
FROM node:22-alpine AS build

# Directorio de trabajo
WORKDIR /app

# Actualizar npm a la última versión
RUN npm install -g npm@latest

# Instalar pnpm globalmente
RUN npm install -g pnpm@latest

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .
RUN pnpm run build

# Etapa 2: Servidor de producción
FROM nginx:stable-alpine-slim AS production

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar archivos desde la etapa de build
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./cert/cert.pem /etc/nginx/certs/cert.pem
COPY ./cert/key.pem /etc/nginx/certs/key.pem

# Exponer puertos
EXPOSE 443

# Healthcheck ignorando certificados autofirmados
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \ 
    CMD curl -f -k https://localhost:443 || exit 1

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]