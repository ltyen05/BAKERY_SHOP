import HomePage from "../HomePage/HomePage";
import AboutUs from "../AboutUs/AboutUs";
import Menu from "../Menu/Menu";
import Cake from "../Menu/Cake";
import LogIn from "../LogIn/LogIn";
import SignUp from "../SignUp/SignUp";

export const routes = [
  {
    path: "/",
    page: HomePage,
    name: "Home",
  },
  {
    path: "/menu",
    page: Menu,
    name: "Menu",
    children: [
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
    name: "About Us",
  },
  {
    path: "/signUp",
    page: SignUp,
    name: "Sign Up",
  },
  {
    path: "/logIn",
    page: LogIn,
    name: "Log In",
  },
];
