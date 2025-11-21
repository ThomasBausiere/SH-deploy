# Étape 1 : build Angular (avec SSR)
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --configuration production

# Étape 2 : servir le build avec Nginx
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist/front-sh/browser /usr/share/nginx/html
EXPOSE 80
