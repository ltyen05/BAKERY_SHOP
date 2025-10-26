import { Fragment } from "react";
import {
  useNavigate,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { routes } from "./routes";
import "./App.css";
import { useState } from "react";
import DefaultHeader from "./components/DefaultComponent/DefaultHeader";
import DefaultBreadCrumbs from "./components/DefaultComponent/DefaultBreadCrumbs";

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
            <HeaderLayout username={user} onLogout={handleLogout}>
              <BreadCrumbsLayout>
                <Page {...pageProps} />
              </BreadCrumbsLayout>
            </HeaderLayout>
          }
        >
          {renderRoutes(route.children, handleLogin, user)}
        </Route>
      );
    } else {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <HeaderLayout username={user} onLogout={handleLogout}>
              <BreadCrumbsLayout>
                <Page {...pageProps} />
              </BreadCrumbsLayout>
            </HeaderLayout>
          }
        />
      );
    }
  });
}
function App() {
  const [user, setUser] = useState(() => {
    return localStorage.getItem("user"); // đọc từ localStorage khi load lần đầu
  });
  const navigate = useNavigate();

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem("user", username);
    navigate("/"); // Quay lại trang chính sau khi đăng nhập
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };
  return (
    <>
      <Routes> {renderRoutes(routes, handleLogin, user, handleLogout)}</Routes>
    </>
  );
}

export default App;
