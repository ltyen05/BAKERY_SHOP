# Sử dụng Python Slim cho nhẹ
FROM python:3.11-slim

# Thiết lập thư mục làm việc là /app
WORKDIR /app

# Copy file requirements trước để tận dụng cache của Docker
COPY requirements.txt .

# Cài đặt thư viện
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ code từ máy thật (thư mục backend) vào container
COPY . .

# Lệnh chạy server (dự phòng, thực tế docker-compose sẽ ghi đè lệnh này)
CMD ["python", "main.py"]