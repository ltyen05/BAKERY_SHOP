# HUS Bakery - Backend System Documentation

Tài liệu này trình bày chi tiết về cấu trúc hệ thống, thiết kế cơ sở dữ liệu và quy trình vận hành cho dự án **HUS Bakery**. Hệ thống được xây dựng để cung cấp giải pháp quản lý tiệm bánh toàn diện, đảm bảo tính bảo mật và hiệu năng cao.

---

## 1. Kiến Trúc Mã Nguồn (Internal Structure)
Hệ thống sử dụng ngôn ngữ **Python (Flask)** với kiến trúc **Service-Layer** nhằm tách biệt minh bạch các tầng xử lý dữ liệu và logic nghiệp vụ

## 📁 Cấu Trúc Mã Nguồn (Project Structure)

Dưới đây là sơ đồ tổ chức thư mục của dịch vụ Backend:

```text
.
├── Dockerfile                  # Cấu hình đóng gói Image Backend
├── README.md                   # Tài liệu hướng dẫn hệ thống
├── docker-compose.yml          # Điều phối dịch vụ Backend và Database
├── main.py                     # Điểm chạy ứng dụng (Entry point)
├── requirements.txt            # Danh sách thư viện Python cần thiết
├── hus_bakery_app/             # Thư mục mã nguồn chính (Application Logic)
│   ├── forms/                  # Xử lý Validation dữ liệu đầu vào
│   │   ├── feedback.py
│   │   ├── login.py
│   │   └── signup.py
│   ├── models/                 # Định nghĩa thực thể CSDL (SQLAlchemy Models)
│   │   ├── customer.py
│   │   ├── products.py
│   │   ├── order.py
│   │   └── ... (các thực thể khác theo ERD)
│   ├── routers/                # Tầng điều hướng API (API Endpoints)
│   │   ├── admin/              # API dành cho quản trị viên
│   │   ├── customer/           # API dành cho khách hàng
│   │   └── auth.py             # API xác thực người dùng
│   └── services/               # Tầng xử lý nghiệp vụ (Business Logic)
│       ├── admin/              # Logic xử lý các chức năng quản trị
│       ├── customer/           # Logic xử lý các chức năng khách hàng
│       └── auth_services.py    # Logic xử lý xác thực
└── hus_bakery_env/             # Môi trường ảo Python (Local Virtual Environment)
```

* **`models/`**: Định nghĩa cấu trúc các bảng MySQL, mối quan hệ và các ràng buộc dữ liệu dựa trên mô hình ERD cung cấp.
* **`services/`**: Lớp xử lý logic hệ thống tập trung, đảm bảo API hoạt động đúng với thiết kế và quy tắc nghiệp vụ.
* **`routers/`**: Quản lý các điểm cuối (endpoints) API, thực hiện kết nối giữa FrontEnd với Logic và CSDL.
* **`forms/`**: Thực hiện kiểm soát và kiểm thử dữ liệu đầu vào (Validation) trước khi đưa vào hệ thống.

---

## 2. Hệ Thống Cơ Sở Dữ Liệu (MySQL)
Cơ sở dữ liệu được xây dựng chặt chẽ để đảm bảo hiệu năng và tính toàn vẹn:

* **Cấu trúc bảng & Mối quan hệ**:
    * **Nhân sự & Khách hàng**: `customer`, `employee`, `shipper`.
    * **Sản phẩm & Kho**: `products`, `categories`, `branches`, `branch_product` (quan hệ n-n).
    * **Giao dịch**: `order`, `order_item`, `order_status`.
    * **Hệ thống Feedback**: `feedback`, `product_review`, `shipper_review`.
* **Quy tắc dữ liệu**: Sử dụng khóa ngoại (Foreign Keys) để duy trì tính nhất quán. Các trường định danh quan trọng được thiết lập `Unique` và `Not Null`.
* **Tối ưu hóa**: Thực hiện đánh **Index** cho các cột thường xuyên truy vấn như `customer_id`, `product_name` và `status` để đảm bảo tốc độ phản hồi API.

---

## 3. Quy Trình Backup và Khôi Phục (System Management)
Đây là quy trình bắt buộc phục vụ công tác quản trị và bảo trì hệ thống thông qua Docker:

### 3.1. Quy trình Backup (Sao lưu)
Thực hiện trích xuất dữ liệu từ container MySQL ra file SQL định kỳ:
```bash
docker exec hus_bakery_db mysqldump -u root -p[password] bakery_db > backup_hus_bakery_$(date +%F).sql
```
### 3.2. Quy trình Khôi phục (Restore)
Nạp lại dữ liệu từ file backup vào hệ thống khi xảy ra sự cố hoặc chuyển đổi môi trường:

```bash
docker exec -i hus_bakery_db mysql -u root -p[password] bakery_db < backup_file.sql
```

---

## 4. Đóng Gói và Triển Khai (Docker)
Toàn bộ hệ thống được đóng gói đồng bộ, đảm bảo môi trường hoạt động nhất quán trên mọi nền tảng:

* **Dockerfile**: Thiết lập môi trường chạy cho Backend (Python 3.11), cài đặt các thư viện cần thiết từ `requirements.txt`.
* **Docker Compose**: Điều phối các dịch vụ FrontEnd, BackEnd và CSDL MySQL hoạt động cùng lúc trong một mạng ảo chung.
* **Lệnh khởi chạy nhanh**:
```bash
docker compose up --build -d
```

---

## 5. Tài Liệu API & Kiểm Thử (Testing)
Hệ thống API được thiết kế theo chuẩn **RESTful**, đảm bảo kết nối chính xác và ổn định giữa Backend và các ứng dụng FrontEnd:

* **Tài liệu API (Postman)**: Danh sách endpoints và hướng dẫn gọi API chi tiết đã được công khai tại:
    * **Public Link**: [Dán link Public của bạn tại đây]
* **Kiểm thử hệ thống**:
    * **Chức năng**: Đảm bảo truy xuất và xử lý dữ liệu chính xác từ CSDL thông qua lớp Service và API.
    * **Phân quyền & Bảo mật**: Thực hiện kiểm tra nghiêm ngặt quyền truy cập dựa trên vai trò (**Admin/Customer**). Các endpoint quản trị (`/admin/*`) chỉ dành riêng cho nhân viên có quyền hạn.
    * **Độ tin cậy**: Hệ thống xử lý các mã lỗi HTTP tiêu chuẩn (200, 400, 403, 404, 500) và thực hiện kiểm tra (**validate**) dữ liệu đầu vào chặt chẽ để ngăn ngừa lỗi logic.
