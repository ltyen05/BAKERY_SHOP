# FROM python:3.11-slim

# WORKDIR /app

# # Vì context trong compose là ./backend, lệnh này copy 
# # nội dung bên trong thư mục backend máy thật vào /app trong container
# COPY . .

# # Cài đặt thư viện (đảm bảo file requirements.txt nằm ngay trong thư mục backend)
# RUN pip install --no-cache-dir -r requirements.txt

# # Thiết lập môi trường để Flask tìm thấy file chạy
# ENV FLASK_APP=main.py
# ENV PYTHONPATH=/app

# # Chạy trực tiếp bằng python để dễ debug lỗi import
# CMD ["python", "main.py"]
FROM python:3.11-slim

WORKDIR /app

# Cài đặt công cụ build cần thiết (tùy chọn nhưng nên có)
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Cài đặt thư viện và cài đè gunicorn để chắc chắn nó tồn tại
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

COPY . .

# Sử dụng python -m gunicorn để tránh lỗi không tìm thấy đường dẫn thực thi
CMD ["python3", "-m", "gunicorn", "--bind", "0.0.0.0:5000", "main:app"]