import { Suspense, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout/Layout";
import { getRoutesForUser } from "./routes";
import { Spin } from "antd";
import "antd/dist/reset.css";

// Fallback loading
function LoadingFallback() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
        color: "#666",
      }}
    >
      <Spin size="large" />
      <p style={{ marginLeft: 16 }}>Đang tải trang...</p>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <AppContent />
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Renders routes based on logged-in user
function AppContent() {
  const { user, loading } = useAuth();

  const routes = useMemo(() => getRoutesForUser(user), [user]);

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
        <Spin size="large" />
        <p
          style={{
            marginTop: 20,
            color: "white",
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          Đang tải thông tin...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      {/* Layout wrapper */}
      <Route path="/" element={<Layout />}>
        {/* Khi truy cập / → redirect /dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Các route của user */}
        {routes.map((route) => {
          const Component = route.element;
          // dùng path relative (không có / đầu)
          return (
            <Route key={route.path} path={route.path} element={<Component />} />
          );
        })}

        {/* Catch all 404 */}
        <Route
          path="*"
          element={
            <div style={{ padding: 40, textAlign: "center" }}>
              <h1>404 - Page Not Found</h1>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;