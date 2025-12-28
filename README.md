# HUS Bakery - Backend System Documentation

Tài liệu này trình bày chi tiết về cấu trúc hệ thống, thiết kế cơ sở dữ liệu và quy trình vận hành cho dự án **HUS Bakery**. Hệ thống được xây dựng để cung cấp giải pháp quản lý tiệm bánh toàn diện, đảm bảo tính bảo mật và hiệu năng cao.

---

## 1. Kiến Trúc Mã Nguồn (Internal Structure)
Hệ thống sử dụng ngôn ngữ **Python (Flask)** với kiến trúc **Service-Layer** nhằm tách biệt minh bạch các tầng xử lý dữ liệu và logic nghiệp vụ

## 📁 Cấu Trúc Mã Nguồn Backend (Detailed Project Structure)

Sơ đồ tổ chức các tệp tin và thư mục trong dự án Backend:

```text
## 📁 Cấu Trúc Mã Nguồn Backend (Project Structure)

Hệ thống được tổ chức theo mô hình Layered Architecture, tách biệt minh bạch giữa giao diện API, logic nghiệp vụ và dữ liệu:

```text
backend/
├── hus_bakery_app/             # Thư mục mã nguồn chính (Application Logic)
│   ├── forms/                  # Tầng kiểm tra dữ liệu đầu vào (Validation)
│   │   ├── feedback.py
│   │   ├── login.py
│   │   └── signup.py
│   ├── models/                 # Định nghĩa thực thể CSDL & Quan hệ (Nhiệm vụ 1)
│   │   ├── __init__.py
│   │   ├── branch_product.py
│   │   ├── branches.py
│   │   ├── cart_item.py
│   │   ├── categories.py
│   │   ├── coupon.py
│   │   ├── coupon_custom.py
│   │   ├── customer.py
│   │   ├── employee.py
│   │   ├── feedback.py
│   │   ├── order.py
│   │   ├── order_item.py
│   │   ├── order_status.py
│   │   ├── product_review.py
│   │   ├── products.py
│   │   ├── shipper.py
│   │   └── shipper_review.py
│   ├── routers/                # Tầng điều hướng API (Endpoints - Nhiệm vụ 3)
│   │   ├── admin/              # API quản trị hệ thống
│   │   │   ├── coupon_management.py
│   │   │   ├── customer_management.py
│   │   │   ├── dashboard.py
│   │   │   ├── employee_management.py
│   │   │   ├── order_management.py
│   │   │   ├── product_management.py
│   │   │   └── shipper_management.py
│   │   ├── customer/           # API dành cho khách hàng
│   │   │   ├── account.py
│   │   │   ├── feedback.py
│   │   │   ├── order_process.py
│   │   │   └── product.py
│   │   └── auth.py             # Xác thực (Login/Register)
│   ├── services/               # Tầng xử lý nghiệp vụ trung tâm (Business Logic)
│   │   ├── admin/              # Logic chức năng Admin
│   │   ├── customer/           # Logic chức năng Khách hàng
│   │   └── auth_services.py    # Logic xác thực hệ thống
│   └── __init__.py
├── docs/                       # TÀI LIỆU HỆ THỐNG (Nhiệm vụ bắt buộc)
│   ├── DATABASE.md             # Tài liệu CSDL & Quy trình Backup/Restore
│   └── API_DOCUMENTATION.md    # Hướng dẫn API & Link Postman
├── scripts/                    # Scripts hỗ trợ vận hành (Nhiệm vụ 2)
│   ├── backup.sh               # Tự động hóa sao lưu dữ liệu
│   └── restore.sh              # Tự động hóa khôi phục dữ liệu
├── Dockerfile                  # Đóng gói hệ thống Backend (Nhiệm vụ 3)
├── docker-compose.yml          # Điều phối dịch vụ (Backend & Database)
├── main.py                     # Điểm chạy ứng dụng chính (Entry point)
├── requirements.txt            # Danh sách thư viện Python
├── .env                        # Biến môi trường bảo mật
└── .gitignore                  # Khai báo các tệp loại bỏ khỏi Git
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
    * **Public Link**: https://spaceflight-participant-74027985-8059245.postman.co/workspace/THACH-NGUYEN-BAO's-Workspace~305f06ff-7319-418d-8c4a-31782c4990aa/request/51061135-1b951c33-43f1-4d46-8482-be6cb5646023?action=share&creator=51061135&ctx=documentation&active-environment=51061135-1aeea58a-799d-464e-891c-5d6e7bb05268
* **Kiểm thử hệ thống**:
    * **Chức năng**: Đảm bảo truy xuất và xử lý dữ liệu chính xác từ CSDL thông qua lớp Service và API.
    * **Phân quyền & Bảo mật**: Thực hiện kiểm tra nghiêm ngặt quyền truy cập dựa trên vai trò (**Admin/Customer**). Các endpoint quản trị (`/admin/*`) chỉ dành riêng cho nhân viên có quyền hạn.
    * **Độ tin cậy**: Hệ thống xử lý các mã lỗi HTTP tiêu chuẩn (200, 400, 403, 404, 500) và thực hiện kiểm tra (**validate**) dữ liệu đầu vào chặt chẽ để ngăn ngừa lỗi logic.
