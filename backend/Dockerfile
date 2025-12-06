# Sử dụng base image Python 3.10 slim để tối ưu kích thước
FROM python:3.10-slim

# Thiết lập biến môi trường
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Thiết lập thư mục làm việc mặc định trong container
WORKDIR /app

# Cài đặt dependency trước
# Chỉ cần COPY requirements.txt để tận dụng Docker cache (tăng tốc độ build)
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ code
COPY . /app/

# Mở cổng 5000 (cổng mà Flask server lắng nghe)
EXPOSE 5000

# Lệnh khởi động sẽ được override bởi docker-compose.yml
# CMD ["python", "main.py"]