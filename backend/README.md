# HUS Bakery - Backend Service Documentation

Dịch vụ Backend xử lý toàn bộ logic nghiệp vụ, quản lý cơ sở dữ liệu và cung cấp API cho các ứng dụng FrontEnd.

## 🛠 Công nghệ sử dụng
- **Framework**: Flask / FastAPI.
- **Cơ sở dữ liệu**: MySQL (được thiết kế theo mô hình ERD).
- **Containerization**: Docker & Docker Compose.

## 📂 Cấu trúc mã nguồn nội bộ
- `hus_bakery_app/`: Chứa toàn bộ logic ứng dụng (Models, Routers, Services).
- `docs/`: Tài liệu kỹ thuật chi tiết về DB và API.
- `scripts/`: Các lệnh thực thi hỗ trợ hệ thống (Backup/Restore).

## 🚀 Hướng dẫn khởi chạy nhanh
1. Đảm bảo file `.env` đã được cấu hình đúng thông số CSDL.
2. Sử dụng Docker để đóng gói và khởi chạy:
   ```bash
   docker compose up --build -d