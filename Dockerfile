# 1. Stage: Build app
FROM node:20.14.0-alpine AS builder

# Tạo thư mục app
WORKDIR /app

# Copy package.json và lock file
COPY package*.json ./

# Cài dependencies
RUN npm install --legacy-peer-deps

# Copy toàn bộ source code
COPY . .

# Build ứng dụng Next.js
RUN npm run build

# 2. Stage: Run app
FROM node:20.14.0-alpine

# Tạo thư mục app
WORKDIR /app

# Copy từ builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Cấu hình biến môi trường
ENV NODE_ENV=production

# Mở port
EXPOSE 3000

# Chạy app
CMD ["npm", "start"]
