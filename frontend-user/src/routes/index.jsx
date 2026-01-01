import React, { lazy } from "react";
import { Navigate } from "react-router-dom";

// Tải "lười" các component trang
// Trình duyệt sẽ chỉ tải file JS cho HomePage khi người dùng vào route "/"
const HomePage = lazy(() => import("../pages/user/HomePage/HomePage"));
const AboutUs = lazy(() => import("../pages/user/AboutUs/AboutUs"));
const Menu = lazy(() => import("../pages/user/Menu/Menu"));
const ProductList = lazy(() => import("../pages/user/Menu/ProductList"));
const LogIn = lazy(() => import("../pages/auth/LogIn/LogIn"));
const SignUp = lazy(() => import("../pages/auth/SignUp/SignUp"));
const Facilities = lazy(() => import("../pages/user/Facilities/Facilities"));
const viewProfile = lazy(() => import("../pages/user/viewProfile/viewProfile"));
const ForgotPassword = lazy(() =>
  import("../pages/auth/ForgotPassword/ForgotPassword")
);
const PurchasedProductList = lazy(() =>
  import("../pages/user/Menu/PurchasedProductList")
);
const ResetPassword = lazy(() =>
  import("../pages/auth/ForgotPassword/ResetPassword")
);
const ShipperDashboard = lazy(() =>
  import("../pages/shipper/ShipperDashboard")
);
const LogedInResetPassword = lazy(() =>
  import("../pages/user/LogedInResetPassword/LogedInResetPassword")
);
const ShipperDelivery = lazy(() => import("../pages/shipper/ShipperPage"));
const payment = lazy(() => import("../pages/user/PaymentPage/PaymentPage"));
const ProductDetails = lazy(() =>
  import("../components/Product/ProductDetails")
);
// ----- PHẦN CÒN LẠI GIỮ NGUYÊN -----
// Mảng 'routes' của bạn không cần thay đổi gì cả
// vì 'HomePage' (lazy) vẫn là một component hợp lệ.
export const routes = [
  {
    path: "/",
    page: HomePage, // Vẫn dùng 'HomePage' như bình thường
    name: "Trang chủ",
    position: "middle",
    isShowHeader: true,
  },

  {
    path: "/menu",
    page: Menu, // Dùng 'Menu' (lazy)
    name: "Menu",
    position: "middle",
    isShowHeader: true,
    isShowBreadCrumbs: true,
    children: [
      {
        path: "",
        // Dòng này không phải lazy-load nên giữ nguyên
        page: () => <Navigate to="bread" replace />,
      },
      {
        path: "bread",
        name: "Bread",
        page: ProductList,
      },
      {
        path: "cookie",
        name: "Cookie",
        page: ProductList,
      },
      {
        path: "pastry",
        name: "Pastry",
        page: ProductList,
      },
      {
        path: "purchased",
        name: "Đã mua",
        tabOnly: true, // 🔥 CHỈ DÙNG CHO TAB
        page: PurchasedProductList,
        roles: ["customer"],
      },
    ],
  },
  {
    path: "/aboutUs",
    page: AboutUs, // Dùng 'AboutUs' (lazy)
    name: "Về chúng tôi",
    position: "middle",
    isShowHeader: true,
    isShowBreadCrumbs: true,
  },
  {
    path: "/productDetails/:productId",
    page: ProductDetails, // Dùng 'ProductDetails' (lazy)
    name: "Chi tiết sản phẩm",
    isShowHeader: true,
    isShowBreadCrumbs: true,
  },
  {
    path: "/productDetails",
    page: () => <Navigate to="/menu/bread" replace />, // Dùng 'ProductDetails' (lazy)
    isShowHeader: true,
    isShowBreadCrumbs: true,
  },
  {
    path: "/facilities",
    page: Facilities, // Dùng 'Facilities' (lazy)
    name: "Các cơ sở",
    position: "middle",
    isShowHeader: true,
    isShowBreadCrumbs: true,
  },
  {
    path: "/signUp",
    page: SignUp, // Dùng 'SignUp' (lazy)
    name: "Sign Up",
    position: "right",
    roles: ["guest"],
  },
  {
    path: "/logIn",
    page: LogIn, // Dùng 'LogIn' (lazy)
    name: "Log In",
    position: "right",
    needHandleLogin: true,
    roles: ["guest"],
  },
  {
    path: "/forgotPassword",
    page: ForgotPassword, // Dùng 'LogIn' (lazy)
    name: "Forgot Password",
    roles: ["guest"],
  },
  {
    path: "/resetPassword",
    page: ResetPassword, // Dùng 'LogIn' (lazy)
    name: "Reset Password",
    roles: ["guest"],
  },
  {
    path: "/viewProfile",
    page: viewProfile,
    name: "View Profile",
    isShowHeader: true,
    isShowBreadCrumbs: true,
    roles: ["customer"],
  },
  {
    path: "/logInResetPassword",
    page: LogedInResetPassword,
    name: "Đổi mật khẩu",
    isShowHeader: true,
    isShowBreadCrumbs: true,
    roles: ["customer", "shipper", "admin"],
  },
  {
    path: "/payment",
    page: payment,
    name: "Payment",
    isShowHeader: true,
    isShowBreadCrumbs: true,
    roles: ["customer"],
  },

  {
    path: "/shipperDashBoard",
    page: ShipperDashboard,
    name: "Thống kê",
    onlyShipper: true,
    roles: ["shipper"],
  },
  {
    path: "/shipperDelivery",
    page: ShipperDelivery,
    name: "Đơn hàng hiện tại",
    onlyShipper: true,
    roles: ["shipper"],
  },
];
