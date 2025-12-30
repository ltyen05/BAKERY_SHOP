


// ===============================================
// src/routes/index.jsx
// ===============================================
import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Lazy load các trang
const DashboardView = lazy(() => import("../pages/Dashboard/DashboardView"));
const ProductsView = lazy(() => import("../pages/Products/ProductsView"));
const CustomersView = lazy(() => import("../pages/Customers/CustomersView"));
const OrdersView = lazy(() => import("../pages/Orders/OrdersView"));
const Employee = lazy(() => import("../pages/Employee/Employee"));
const Shipper = lazy(() => import("../pages/Shipper/Shipper"));
const Voucher = lazy(() => import("../pages/Voucher/Voucher"));
const BranchView = lazy(() => import("../pages/Branch/BranchView"));
const AdminView = lazy(() => import("../pages/Admin/AdminView"));

//  Route cho SUPER ADMIN (chưa xem chi nhánh cụ thể)
export const superAdminRoutes = [
  {
    path: "/",
    element: () => <Navigate to="/dashboard" replace />,
  },
  {
    path: "dashboard",
    element: DashboardView,
    name: "Dashboard Tổng",
    icon: "dashboard",
    roles: ["super_admin"],
  },
  {
    path: "branches",
    element: BranchView,
    name: "Quản lý Chi nhánh",
    icon: "store",
    roles: ["super_admin"],
  },
  {
    path: "admins",
    element: AdminView,
    name: "Quản lý Admin",
    icon: "admin_panel_settings",
    roles: ["super_admin"],
  },
  {
    path: "*",
    element: () => (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    ),
  },
];

// Route cho BRANCH ADMIN hoặc SUPER ADMIN đang xem chi nhánh
export const branchRoutes = [
  {
    path: "/",
    element: () => <Navigate to="/dashboard" replace />,
  },
  {
    path: "dashboard",
    element: DashboardView,
    name: "Dashboard",
    icon: "dashboard",
    roles: ["admin", "super_admin_viewing_branch"],
  },
  {
    path: "products",
    element: ProductsView,
    name: "Sản phẩm",
    icon: "inventory",
    roles: ["admin", "super_admin_viewing_branch"],
  },
  {
    path: "orders",
    element: OrdersView,
    name: "Đơn hàng",
    icon: "shopping_cart",
    roles: ["admin", "super_admin_viewing_branch"],
  },
  {
    path: "customers",
    element: CustomersView,
    name: "Khách hàng",
    icon: "people",
    roles: ["admin", "super_admin_viewing_branch"],
  },
  {
    path: "employee",
    element: Employee,
    name: "Nhân viên",
    icon: "badge",
    roles: ["admin", "super_admin_viewing_branch"],
  },
  {
    path: "shipper",
    element: Shipper,
    name: "Shipper",
    icon: "local_shipping",
    roles: ["admin", "super_admin_viewing_branch"],
  },
  {
    path: "voucher",
    element: Voucher,
    name: "Voucher",
    icon: "confirmation_number",
    roles: ["admin", "super_admin_viewing_branch"],
  },
  {
    path: "*",
    element: () => (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    ),
  },
];

// Hàm helper để lấy routes phù hợp
export const getRoutesForUser = (user) => {
  const isSuperAdmin = user?.role === 'super_admin';
  const isViewingBranch = isSuperAdmin && user?.viewing_branch !== null;
  
  // Super Admin đang xem chi nhánh → dùng branch routes
  if (isViewingBranch) {
    return branchRoutes;
  }
  
  // Super Admin chưa xem chi nhánh → dùng super admin routes
  if (isSuperAdmin) {
    return superAdminRoutes;
  }
  
  // Branch Admin → dùng branch routes
  return branchRoutes;
};