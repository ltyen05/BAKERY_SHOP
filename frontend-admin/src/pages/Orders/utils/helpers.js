// ===============================================
// Location: src/pages/Orders/utils/helpers.js
// FIXED: Changed image URL to production domain
// ===============================================

import { FiClock, FiTruck, FiPackage } from "react-icons/fi";

// ============= FORMAT HELPERS =============
export const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ============= STATUS HELPERS =============
export const getStatusIcon = (status) => {
  const icons = {
    "Đang xử lý": FiClock,
    "Đang giao": FiTruck,
    "Đã giao": FiPackage,
  };
  return icons[status] || FiClock;
};

export const getStatusColor = (status) => {
  const colors = {
    "Đang xử lý": "orange",
    "Đang giao": "purple",
    "Đã giao": "green",
  };
  return colors[status] || "default";
};

// ============= IMAGE HELPERS =============
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // Nếu ảnh đã là link full (http...) thì giữ nguyên
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // 👇 SỬA Ở ĐÂY: Trỏ về domain thật thay vì localhost
  if (imageUrl.startsWith('/')) {
    return `https://husbakery.duckdns.org${imageUrl}`;
  }
  return `https://husbakery.duckdns.org/${imageUrl}`;
};