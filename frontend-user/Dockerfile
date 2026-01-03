FROM node:20-alpine

WORKDIR /app

# Copy package.json trước để cache layer npm install
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ code
COPY . .

EXPOSE 5173

FROM node:20-alpine

WORKDIR /app

# Copy package.json trước để cache layer npm install
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ code
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]