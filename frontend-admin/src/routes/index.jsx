// ===============================================
// Location: src/routes/index.jsx
// FIXED: Path naming for basename consistency
// ===============================================
import { lazy } from "react";

// Lazy loading pages
const DashboardView = lazy(() => import("../pages/Dashboard/DashboardView"));
const ProductsView = lazy(() => import("../pages/Products/ProductsView"));
const CustomersView = lazy(() => import("../pages/Customers/CustomersView"));
const OrdersView = lazy(() => import("../pages/Orders/OrdersView"));
const Employee = lazy(() => import("../pages/Employee/Employee"));
const Shipper = lazy(() => import("../pages/Shipper/Shipper"));
const Voucher = lazy(() => import("../pages/Voucher/Voucher"));
const BranchView = lazy(() => import("../pages/Branch/BranchView"));
const AdminView = lazy(() => import("../pages/Admin/AdminView"));

// 404 fallback component
export const NotFound = () => (
  <div style={{ padding: "100px 40px", textAlign: "center" }}>
    <h1 style={{ fontSize: "48px", color: "#ff4d4f" }}>404</h1>
    <h2>Không tìm thấy trang</h2>
    <p>Đường dẫn bạn truy cập không tồn tại trong hệ thống quản trị.</p>
  </div>
);

// ========================================
// Super Admin routes (Global Scope)
// ========================================
export const superAdminRoutes = [
  {
    path: "dashboard", // KHÔNG dùng "/dashboard"
    element: DashboardView,
    name: "Dashboard Tổng",
    roles: ["super_admin"],
  },
  {
    path: "branches",
    element: BranchView,
    name: "Quản lý Chi nhánh",
    roles: ["super_admin"],
  },
  {
    path: "products",
    element: ProductsView,
    name: "Quản lý Sản phẩm",
    roles: ["super_admin"],
  },
  {
    path: "voucher",
    element: Voucher,
    name: "Quản lý Voucher",
    roles: ["super_admin"],
  },
  {
    path: "admins",
    element: AdminView,
    name: "Quản lý Admin",
    roles: ["super_admin"],
  },
];

// ========================================
// Branch routes (Branch Scope)
// ========================================
export const branchRoutes = [
  {
    path: "dashboard",
    element: DashboardView,
    name: "Dashboard",
    roles: ["admin", "super_admin_viewing_branch"],
  },
  {
    path: "products",
    element: ProductsView,
    name: "Sản phẩm",
    roles: ["admin", "super_admin_viewing_branch"],
  },
  {
    path: "orders",
    element: OrdersView,
    name: "Đơn hàng",
    roles: ["admin", "super_admin_viewing_branch"],
  },
  {
    path: "customers",
    element: CustomersView,
    name: "Khách hàng",
    roles: ["admin", "super_admin_viewing_branch"],
  },
  {
    path: "employee",
    element: Employee,
    name: "Nhân viên",
    roles: ["admin", "super_admin_viewing_branch"],
  },
  {
    path: "shipper",
    element: Shipper,
    name: "Shipper",
    roles: ["admin", "super_admin_viewing_branch"],
  },
  {
    path: "voucher",
    element: Voucher,
    name: "Voucher",
    roles: ["admin", "super_admin_viewing_branch"],
  },
];

// ========================================
// Helper: Get routes based on user role
// ========================================
export const getRoutesForUser = (user) => {
  if (!user) return [];

  const isSuperAdmin = user?.role === "super_admin";
  const isViewingBranch = isSuperAdmin && user?.viewing_branch !== null;

  // Trả về danh sách route phù hợp
  const targetRoutes =
    isViewingBranch || user?.role === "admin"
      ? [...branchRoutes]
      : isSuperAdmin
      ? [...superAdminRoutes]
      : [];

  return targetRoutes;
};
