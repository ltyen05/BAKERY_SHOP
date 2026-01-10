# FROM node:20-alpine

# WORKDIR /app

# # Copy package.json trước để cache layer npm install
# COPY package*.json ./

# # Cài dependencies
# RUN npm install

# # Copy toàn bộ code
# COPY . .

# EXPOSE 5173

# # ⭐ Thêm --host để Vite listen trên tất cả network interfaces
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# File cấu hình Nginx nội bộ (Xem bước 3)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]