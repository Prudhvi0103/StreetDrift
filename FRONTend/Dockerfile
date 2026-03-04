# FRONTend/Dockerfile

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Assuming it's a React/Vite/Next app → change build command accordingly
RUN npm run build

# Production stage (serve with nginx or node)
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html   # for Vite/React default
# or /app/build for Create React App
# or /app/.next/static + /app/public for Next.js (different)

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
