-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost
-- Thời gian đã tạo: Th12 02, 2025 lúc 03:45 AM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `hus_bakery`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `branches`
--

CREATE TABLE `branches` (
  `branch_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `branches`
--

INSERT INTO `branches` (`branch_id`, `name`, `address`, `phone`, `email`, `manager_id`) VALUES
(1, 'HUS Bakery - Hoàn Kiếm', '15 Hàng Bạc, Hoàn Kiếm, Hà Nội', '0241234567', 'hoankiem@husbakery.vn', 1),
(2, 'HUS Bakery - Cầu Giấy', '89 Trần Duy Hưng, Cầu Giấy, Hà Nội', '0242345678', 'caugiay@husbakery.vn', 9),
(3, 'HUS Bakery - Đống Đa', '120 Tây Sơn, Đống Đa, Hà Nội', '0243456789', 'dongda@husbakery.vn', 17),
(4, 'HUS Bakery - Hà Đông', '65 Quang Trung, Hà Đông, Hà Nội', '0244567890', 'hadong@husbakery.vn', 25),
(5, 'HUS Bakery - Long Biên', '20 Nguyễn Văn Cừ, Long Biên, Hà Nội', '0245678901', 'longbien@husbakery.vn', 33);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `branch_products`
--

CREATE TABLE `branch_products` (
  `branch_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `branch_products`
--

INSERT INTO `branch_products` (`branch_id`, `product_id`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(1, 2, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(1, 3, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(1, 4, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(1, 5, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(1, 6, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(1, 10, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(1, 11, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(1, 12, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(1, 14, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(2, 1, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(2, 2, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(2, 3, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(2, 4, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(2, 5, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(2, 6, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(2, 10, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(2, 11, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(2, 12, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(2, 14, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(3, 1, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(3, 2, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(3, 3, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(3, 4, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(3, 5, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(3, 6, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(3, 10, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(3, 11, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(3, 12, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(3, 14, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(4, 1, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(4, 2, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(4, 3, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(4, 4, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(4, 5, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(4, 6, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(4, 10, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(4, 11, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(4, 12, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(4, 14, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(5, 1, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(5, 2, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(5, 3, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(5, 4, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(5, 5, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(5, 6, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(5, 10, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(5, 11, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(5, 12, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(5, 14, '2025-11-06 14:02:06', '2025-11-06 14:02:06');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart_items`
--

CREATE TABLE `cart_items` (
  `customer_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cart_items`
--

INSERT INTO `cart_items` (`customer_id`, `product_id`, `quantity`, `added_at`, `updated_at`) VALUES
(1, 1, 1, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(2, 2, 1, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(3, 3, 2, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(4, 4, 1, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(5, 5, 3, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(6, 6, 1, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(7, 7, 2, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(8, 8, 1, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(9, 9, 2, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(10, 10, 1, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(11, 11, 1, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(12, 12, 2, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(13, 13, 1, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(14, 14, 1, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(15, 15, 1, '2025-11-06 14:02:06', '2025-11-06 14:02:06');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`category_id`, `name`) VALUES
(1, 'Bánh kem'),
(2, 'Bánh mì'),
(3, 'Bánh ngọt'),
(4, 'Bánh su kem'),
(5, 'Bánh cupcake'),
(6, 'Bánh quy'),
(7, 'Bánh mousse'),
(8, 'Bánh tiramisu');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `coupons`
--

CREATE TABLE `coupons` (
  `coupon_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_percent` int(11) DEFAULT NULL,
  `discount_value` decimal(10,2) DEFAULT NULL,
  `discount_type` varchar(20) DEFAULT NULL,
  `min_purchase` decimal(10,2) DEFAULT NULL,
  `max_discount` decimal(10,2) DEFAULT NULL,
  `begin_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `used_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `coupons`
--

INSERT INTO `coupons` (`coupon_id`, `description`, `discount_percent`, `discount_value`, `discount_type`, `min_purchase`, `max_discount`, `begin_date`, `end_date`, `status`, `used_count`, `created_at`, `updated_at`) VALUES
(1, 'Giảm 10% cho đơn từ 200k', 10, NULL, 'percent', 200000.00, 50000.00, '2025-01-01', '2025-12-31', 'active', 0, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(2, 'Giảm 50k cho đơn từ 300k', NULL, 50000.00, 'value', 300000.00, NULL, '2025-02-01', '2025-12-31', 'active', 0, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(3, 'Giảm 15% cho bánh kem', 15, NULL, 'percent', 150000.00, 70000.00, '2025-01-15', '2025-12-31', 'active', 0, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(4, 'Giảm 20% cho đơn trên 500k', 20, NULL, 'percent', 500000.00, 100000.00, '2025-03-01', '2025-12-31', 'active', 0, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(5, 'Giảm 30k cho khách hàng mới', NULL, 30000.00, 'value', 100000.00, NULL, '2025-01-01', '2025-12-31', 'active', 0, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(6, 'Voucher 100k cho sinh nhật', NULL, 100000.00, 'value', 200000.00, NULL, '2025-05-01', '2025-12-31', 'active', 0, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(7, 'Giảm 25% cho bánh mì', 25, NULL, 'percent', 50000.00, 30000.00, '2025-02-01', '2025-12-31', 'active', 0, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(8, 'Giảm 10% khi thanh toán online', 10, NULL, 'percent', 100000.00, 40000.00, '2025-01-01', '2025-12-31', 'active', 0, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(9, 'Giảm 20k cho đơn đầu tiên', NULL, 20000.00, 'value', 100000.00, NULL, '2025-01-01', '2025-12-31', 'active', 0, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(10, 'Giảm 50% cho bánh quy', 50, NULL, 'percent', 20000.00, 20000.00, '2025-01-01', '2025-12-31', 'active', 0, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(11, 'Giảm 100k đơn trên 1tr', NULL, 100000.00, 'value', 1000000.00, NULL, '2025-01-01', '2025-12-31', 'active', 0, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(12, 'Giảm 15% cho khách VIP', 15, NULL, 'percent', 300000.00, 80000.00, '2025-01-01', '2025-12-31', 'active', 0, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(13, 'Giảm 10% toàn menu tháng 11', 10, NULL, 'percent', 0.00, 100000.00, '2025-11-01', '2025-11-30', 'active', 0, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(14, 'Giảm 20% Black Friday', 20, NULL, 'percent', 200000.00, 100000.00, '2025-11-20', '2025-11-30', 'active', 0, '2025-11-06 14:02:06', '2025-11-06 14:02:06'),
(15, 'Giảm 5% mỗi thứ 2', 5, NULL, 'percent', 100000.00, 30000.00, '2025-01-01', '2025-12-31', 'active', 0, '2025-11-06 14:02:06', '2025-11-06 14:02:06');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `coupons_customer`
--

CREATE TABLE `coupons_customer` (
  `coupon_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `used_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `coupons_customer`
--

INSERT INTO `coupons_customer` (`coupon_id`, `customer_id`, `status`, `used_at`) VALUES
(1, 3, 'unused', NULL),
(1, 5, 'unused', NULL),
(1, 10, 'unused', NULL),
(1, 12, 'unused', NULL),
(1, 14, 'unused', NULL),
(2, 3, 'unused', NULL),
(2, 5, 'unused', NULL),
(2, 10, 'unused', NULL),
(2, 12, 'unused', NULL),
(2, 14, 'unused', NULL),
(3, 3, 'unused', NULL),
(3, 5, 'unused', NULL),
(3, 10, 'unused', NULL),
(3, 12, 'unused', NULL),
(3, 14, 'unused', NULL),
(4, 3, 'unused', NULL),
(4, 5, 'unused', NULL),
(4, 10, 'unused', NULL),
(4, 12, 'unused', NULL),
(4, 14, 'unused', NULL),
(5, 3, 'unused', NULL),
(5, 5, 'unused', NULL),
(5, 10, 'unused', NULL),
(5, 12, 'unused', NULL),
(5, 14, 'unused', NULL),
(6, 3, 'unused', NULL),
(6, 5, 'unused', NULL),
(6, 10, 'unused', NULL),
(6, 12, 'unused', NULL),
(6, 14, 'unused', NULL),
(7, 3, 'unused', NULL),
(7, 5, 'unused', NULL),
(7, 10, 'unused', NULL),
(7, 12, 'unused', NULL),
(7, 14, 'unused', NULL),
(8, 3, 'unused', NULL),
(8, 5, 'unused', NULL),
(8, 10, 'unused', NULL),
(8, 12, 'unused', NULL),
(8, 14, 'unused', NULL),
(9, 3, 'unused', NULL),
(9, 5, 'unused', NULL),
(9, 10, 'unused', NULL),
(9, 12, 'unused', NULL),
(9, 14, 'unused', NULL),
(10, 3, 'unused', NULL),
(10, 5, 'unused', NULL),
(10, 10, 'unused', NULL),
(10, 12, 'unused', NULL),
(10, 14, 'unused', NULL),
(11, 3, 'unused', NULL),
(11, 5, 'unused', NULL),
(11, 10, 'unused', NULL),
(11, 12, 'unused', NULL),
(11, 14, 'unused', NULL),
(12, 3, 'unused', NULL),
(12, 5, 'unused', NULL),
(12, 10, 'unused', NULL),
(12, 12, 'unused', NULL),
(12, 14, 'unused', NULL),
(13, 3, 'unused', NULL),
(13, 5, 'unused', NULL),
(13, 10, 'unused', NULL),
(13, 12, 'unused', NULL),
(13, 14, 'unused', NULL),
(14, 3, 'unused', NULL),
(14, 5, 'unused', NULL),
(14, 10, 'unused', NULL),
(14, 12, 'unused', NULL),
(14, 14, 'unused', NULL),
(15, 3, 'unused', NULL),
(15, 5, 'unused', NULL),
(15, 10, 'unused', NULL),
(15, 12, 'unused', NULL),
(15, 14, 'unused', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `customers`
--

INSERT INTO `customers` (`customer_id`, `name`, `email`, `phone`, `avatar`, `password`, `created_at`) VALUES
(1, 'Nguyễn Thu Trang', 'trang.nguyen@gmail.com', '0978123456', 'avatar1.jpg', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', '2025-11-06 14:02:06'),
(2, 'Trần Văn Minh', 'minh.tran@gmail.com', '0978234567', 'avatar2.jpg', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', '2025-11-06 14:02:06'),
(3, 'Lê Thị Hòa', 'hoa.le@gmail.com', '0978345678', 'avatar3.jpg', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', '2025-11-06 14:02:06'),
(4, 'Phạm Quang Huy', 'huy.pham@gmail.com', '0978456789', 'avatar4.jpg', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', '2025-11-06 14:02:06'),
(5, 'Vũ Thị Hạnh', 'hanh.vu@gmail.com', '0978567890', 'avatar5.jpg', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', '2025-11-06 14:02:06'),
(6, 'Hoàng Anh Tuấn', 'tuan.hoang@gmail.com', '0978678901', 'avatar6.jpg', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', '2025-11-06 14:02:06'),
(7, 'Nguyễn Thị Mai', 'mai.nguyen@gmail.com', '0978789012', 'avatar7.jpg', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', '2025-11-06 14:02:06'),
(8, 'Đỗ Đức Nam', 'nam.do@gmail.com', '0978890123', 'avatar8.jpg', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', '2025-11-06 14:02:06'),
(9, 'Trần Thị Lan', 'lan.tran@gmail.com', '0978901234', 'avatar9.jpg', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', '2025-11-06 14:02:06'),
(10, 'Lê Văn Bình', 'binh.le@gmail.com', '0978012345', 'avatar10.jpg', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', '2025-11-06 14:02:06'),
(11, 'Phan Thị Hường', 'huong.phan@gmail.com', '0978123012', 'avatar11.jpg', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', '2025-11-06 14:02:06'),
(12, 'Nguyễn Hữu Dũng', 'dung.nguyen@gmail.com', '0978230123', 'avatar12.jpg', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', '2025-11-06 14:02:06'),
(13, 'Đào Minh Tuấn', 'tuan.dao@gmail.com', '0978340123', 'avatar13.jpg', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', '2025-11-06 14:02:06'),
(14, 'Bùi Quỳnh Chi', 'chi.bui@gmail.com', '0978450123', 'avatar14.jpg', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', '2025-11-06 14:02:06'),
(15, 'Trần Thị Vân', 'van.tran@gmail.com', '0978560123', 'avatar15.jpg', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', '2025-11-06 14:02:06'),
(16, 'thach', '23001559@hus.edu.vn', '0778322905', 'default.jpg', 'scrypt:32768:8:1$a1u4m2Jyd8tidK4o$1b3ff103e5413deb65a1391b912880facb93124c8afa2618fdb3cada6e3216a35fc02eb6e534c8fe6b8d4ab5541a61869aa867842907e457218dac3aa4e40b69', '2025-11-25 02:31:14');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `employees`
--

CREATE TABLE `employees` (
  `employee_id` int(11) NOT NULL,
  `employee_name` varchar(200) DEFAULT NULL,
  `role_name` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `employees`
--

INSERT INTO `employees` (`employee_id`, `employee_name`, `role_name`, `email`, `password`, `salary`, `status`, `branch_id`) VALUES
(1, 'Nguyễn Bảo Thạch', 'Quản lý', 'thach.nguyen@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 18000000.00, 'Đang làm việc', 1),
(2, 'Lê Văn Hùng', 'Thợ làm bánh', 'hung.le@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 11000000.00, 'Đang làm việc', 1),
(3, 'Trần Thị Mai', 'Thợ làm bánh', 'mai.tran@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 11200000.00, 'Đang làm việc', 1),
(4, 'Nguyễn Văn An', 'Bán hàng', 'an.nguyen@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9000000.00, 'Đang làm việc', 1),
(5, 'Bùi Thị Chi', 'Bán hàng', 'chi.bui@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9000000.00, 'Đang làm việc', 1),
(6, 'Đỗ Hữu Dũng', 'Bán hàng', 'dung.do@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9100000.00, 'Đang làm việc', 1),
(7, 'Phạm Thu Hà', 'Bán hàng', 'ha.pham@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9000000.00, 'Đang làm việc', 1),
(8, 'Hoàng Văn Em', 'Bán hàng', 'em.hoang@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9200000.00, 'Đang làm việc', 1),
(9, 'Nguyễn Tiến Lưỡng', 'Quản lý', 'luong.nguyen@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 18000000.00, 'Đang làm việc', 2),
(10, 'Phạm Văn Giang', 'Thợ làm bánh', 'giang.pham@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 11000000.00, 'Đang làm việc', 2),
(11, 'Nguyễn Thị Lệ', 'Thợ làm bánh', 'le.nguyen@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 11300000.00, 'Đang làm việc', 2),
(12, 'Trần Văn Nam', 'Bán hàng', 'nam.tran@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9000000.00, 'Đang làm việc', 2),
(13, 'Lê Thị Hoa', 'Bán hàng', 'hoa.le@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9000000.00, 'Đang làm việc', 2),
(14, 'Phạm Đức Huy', 'Bán hàng', 'huy.pham@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9100000.00, 'Đang làm việc', 2),
(15, 'Vũ Thị Trang', 'Bán hàng', 'trang.vu@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9000000.00, 'Đang làm việc', 2),
(16, 'Đặng Văn Long', 'Bán hàng', 'long.dang@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9200000.00, 'Đang làm việc', 2),
(17, 'Lê Thị Yến', 'Quản lý', 'yen.le@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 18000000.00, 'Đang làm việc', 3),
(18, 'Ngô Văn Khánh', 'Thợ làm bánh', 'khanh.ngo@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 11000000.00, 'Đang làm việc', 3),
(19, 'Đào Thị Hương', 'Thợ làm bánh', 'huong.dao@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 11200000.00, 'Đang làm việc', 3),
(20, 'Đinh Văn Hùng', 'Bán hàng', 'hung.dinh@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9000000.00, 'Đang làm việc', 3),
(21, 'Vũ Ngọc Ánh', 'Bán hàng', 'anh.vu@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9000000.00, 'Đang làm việc', 3),
(22, 'Phan Văn Đức', 'Bán hàng', 'duc.phan@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9100000.00, 'Đang làm việc', 3),
(23, 'Hoàng Thị Thu', 'Bán hàng', 'thu.hoang@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9000000.00, 'Đang làm việc', 3),
(24, 'Trần Văn Trung', 'Bán hàng', 'trung.tran@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9200000.00, 'Đang làm việc', 3),
(25, 'Lê Nguyễn Tố Uyên', 'Quản lý', 'uyen.le@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 18000000.00, 'Đang làm việc', 4),
(26, 'Võ Văn Kiệt', 'Thợ làm bánh', 'kiet.vo@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 11000000.00, 'Đang làm việc', 4),
(27, 'Trần Ngọc Anh', 'Thợ làm bánh', 'anh.tran@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 11200000.00, 'Đang làm việc', 4),
(28, 'Nguyễn Hữu Thắng', 'Bán hàng', 'thang.nguyen@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9000000.00, 'Đang làm việc', 4),
(29, 'Đặng Thị Lan', 'Bán hàng', 'lan.dang@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9000000.00, 'Đang làm việc', 4),
(30, 'Lê Công Vinh', 'Bán hàng', 'vinh.le@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9100000.00, 'Đang làm việc', 4),
(31, 'Nguyễn Thị Nga', 'Bán hàng', 'nga.nguyen@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9000000.00, 'Đang làm việc', 4),
(32, 'Bùi Tấn Trường', 'Bán hàng', 'truong.bui@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9200000.00, 'Đang làm việc', 4),
(33, 'Nguyễn Văn Thụ', 'Quản lý', 'thu.nguyen@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 18000000.00, 'Đang làm việc', 5),
(34, 'Lương Xuân Trường', 'Thợ làm bánh', 'truong.luong@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 11000000.00, 'Đang làm việc', 5),
(35, 'Nguyễn Thị Hảo', 'Thợ làm bánh', 'hao.nguyen@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 11200000.00, 'Đang làm việc', 5),
(36, 'Nguyễn Công Phượng', 'Bán hàng', 'phuong.nguyen@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9000000.00, 'Đang làm việc', 5),
(37, 'Nguyễn Văn Toàn', 'Bán hàng', 'toan.nguyen@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9000000.00, 'Đang làm việc', 5),
(38, 'Trần Minh Vương', 'Bán hàng', 'vuong.tran@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9100000.00, 'Đang làm việc', 5),
(39, 'Phan Văn Đức', 'Bán hàng', 'duc.phan@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9000000.00, 'Đang làm việc', 5),
(40, 'Đỗ Duy Mạnh', 'Bán hàng', 'manh.do@husbakery.vn', '$2a$10$N9qo8uLOickGcVz4tcW2g.gLdVD.sS.s/YdcDuPoXf.b.sHS.VLf.', 9200000.00, 'Đang làm việc', 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `feedback`
--

CREATE TABLE `feedback` (
  `order_id` int(11) NOT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `feedback`
--

INSERT INTO `feedback` (`order_id`, `branch_id`, `rating`, `comment`, `created_at`) VALUES
(1, 1, 5, 'Chi nhánh Hoàn Kiếm phục vụ tốt', '2025-11-06 14:02:06'),
(2, 2, 5, 'Nhân viên thân thiện', '2025-11-06 14:02:06'),
(3, 3, 4, 'Không gian sạch sẽ', '2025-11-06 14:02:06'),
(4, 4, 4, 'Đóng gói đẹp', '2025-11-06 14:02:06'),
(5, 5, 5, 'Bánh rất ngon', '2025-11-06 14:02:06'),
(6, 1, 5, 'Dịch vụ tốt, giao nhanh', '2025-11-06 14:02:06'),
(7, 2, 5, 'Nhân viên tư vấn nhiệt tình', '2025-11-06 14:02:06'),
(8, 3, 4, 'Chất lượng ổn', '2025-11-06 14:02:06'),
(9, 4, 5, 'Không có gì để chê', '2025-11-06 14:02:06'),
(10, 5, 5, 'Sẽ quay lại mua lần nữa', '2025-11-06 14:02:06'),
(11, 1, 5, 'Chi nhánh phục vụ chu đáo', '2025-11-06 14:02:06'),
(12, 2, 4, 'Hài lòng', '2025-11-06 14:02:06'),
(13, 3, 5, 'Giá cả hợp lý', '2025-11-06 14:02:06'),
(14, 4, 4, 'Ổn định, chất lượng tốt', '2025-11-06 14:02:06'),
(15, 5, 5, 'Trải nghiệm tuyệt vời!', '2025-11-06 14:02:06');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `shipper_id` int(11) DEFAULT NULL,
  `coupon_id` int(11) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `recipient_name` varchar(200) DEFAULT NULL,
  `shipping_address` text DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`order_id`, `customer_id`, `branch_id`, `shipper_id`, `coupon_id`, `total_amount`, `recipient_name`, `shipping_address`, `payment_method`, `created_at`) VALUES
(1, 1, 1, 1, 1, 300000.00, 'Nguyễn Thu Trang', '15 Hàng Bạc, Hoàn Kiếm, Hà Nội', 'COD', '2025-11-06 14:02:06'),
(2, 2, 2, 3, 2, 450000.00, 'Trần Văn Minh', '89 Trần Duy Hưng, Cầu Giấy', 'Online', '2025-11-06 14:02:06'),
(3, 3, 3, 5, 3, 250000.00, 'Lê Thị Hòa', '120 Tây Sơn, Đống Đa', 'COD', '2025-11-06 14:02:06'),
(4, 4, 4, 7, 4, 550000.00, 'Phạm Quang Huy', '65 Quang Trung, Hà Đông', 'Online', '2025-11-06 14:02:06'),
(5, 5, 5, 9, 5, 200000.00, 'Vũ Thị Hạnh', '20 Nguyễn Văn Cừ, Long Biên', 'COD', '2025-11-06 14:02:06'),
(6, 6, 1, 2, 1, 320000.00, 'Hoàng Anh Tuấn', '17 Lý Nam Đế, Hoàn Kiếm', 'COD', '2025-11-06 14:02:06'),
(7, 7, 2, 4, 6, 480000.00, 'Nguyễn Thị Mai', '21 Trung Kính, Cầu Giấy', 'Online', '2025-11-06 14:02:06'),
(8, 8, 3, 6, 7, 220000.00, 'Đỗ Đức Nam', '50 Chùa Bộc, Đống Đa', 'Online', '2025-11-06 14:02:06'),
(9, 9, 4, 8, 8, 310000.00, 'Trần Thị Lan', '65 Quang Trung, Hà Đông', 'Online', '2025-11-06 14:02:06'),
(10, 10, 5, 10, 9, 180000.00, 'Lê Văn Bình', '20 Nguyễn Văn Cừ, Long Biên', 'COD', '2025-11-06 14:02:06'),
(11, 11, 1, 11, 10, 600000.00, 'Phan Thị Hường', '12 Hàng Bè, Hoàn Kiếm', 'Online', '2025-11-06 14:02:06'),
(12, 12, 2, 12, 11, 420000.00, 'Nguyễn Hữu Dũng', '55 Trần Duy Hưng, Cầu Giấy', 'COD', '2025-11-06 14:02:06'),
(13, 13, 3, 13, 12, 340000.00, 'Đào Minh Tuấn', '110 Tây Sơn, Đống Đa', 'Online', '2025-11-06 14:02:06'),
(14, 14, 4, 14, 13, 275000.00, 'Bùi Quỳnh Chi', '72 Quang Trung, Hà Đông', 'COD', '2025-11-06 14:02:06'),
(15, 15, 5, 15, 14, 900000.00, 'Trần Thị Vân', '89 Nguyễn Văn Cừ, Long Biên', 'Online', '2025-11-06 14:02:06');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 1, 1, 250000.00),
(2, 1, 9, 2, 15000.00),
(3, 2, 2, 1, 270000.00),
(4, 2, 4, 2, 30000.00),
(5, 3, 3, 2, 25000.00),
(6, 3, 5, 1, 20000.00),
(7, 4, 6, 2, 35000.00),
(8, 4, 8, 1, 55000.00),
(9, 5, 10, 2, 40000.00),
(10, 5, 9, 3, 15000.00),
(11, 6, 1, 1, 250000.00),
(12, 6, 11, 1, 260000.00),
(13, 7, 14, 2, 33000.00),
(14, 7, 12, 1, 28000.00),
(15, 8, 13, 2, 42000.00),
(16, 8, 9, 2, 15000.00),
(17, 9, 7, 3, 45000.00),
(18, 9, 10, 1, 40000.00),
(19, 10, 5, 3, 20000.00),
(20, 10, 6, 2, 35000.00),
(21, 11, 1, 2, 250000.00),
(22, 11, 2, 1, 270000.00),
(23, 12, 3, 2, 25000.00),
(24, 12, 4, 2, 30000.00),
(25, 13, 15, 3, 18000.00),
(26, 13, 10, 1, 40000.00),
(27, 14, 9, 2, 15000.00),
(28, 14, 5, 1, 20000.00),
(29, 15, 8, 2, 55000.00),
(30, 15, 7, 1, 45000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_status`
--

CREATE TABLE `order_status` (
  `order_id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `note` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_status`
--

INSERT INTO `order_status` (`order_id`, `status`, `updated_at`, `note`) VALUES
(1, 'Đã giao', '2025-11-06 14:02:06', 'Giao hàng thành công'),
(2, 'Đã giao', '2025-11-06 14:02:06', 'Khách nhận đầy đủ'),
(3, 'Đã giao', '2025-11-06 14:02:06', 'Khách hài lòng'),
(4, 'Đang giao', '2025-11-06 14:02:06', 'Shipper đang trên đường'),
(5, 'Đã giao', '2025-11-06 14:02:06', 'Đơn hoàn tất'),
(6, 'Đang xử lý', '2025-11-06 14:02:06', 'Đang chuẩn bị bánh'),
(7, 'Đã giao', '2025-11-06 14:02:06', 'Khách thanh toán online'),
(8, 'Đã giao', '2025-11-06 14:02:06', 'Giao đúng giờ'),
(9, 'Đã giao', '2025-11-06 14:02:06', 'Giao đủ món'),
(10, 'Đang giao', '2025-11-06 14:02:06', 'Shipper vừa lấy hàng'),
(11, 'Đã giao', '2025-11-06 14:02:06', 'Khách VIP đã nhận'),
(12, 'Đang xử lý', '2025-11-06 14:02:06', 'Đang đóng gói'),
(13, 'Đã giao', '2025-11-06 14:02:06', 'Giao nhanh, khách khen'),
(14, 'Đã giao', '2025-11-06 14:02:06', 'Đơn hoàn tất'),
(15, 'Đã giao', '2025-11-06 14:02:06', 'Khách rất hài lòng');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `short_desc` varchar(255) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` date DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `short_desc`, `image_url`, `unit_price`, `created_at`, `updated_at`, `category_id`) VALUES
(1, 'Bánh kem dâu tây', 'Bánh kem tươi với dâu tây tươi ngon', 'Kem dâu tươi', 'cake1.jpg', 250000.00, '2025-11-06 14:02:06', '2025-11-06', 1),
(2, 'Bánh kem socola', 'Bánh kem phủ socola đen ngọt đậm', 'Kem socola', 'cake2.jpg', 270000.00, '2025-11-06 14:02:06', '2025-11-06', 1),
(3, 'Bánh mì bơ tỏi', 'Bánh mì giòn với bơ tỏi thơm', 'Bánh mì bơ tỏi', 'bread1.jpg', 25000.00, '2025-11-06 14:02:06', '2025-11-06', 2),
(4, 'Bánh mì chà bông', 'Bánh mì mềm với chà bông và mayonnaise', 'Bánh mì chà bông', 'bread2.jpg', 30000.00, '2025-11-06 14:02:06', '2025-11-06', 2),
(5, 'Bánh su kem vanilla', 'Bánh su kem nhân vani béo ngậy', 'Su kem vani', 'choux1.jpg', 20000.00, '2025-11-06 14:02:06', '2025-11-06', 4),
(6, 'Bánh cupcake socola', 'Cupcake nhỏ phủ kem socola ngọt', 'Cupcake socola', 'cupcake1.jpg', 35000.00, '2025-11-06 14:02:06', '2025-11-06', 5),
(7, 'Bánh mousse chanh leo', 'Mousse chanh leo chua ngọt thanh mát', 'Mousse chanh leo', 'mousse1.jpg', 45000.00, '2025-11-06 14:02:06', '2025-11-06', 7),
(8, 'Bánh tiramisu truyền thống', 'Bánh tiramisu Ý truyền thống vị cà phê', 'Tiramisu', 'tiramisu1.jpg', 55000.00, '2025-11-06 14:02:06', '2025-11-06', 8),
(9, 'Bánh quy bơ', 'Bánh quy giòn tan vị bơ thơm lừng', 'Bánh quy bơ', 'cookie1.jpg', 15000.00, '2025-11-06 14:02:06', '2025-11-06', 6),
(10, 'Bánh ngọt phô mai', 'Bánh phô mai mềm mịn vị béo nhẹ', 'Bánh phô mai', 'sweet1.jpg', 40000.00, '2025-11-06 14:02:06', '2025-11-06', 3),
(11, 'Bánh kem matcha', 'Kem trà xanh đậm đà', 'Kem matcha', 'cake3.jpg', 260000.00, '2025-11-06 14:02:06', '2025-11-06', 1),
(12, 'Bánh mì trứng muối', 'Bánh mì mềm thơm nhân trứng muối', 'Trứng muối', 'bread3.jpg', 28000.00, '2025-11-06 14:02:06', '2025-11-06', 2),
(13, 'Bánh mousse dâu', 'Mousse dâu tây ngọt nhẹ', 'Mousse dâu', 'mousse2.jpg', 42000.00, '2025-11-06 14:02:06', '2025-11-06', 7),
(14, 'Bánh cupcake vani', 'Cupcake vani phủ kem tươi', 'Cupcake vani', 'cupcake2.jpg', 33000.00, '2025-11-06 14:02:06', '2025-11-06', 5),
(15, 'Bánh quy hạnh nhân', 'Bánh quy giòn hạnh nhân', 'Quy hạnh nhân', 'cookie2.jpg', 18000.00, '2025-11-06 14:02:06', '2025-11-06', 6);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_reviews`
--

CREATE TABLE `product_reviews` (
  `order_item_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `product_reviews`
--

INSERT INTO `product_reviews` (`order_item_id`, `product_id`, `customer_id`, `rating`, `comment`, `created_at`) VALUES
(1, 1, 1, 5, 'Bánh kem dâu tươi ngon tuyệt!', '2025-11-06 14:02:06'),
(3, 2, 2, 4, 'Bánh socola đậm vị, khá ngon', '2025-11-06 14:02:06'),
(5, 3, 3, 4, 'Bánh mì bơ tỏi thơm giòn', '2025-11-06 14:02:06'),
(6, 5, 3, 5, 'Su kem nhân vani béo mịn', '2025-11-06 14:02:06'),
(8, 8, 4, 5, 'Tiramisu vị cà phê chuẩn Ý', '2025-11-06 14:02:06'),
(10, 9, 5, 4, 'Bánh quy giòn thơm', '2025-11-06 14:02:06'),
(12, 11, 6, 5, 'Bánh matcha mềm ngon, không quá ngọt', '2025-11-06 14:02:06'),
(14, 14, 7, 5, 'Cupcake vani siêu xinh và ngon', '2025-11-06 14:02:06'),
(16, 9, 8, 5, 'Bánh quy ngon, sẽ mua lại', '2025-11-06 14:02:06'),
(18, 10, 9, 4, 'Phô mai mềm mịn, hợp khẩu vị', '2025-11-06 14:02:06'),
(20, 6, 10, 4, 'Cupcake socola ngon', '2025-11-06 14:02:06'),
(22, 1, 11, 5, 'Bánh kem tuyệt vời', '2025-11-06 14:02:06'),
(24, 4, 12, 5, 'Bánh mì ngon, vỏ giòn ruột mềm', '2025-11-06 14:02:06'),
(26, 15, 13, 5, 'Bánh quy hạnh nhân giòn thơm', '2025-11-06 14:02:06'),
(30, 7, 15, 5, 'Mousse chanh leo thơm mát, ăn không ngán', '2025-11-06 14:02:06');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shippers`
--

CREATE TABLE `shippers` (
  `shipper_id` int(11) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shippers`
--

INSERT INTO `shippers` (`shipper_id`, `name`, `phone`, `email`, `status`, `salary`, `branch_id`) VALUES
(1, 'Vũ Tiến Dũng', '0911000101', 'dung.vu@husbakery.vn', 'Đang hoạt động', 8000000.00, 1),
(2, 'Lương Văn Phúc', '0911000102', 'phuc.luong@husbakery.vn', 'Đang hoạt động', 8000000.00, 1),
(3, 'Mai Anh Tuấn', '0911000103', 'tuan.mai@husbakery.vn', 'Đang hoạt động', 8100000.00, 1),
(4, 'Ngô Thị Lan', '0911000104', 'lan.ngo@husbakery.vn', 'Đang hoạt động', 8000000.00, 1),
(5, 'Hà Văn Kiên', '0911000105', 'kien.ha@husbakery.vn', 'Đang hoạt động', 8200000.00, 1),
(6, 'Hoàng Văn Minh', '0912000201', 'minh.hoang@husbakery.vn', 'Đang hoạt động', 8000000.00, 2),
(7, 'Nguyễn Đức Thắng', '0912000202', 'thang.nguyen@husbakery.vn', 'Đang hoạt động', 8000000.00, 2),
(8, 'Bùi Văn Quân', '0912000203', 'quan.bui@husbakery.vn', 'Đang hoạt động', 8100000.00, 2),
(9, 'Lý Thị Phương', '0912000204', 'phuong.ly@husbakery.vn', 'Đang hoạt động', 8000000.00, 2),
(10, 'Trịnh Văn Tài', '0912000205', 'tai.trinh@husbakery.vn', 'Đang hoạt động', 8200000.00, 2),
(11, 'Nguyễn Văn Bách', '0913000301', 'bach.nguyen@husbakery.vn', 'Đang hoạt động', 8000000.00, 3),
(12, 'Lê Văn Duy', '0913000302', 'duy.le@husbakery.vn', 'Đang hoạt động', 8000000.00, 3),
(13, 'Phạm Văn Cường', '0913000303', 'cuong.pham@husbakery.vn', 'Đang hoạt động', 8100000.00, 3),
(14, 'Hồ Thị Thanh', '0913000304', 'thanh.ho@husbakery.vn', 'Đang hoạt động', 8000000.00, 3),
(15, 'Nguyễn Đình Trọng', '0913000305', 'trong.nguyen@husbakery.vn', 'Đang hoạt động', 8200000.00, 3),
(16, 'Đoàn Văn Hậu', '0914000401', 'hau.doan@husbakery.vn', 'Đang hoạt động', 8000000.00, 4),
(17, 'Vũ Văn Thanh', '0914000402', 'thanh.vu@husbakery.vn', 'Đang hoạt động', 8000000.00, 4),
(18, 'Trần Đình Trọng', '0914000403', 'trong.tran@husbakery.vn', 'Đang hoạt động', 8100000.00, 4),
(19, 'Lê Thị Diễm', '0914000404', 'diem.le@husbakery.vn', 'Đang hoạt động', 8000000.00, 4),
(20, 'Nguyễn Quang Hải', '0914000405', 'hai.nguyen@husbakery.vn', 'Đang hoạt động', 8200000.00, 4),
(21, 'Bùi Tiến Dũng', '0915000501', 'dung.bui@husbakery.vn', 'Đang hoạt động', 8000000.00, 5),
(22, 'Nguyễn Phong Hồng Duy', '0915000502', 'duy.nguyen@husbakery.vn', 'Đang hoạt động', 8000000.00, 5),
(23, 'Phạm Đức Huy', '0915000503', 'huy.pham@husbakery.vn', 'Đang hoạt động', 8100000.00, 5),
(24, 'Trần Thị Thùy Trang', '0915000504', 'trang.tran@husbakery.vn', 'Đang hoạt động', 8000000.00, 5),
(25, 'Nguyễn Trọng Hoàng', '0915000505', 'hoang.nguyen@husbakery.vn', 'Đang hoạt động', 8200000.00, 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shipper_reviews`
--

CREATE TABLE `shipper_reviews` (
  `shipper_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shipper_reviews`
--

INSERT INTO `shipper_reviews` (`shipper_id`, `customer_id`, `rating`, `comment`, `created_at`) VALUES
(1, 1, 5, 'Anh ship nhanh và thân thiện', '2025-11-06 14:02:06'),
(2, 6, 4, 'Giao hàng đúng giờ', '2025-11-06 14:02:06'),
(3, 2, 5, 'Rất nhiệt tình', '2025-11-06 14:02:06'),
(4, 7, 4, 'Giao cẩn thận, bánh nguyên vẹn', '2025-11-06 14:02:06'),
(5, 3, 5, 'Vui vẻ và chuyên nghiệp', '2025-11-06 14:02:06'),
(6, 8, 5, 'Giao hàng đúng hẹn', '2025-11-06 14:02:06'),
(7, 4, 4, 'Hơi trễ 5 phút nhưng ok', '2025-11-06 14:02:06'),
(8, 9, 5, 'Rất lịch sự', '2025-11-06 14:02:06'),
(9, 5, 5, 'Thân thiện và nhanh', '2025-11-06 14:02:06'),
(10, 15, 5, 'Giao hàng chuẩn xác', '2025-11-06 14:02:06'),
(11, 11, 4, 'Ổn, hàng nguyên vẹn', '2025-11-06 14:02:06'),
(12, 12, 5, 'Đúng giờ và nhiệt tình', '2025-11-06 14:02:06'),
(13, 13, 5, 'Khách rất hài lòng', '2025-11-06 14:02:06'),
(14, 14, 5, 'Tận tâm, dễ thương', '2025-11-06 14:02:06'),
(15, 10, 4, 'Ổn, bánh đẹp như hình', '2025-11-06 14:02:06');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`branch_id`),
  ADD UNIQUE KEY `manager_id` (`manager_id`);

--
-- Chỉ mục cho bảng `branch_products`
--
ALTER TABLE `branch_products`
  ADD PRIMARY KEY (`branch_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`customer_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Chỉ mục cho bảng `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`coupon_id`);

--
-- Chỉ mục cho bảng `coupons_customer`
--
ALTER TABLE `coupons_customer`
  ADD PRIMARY KEY (`coupon_id`,`customer_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Chỉ mục cho bảng `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Chỉ mục cho bảng `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `branch_id` (`branch_id`),
  ADD KEY `shipper_id` (`shipper_id`),
  ADD KEY `coupon_id` (`coupon_id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `order_status`
--
ALTER TABLE `order_status`
  ADD PRIMARY KEY (`order_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Chỉ mục cho bảng `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Chỉ mục cho bảng `shippers`
--
ALTER TABLE `shippers`
  ADD PRIMARY KEY (`shipper_id`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Chỉ mục cho bảng `shipper_reviews`
--
ALTER TABLE `shipper_reviews`
  ADD PRIMARY KEY (`shipper_id`,`customer_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `branches`
--
ALTER TABLE `branches`
  MODIFY `branch_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `coupons`
--
ALTER TABLE `coupons`
  MODIFY `coupon_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `employees`
--
ALTER TABLE `employees`
  MODIFY `employee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `shippers`
--
ALTER TABLE `shippers`
  MODIFY `shipper_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `branches`
--
ALTER TABLE `branches`
  ADD CONSTRAINT `fk_branches_manager` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `branch_products`
--
ALTER TABLE `branch_products`
  ADD CONSTRAINT `branch_products_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `branch_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `coupons_customer`
--
ALTER TABLE `coupons_customer`
  ADD CONSTRAINT `coupons_customer_ibfk_1` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`coupon_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `coupons_customer_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`shipper_id`) REFERENCES `shippers` (`shipper_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`coupon_id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `order_status`
--
ALTER TABLE `order_status`
  ADD CONSTRAINT `order_status_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD CONSTRAINT `product_reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_reviews_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `shippers`
--
ALTER TABLE `shippers`
  ADD CONSTRAINT `shippers_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `shipper_reviews`
--
ALTER TABLE `shipper_reviews`
  ADD CONSTRAINT `shipper_reviews_ibfk_1` FOREIGN KEY (`shipper_id`) REFERENCES `shippers` (`shipper_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `shipper_reviews_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
