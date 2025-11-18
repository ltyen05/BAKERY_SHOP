// Thay vì import tĩnh...
// import HomePage from "../HomePage/HomePage";
// import AboutUs from "../AboutUs/AboutUs";
// import Menu from "../Menu/Menu";
// ...

// ...Hãy dùng 'lazy' của React
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
        page: () => <Navigate to="cake" replace />,
      },
      {
        path: "cake",
        name: "Cake",
        page: ProductList,
        props: { category: "cake" }, // Dùng 'Cake' (lazy)
      },
      {
        path: "bread",
        name: "Bread",
        page: ProductList,
        props: { category: "bread" },
      },
      {
        path: "drink",
        name: "Drink",
        page: ProductList,
        props: { category: "drink" },
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
  },
  {
    path: "/logIn",
    page: LogIn, // Dùng 'LogIn' (lazy)
    name: "Log In",
    position: "right",
    needHandleLogin: true,
  },
  {
    path: "/viewProfile",
    page: viewProfile,
    name: "View Profile",
    isShowHeader: true,
    isShowBreadCrumbs: true,
  },
];
