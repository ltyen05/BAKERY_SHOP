import HomePage from "../HomePage/HomePage";
import AboutUs from "../AboutUs/AboutUs";
import Menu from "../Menu/Menu";
import Cake from "../Menu/Cake";
import React from "react";
import LogIn from "../LogIn/LogIn";
import SignUp from "../SignUp/SignUp";
import { Navigate } from "react-router-dom";
import Facilities from "../Facilities/Facilities";

export const routes = [
  {
    path: "/",
    page: HomePage,
    name: "Trang chủ",
    position: "middle",
    isShowHeader: true,
  },
  {
    path: "/menu",
    page: Menu,
    name: "Menu",
    position: "middle",
    isShowHeader: true,
    isShowBreadCrumbs: true,
    children: [
      {
        path: "",
        page: () => <Navigate to="cake" replace />,
      },
      {
        path: "cake",
        name: "Cake",
        page: Cake,
      },
      { path: "bread", name: "Bread", page: Cake },
      { path: "drink", name: "Drink", page: Cake },
    ],
  },
  {
    path: "/aboutUs",
    page: AboutUs,
    name: "Về chúng tôi",
    position: "middle",
    isShowHeader: true,
    isShowBreadCrumbs: true,
  },
  {
    path: "/facilities",
    page: Facilities,
    name: "Các cơ sở",
    position: "middle",
    isShowHeader: true,
    isShowBreadCrumbs: true,
  },
  {
    path: "/signUp",
    page: SignUp,
    name: "Sign Up",
    position: "right",
  },
  {
    path: "/logIn",
    page: LogIn,
    name: "Log In",
    position: "right",
    needHandleLogin: true,
  },
];
