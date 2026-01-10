# # Sử dụng base image Node.js chính thức
# FROM node:20-alpine

# # Thiết lập thư mục làm việc
# WORKDIR /app

# # Copy các file cấu hình dependency
# COPY package*.json ./

# # Cài đặt dependency
# # Tùy chọn: Dùng npm install hoặc yarn install
# RUN npm install

# # Copy toàn bộ source code
# COPY . .

# # Mở cổng mặc định của Vite Dev Server
# EXPOSE 5173

# # Lệnh khởi động sẽ được override bởi docker-compose.yml
# # CMD ["npm", "run", "dev", "--host", "0.0.0.0", "--port", "5173"]
# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# File cấu hình Nginx nội bộ (Xem bước 3)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]