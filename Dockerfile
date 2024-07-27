FROM node:18-alpine AS build

WORKDIR /app

COPY . .

RUN pnpm install
RUN pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# optional nginx.conf
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
