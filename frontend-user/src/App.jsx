import { Fragment, Suspense } from "react";
import { useNavigate, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import "./App.css";
import { useState } from "react";
import DefaultHeader from "./components/DefaultComponent/DefaultHeader";
import DefaultBreadCrumbs from "./components/DefaultComponent/DefaultBreadCrumbs";
import ScrollToTop from "./components/ScrollToTop";
import RoleGuard from "./components/RoleGuard/RoleGuard";
function renderRoutes(routes, handleLogin, user, handleLogout) {
  return routes.map((route) => {
    const Page = route.page;
    const HeaderLayout = route.isShowHeader ? DefaultHeader : Fragment;
    const BreadCrumbsLayout = route.isShowBreadCrumbs
      ? DefaultBreadCrumbs
      : Fragment;
    const pageProps = route.needHandleLogin
      ? { onLogin: handleLogin }
      : { user };
    if (route.children) {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <RoleGuard user={user} roles={route.roles}>
              <HeaderLayout user={user} onLogout={handleLogout}>
                <BreadCrumbsLayout>
                  <Page {...pageProps} />
                </BreadCrumbsLayout>
              </HeaderLayout>
            </RoleGuard>
          }
        >
          {renderRoutes(route.children, handleLogin, user, handleLogout)}
        </Route>
      );
    } else {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <RoleGuard user={user} roles={route.roles}>
              <HeaderLayout user={user} onLogout={handleLogout}>
                <BreadCrumbsLayout>
                  <Page {...pageProps} />
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
  // const [user, setUser] = useState(() => {
  //   const storedUser = localStorage.getItem("user");
  //   return storedUser ? JSON.parse(storedUser) : null;
  // });
  // const navigate = useNavigate();

  // const handleLogin = (userInfo) => {
  //   // userInfo: { id, name, email, avatar, role }
  //   setUser(userInfo);
  //   localStorage.setItem("user", JSON.stringify(userInfo));
  // };

  // const handleLogout = () => {
  //   setUser(null);
  //   localStorage.removeItem("user");
  //   localStorage.removeItem("access_token"); // Xóa cả token
  //   navigate("/logIn");
  // };
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    // Lấy thông tin user (dạng đối tượng) từ localStorage
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate(); // <-- Bây giờ hook này hợp lệ

  const handleLogin = (userInfo) => {
    // userInfo: { username: '...', role: 'user' hoặc 'admin' }
    setUser(userInfo);
    localStorage.setItem("user", JSON.stringify(userInfo));
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/logIn");
  };

  return (
    <Suspense fallback={<div>Đang tải trang...</div>}>
      <Routes>{renderRoutes(routes, handleLogin, user, handleLogout)}</Routes>
    </Suspense>
  );
}

// Component App chính chỉ làm một việc: Khởi tạo Router
function App() {
  return (
    <>
      <ScrollToTop />
      <AppContent />
    </>
  );
}

export default App;
