FROM node:20-alpine

WORKDIR /app

# Copy package.json trước để cache layer npm install
COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/ 
RUN npm config set fetch-retry-maxtimeout 1200000
RUN npm install
# Copy toàn bộ mã nguồn vào container
COPY . .

EXPOSE 5173

# ⭐ Thêm --host để Vite listen trên tất cả network interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]