import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import HeaderComponent from "./components/HeaderComponent/HeaderComponent";
import "./App.css";
import DefaultHeader from "./components/DefaultComponent/DefaultHeader";
import DefaultBreadCrumbs from "./components/DefaultComponent/DefaultBreadCrumbs";
import React, { Fragment } from "react";
function renderRoutes(routes) {
  return routes.map((route) => {
    const Page = route.page;
    const HeaderLayout = route.isShowHeader ? DefaultHeader : Fragment;
    const BreadCrumbsLayout = route.isShowBreadCrumbs
      ? DefaultBreadCrumbs
      : Fragment;
    if (route.children) {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <HeaderLayout>
              <BreadCrumbsLayout>
                <Page />
              </BreadCrumbsLayout>
            </HeaderLayout>
          }
        >
          {renderRoutes(route.children)}
        </Route>
      );
    } else {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <HeaderLayout>
              <BreadCrumbsLayout>
                <Page />
              </BreadCrumbsLayout>
            </HeaderLayout>
          }
        />
      );
    }
  });
}
function App() {
  return (
    <Router>
      <Routes> {renderRoutes(routes)}</Routes>
    </Router>
  );
}

export default App;
