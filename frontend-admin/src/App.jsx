import { Suspense, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout/Layout";
import { getRoutesForUser } from "./routes";
import { Spin, Result, Button } from "antd";
import "antd/dist/reset.css";

// Fallback loading khi dùng lazy load
function LoadingFallback() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Spin size="large" tip="Đang tải trang..." />
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  // Tính toán danh sách route dựa trên quyền user
  const routes = useMemo(() => getRoutesForUser(user), [user]);

  // Giao diện loading khi kiểm tra Token/User lúc mới vào trang
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Spin size="large" white />
        <p
          style={{
            marginTop: 20,
            color: "white",
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          Đang xác thực quyền truy cập...
        </p>
      </div>
    );
  }

  // Trường hợp không có user (Token sai hoặc chưa đăng nhập)
  // Vì đây là trang Admin (port 3001), nếu ko có user ta đẩy về trang chính (port 3000)
  if (!user) {
    return (
      <div style={{ padding: "100px 0" }}>
        <Result
          status="403"
          title="Truy cập bị từ chối"
          subTitle="Bạn cần đăng nhập từ hệ thống chính để vào trang quản trị."
          extra={
            <Button type="primary" href="https://husbakery.duckdns.org/login">
              Quay lại Trang chủ
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Khi vào đường dẫn gốc /admin/ -> tự động nhảy vào dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Render danh sách các route động từ cấu hình routes/index.jsx */}
        {routes.map((route) => {
          const Component = route.element;
          return (
            <Route
              key={route.path}
              path={route.path} // các path như "dashboard", "products" (không có /)
              element={<Component />}
            />
          );
        })}

        {/* Bất kỳ path nào khác bên trong không gian /admin/ sẽ báo 404 */}
        <Route
          path="*"
          element={
            <Result
              status="404"
              title="404"
              subTitle="Trang bạn tìm kiếm không tồn tại trong khu vực quản trị."
              extra={
                <Button
                  type="primary"
                  onClick={() => (window.location.href = "/admin/")}
                >
                  Về Dashboard
                </Button>
              }
            />
          }
        />
      </Route>
    </Routes>
  );
}

// Giữ AuthProvider bọc ngoài cùng để toàn bộ App có thể dùng useAuth()
function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AppContent />
    </Suspense>
  );
}

export default App;
