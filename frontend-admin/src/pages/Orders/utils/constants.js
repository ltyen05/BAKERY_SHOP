// ===============================================
// Location: src/pages/Orders/utils/constants.js
// ===============================================

import {
  FiClock,
  FiTruck,
  FiPackage,
  FiShoppingCart,
} from "react-icons/fi";

// ============= STATS CONFIG =============
export const STATS_CONFIG = [
  {
    key: "total",
    title: "Tổng đơn hàng",
    icon: FiShoppingCart,
    color: "blue",
  },
  {
    key: "processing",
    title: "Đang xử lý",
    icon: FiClock,
    color: "orange",
  },
  {
    key: "shipping",
    title: "Đang giao",
    icon: FiTruck,
    color: "purple",
  },
  {
    key: "delivered",
    title: "Đã giao",
    icon: FiPackage,
    color: "green",
  },
];

// ============= STATUS TABS =============
export const STATUS_TABS = [
  { id: "all", label: "Tất cả", status: null },
  { id: "processing", label: "Đang xử lý", status: "Đang xử lý" },
  { id: "shipping", label: "Đang giao", status: "Đang giao" },
  { id: "delivered", label: "Đã giao", status: "Đã giao" },
];

// ============= STATUS INFO =============
export const STATUS_INFO = {
  "Đang xử lý": {
    label: "Đang xử lý",
    class: "processing",
    color: "#f59e0b",
  },
  "Đang giao": {
    label: "Đang giao",
    class: "shipping",
    color: "#8b5cf6",
  },
  "Đã giao": {
    label: "Đã giao",
    class: "delivered",
    color: "#10b981",
  },
};

// ============= STATUS OPTIONS (SELECT) =============
export const STATUS_OPTIONS = [
  { value: "Đang xử lý", label: "Đang xử lý", color: "#f59e0b" },
  { value: "Đang giao", label: "Đang giao", color: "#8b5cf6" },
  { value: "Đã giao", label: "Đã giao", color: "#10b981" },
];