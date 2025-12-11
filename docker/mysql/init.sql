-- Chỉ chứa các lệnh INSERT data (Seed Data)
-- Cấu trúc bảng (CREATE TABLE, ALTER TABLE) sẽ do Flask (db.create_all) quản lý

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Đang đổ dữ liệu cho bảng `branches`
-- (Đã thêm cột lat và lng)
--
INSERT INTO `branches` (`branch_id`, `name`, `address`, `phone`, `email`, `manager_id`, `lat`, `lng`) VALUES
(1, 'HUS Bakery - Cầu Giấy', '33 Cầu Giấy, Hà Nội', '0981234567', 'caugiau@husbakery.com', 1, 21.036815, 105.782800),
(2, 'HUS Bakery - Hai Bà Trưng', '18 Hai Bà Trưng, Hà Nội', '0982345678', 'hbt@husbakery.com', 2, 21.018901, 105.857601);

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`category_id`, `name`) VALUES
(1, 'Bánh Kem'),
(2, 'Bánh Mì'),
(3, 'Bánh Ngọt'),
(4, 'Bánh Quy');

--
-- Đang đổ dữ liệu cho bảng `coupons`
--

INSERT INTO `coupons` (`coupon_id`, `description`, `discount_percent`, `discount_value`, `discount_type`, `min_purchase`, `max_discount`, `begin_date`, `end_date`, `status`, `used_count`, `created_at`, `updated_at`) VALUES
(1, 'Giảm 15% cho đơn hàng đầu tiên', 15, NULL, 'percent', 0.00, 50000.00, '2025-01-01', '2025-12-31', 'active', 0, '2025-01-01 00:00:00', NULL),
(2, 'Giảm ngay 20.000đ', NULL, 20000.00, 'fixed', 150000.00, 20000.00, '2025-05-01', '2025-08-31', 'active', 0, '2025-05-01 00:00:00', NULL);

--
-- Đang đổ dữ liệu cho bảng `customers`
--

INSERT INTO `customers` (`customer_id`, `name`, `email`, `phone`, `password`, `avatar`, `created_at`) VALUES
(1, 'Nguyễn Văn A', 'customer_a@example.com', '0912345678', 'sha256$zYm1fBqX$e987747e7d95d1d6a9173f62803b087095039f60f6534237f394c8651c6c0b39', 'default.jpg', '2025-12-01 00:00:00'),
(2, 'Trần Thị B', 'customer_b@example.com', '0987654321', 'sha256$zYm1fBqX$e987747e7d95d1d6a9173f62803b087095039f60f6534237f394c8651c6c0b39', 'default.jpg', '2025-12-02 00:00:00');

--
-- Đang đổ dữ liệu cho bảng `employees`
--

INSERT INTO `employees` (`employee_id`, `employee_name`, `role_name`, `email`, `password`, `salary`, `status`, `branch_id`) VALUES
(1, 'Lê Văn Manager', 'manager', 'manager1@husbakery.com', 'sha256$zYm1fBqX$e987747e7d95d1d6a9173f62803b087095039f60f6534237f394c8651c6c0b39', 5000000.00, 'active', 1),
(2, 'Phạm Thị Staff', 'staff', 'staff1@husbakery.com', 'sha256$zYm1fBqX$e987747e7d95d1d6a9173f62803b087095039f60f6534237f394c8651c6c0b39', 4000000.00, 'active', 2);

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `image_url`, `unit_price`, `category_id`) VALUES
(1, 'Bánh Kem Socola', 'Bánh kem tươi vị socola béo ngậy', 'images/cake_socola.jpg', 250000.00, 1),
(2, 'Bánh Mì Sandwich', 'Bánh mì tươi nguyên cám', 'images/bread_sandwich.jpg', 35000.00, 2),
(3, 'Tiramisu', 'Bánh ngọt Ý cổ điển', 'images/tiramisu.jpg', 120000.00, 3),
(4, 'Cookie Chip', 'Bánh quy bơ sô cô la chip', 'images/cookie_chip.jpg', 50000.00, 4);

--
-- Đang đổ dữ liệu cho bảng `shippers`
--

INSERT INTO `shippers` (`shipper_id`, `name`, `phone`, `email`, `status`, `salary`, `branch_id`, `password`) VALUES
(1, 'Đỗ Văn Giao', '0919191919', 'shipper1@husbakery.com', 'active', 6000000.00, 1, 'sha256$zYm1fBqX$e987747e7d95d1d6a9173f62803b087095039f60f6534237f394c8651c6c0b39'),
(2, 'Hoàng Thị Phát', '0928282828', 'shipper2@husbakery.com', 'active', 6000000.00, 2, 'sha256$zYm1fBqX$e987747e7d95d1d6a9173f62803b087095039f60f6534237f394c8651c6c0b39');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;