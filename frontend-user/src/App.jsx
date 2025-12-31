import { Fragment, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { AccountProvider } from "./context/AccountContext";
import { ProductProvider } from "./context/ProductContext";
import { OrderProvider } from "./context/OrderContext";
import { NotificationProvider } from "./context/Notifications";
import { useState } from "react";
import DefaultHeader from "./components/DefaultComponent/DefaultHeader";
import DefaultShipperHeader from "./components/DefaultComponent/DefaultShipperHeader";
import DefaultBreadCrumbs from "./components/DefaultComponent/DefaultBreadCrumbs";
import ScrollToTop from "./components/ScrollToTop";
import logo from "./assets/bakes.svg";
import RoleGuard from "./components/RoleGuard/RoleGuard";
function renderRoutes(routes) {
  return routes.map((route) => {
    const Page = route.page;
    const HeaderLayout = route.onlyShipper
      ? DefaultShipperHeader
      : route.isShowHeader
      ? DefaultHeader
      : Fragment;
    const BreadCrumbsLayout = route.isShowBreadCrumbs
      ? DefaultBreadCrumbs
      : Fragment;

    if (route.children) {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <RoleGuard roles={route.roles}>
              <HeaderLayout>
                <BreadCrumbsLayout>
                  <Page />
                </BreadCrumbsLayout>
              </HeaderLayout>
            </RoleGuard>
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
            <RoleGuard roles={route.roles}>
              <HeaderLayout>
                <BreadCrumbsLayout>
                  <Page />
                </BreadCrumbsLayout>
              </HeaderLayout>
            </RoleGuard>
          }
        />
      );
    }
  });
}
function AppContent() {
  return (
    <Suspense
      fallback={
        <div style={{ width: "100%", height: "100%" }} className="fl-center">
          <img src={logo} alt="logoStore" style={{ width: "200px" }} />
        </div>
      }
    >
      <Routes>{renderRoutes(routes)}</Routes>
    </Suspense>
  );
}

// Component App chính chỉ làm một việc: Khởi tạo Router
function App() {
  return (
    <>
      <ProductProvider>
        <AuthProvider>
          <AccountProvider>
            <NotificationProvider>
              <OrderProvider>
                <ScrollToTop />
                <AppContent />
              </OrderProvider>
            </NotificationProvider>
          </AccountProvider>
        </AuthProvider>
      </ProductProvider>
    </>
  );
}

export default App;
