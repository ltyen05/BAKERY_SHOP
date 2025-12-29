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
const Feedback = lazy(() => import("../pages/Feedback/Feedback"));
const ScheduleView = lazy(() => import("../pages/Schedule/ScheduleView"));

export const adminRoutes = [
  {
    path: "/",
    element: () => <Navigate to="/dashboard" replace />, // ✅ Sửa thành function
  },
  {
    path: "dashboard",
    element: DashboardView,
    name: "Tổng quan",
    icon: "dashboard",
    roles: ["admin"],
  },
  {
    path: "products",
    element: ProductsView,
    name: "Sản phẩm",
    icon: "inventory",
    roles: ["admin"],
  },
  {
    path: "orders",
    element: OrdersView,
    name: "Đơn hàng",
    icon: "shopping_cart",
    roles: ["admin"],
  },
  {
    path: "customers",
    element: CustomersView,
    name: "Khách hàng",
    icon: "people",
    roles: ["admin"],
  },
  {
    path: "employee",
    element: Employee,
    name: "Nhân viên",
    icon: "badge",
    roles: ["admin"],
  },
  {
    path: "shipper",
    element: Shipper,
    name: "Shipper",
    icon: "local_shipping",
    roles: ["admin"],
  },
  {
    path: "voucher",
    element: Voucher,
    name: "Voucher",
    icon: "confirmation_number",
    roles: ["admin"],
  },
  {
    path: "feedback",
    element: Feedback,
    name: "Phản hồi",
    icon: "feedback",
    roles: ["admin"],
  },
  {
  path: "schedule",
  element: ScheduleView,
  name: "Lịch làm việc",
  icon: "calendar_today",
  roles: ["admin"],
},
  {
    path: "*",
    element: () => (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    ),
    name: "404",
  },
];