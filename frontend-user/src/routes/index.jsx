import React, { lazy } from "react";
import { Navigate } from "react-router-dom";

// Tải "lười" các component trang
// Trình duyệt sẽ chỉ tải file JS cho HomePage khi người dùng vào route "/"
const HomePage = lazy(() => import("../HomePage/HomePage"));
const AboutUs = lazy(() => import("../AboutUs/AboutUs"));
const Menu = lazy(() => import("../Menu/Menu"));
const ProductList = lazy(() => import("../Menu/ProductList"));
const LogIn = lazy(() => import("../LogIn/LogIn"));
const SignUp = lazy(() => import("../SignUp/SignUp"));
const Facilities = lazy(() => import("../Facilities/Facilities"));
const viewProfile = lazy(() => import("../viewProfile/viewProfile"));
const Shipper = lazy(() => import("../OnlyShipperPage/ShipperPage"));
const ForgotPassword = lazy(() => import("../ForgotPassword/ForgotPassword"));
const payment = lazy(() => import("../PaymentPage/PaymentPage"));
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
    roles: ["customer", "admin", "guest"],
  },
  {
    path: "/menu",
    page: Menu, // Dùng 'Menu' (lazy)
    name: "Menu",
    position: "middle",
    isShowHeader: true,
    isShowBreadCrumbs: true,
    roles: ["customer", "admin", "guest"],
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
    ],
  },
  {
    path: "/aboutUs",
    page: AboutUs, // Dùng 'AboutUs' (lazy)
    name: "Về chúng tôi",
    position: "middle",
    isShowHeader: true,
    isShowBreadCrumbs: true,
    roles: ["customer", "admin", "guest"],
  },
  {
    path: "/facilities",
    page: Facilities, // Dùng 'Facilities' (lazy)
    name: "Các cơ sở",
    position: "middle",
    isShowHeader: true,
    isShowBreadCrumbs: true,
    roles: ["customer", "admin", "guest"],
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
    path: "/viewProfile",
    page: viewProfile,
    name: "View Profile",
    isShowHeader: true,
    isShowBreadCrumbs: true,
    roles: ["customer", "admin"],
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
    path: "/shipper",
    page: Shipper,
    name: "Shipper Page",
    isShowHeader: true,
    isShowBreadCrumbs: true,
    roles: ["shipper"],
  },
];
