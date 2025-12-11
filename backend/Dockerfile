FROM python:3.11-slim

# Thiết lập thư mục làm việc chính
# Thư mục này sẽ chứa toàn bộ code sau khi Volume Mount (./backend -> /app)
WORKDIR /app

# Copy tệp requirements.txt từ thư mục host (./backend/) vào /app trong container
COPY requirements.txt .

# Cài đặt các dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Thiết lập PYTHONPATH để Flask và các module (như hus_bakery_app) có thể được tìm thấy
# Chúng ta đặt PYTHONPATH là /app, vì main.py và hus_bakery_app đều nằm trong /app
ENV PYTHONPATH=/app

# Lệnh khởi động Flask Server.
# Flask sẽ tìm main.py dựa trên FLASK_APP=main.py trong .env và chạy trong /app.
CMD ["flask", "run", "--host=0.0.0.0"]