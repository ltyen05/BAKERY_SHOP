// ===============================================
// FILE: src/App.jsx
// FIX: Tối ưu để tránh re-render và flickering
// ===============================================
import { Suspense, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout/Layout";
import { getRoutesForUser } from "./routes";
import { Spin } from 'antd';
import 'antd/dist/reset.css';

// Loading fallback cho lazy loading
function LoadingFallback() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "18px",
      color: "#666"
    }}>
      Đang tải trang...
    </div>
  );
}

// Loading screen khi đang fetch user info
function AuthLoading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Spin size="large" />
      <p style={{ 
        marginTop: 20, 
        color: 'white', 
        fontSize: 16,
        fontWeight: 500 
      }}>
        Đang tải thông tin...
      </p>
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

// Component để render routes dựa trên user
function AppContent() {
  const { user, loading } = useAuth();

  // Dùng useMemo để tránh re-calculate routes
  const routes = useMemo(() => {
    if (!user) return [];
    return getRoutesForUser(user);
  }, [user?.role, user?.viewing_branch]); // Chỉ re-calculate khi role hoặc viewing_branch thay đổi

  // Nếu đang loading, hiển thị loading screen
  if (loading) {
    return <AuthLoading />;
  }

  // Nếu không có user, hiển thị mock login
  if (!user) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f8f9fa'
      }}>
        <h2>Bạn chưa đăng nhập</h2>
        <p>Vui lòng đăng nhập để tiếp tục</p>
        <button 
          onClick={() => {
            // Mock Super Admin
            const mockSuperAdmin = {
              id: 'SA001',
              name: 'Helen Walter',
              email: 'helen@husbakery.vn',
              role: 'super_admin',
              role_name: 'Super Admin',
              salary: 20000000,
              status: 'Active',
              branch_id: null,
              branch_name: null,
              viewing_branch: null
            };
            localStorage.setItem('admin_info', JSON.stringify(mockSuperAdmin));
            localStorage.setItem('employee_id', 'SA001');
            localStorage.setItem('access_token', 'mock_token');
            window.location.reload();
          }}
          style={{
            marginTop: 20,
            padding: '10px 24px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          Mock Login (Super Admin)
        </button>
        
        <button 
          onClick={() => {
            // Mock Branch Admin
            const mockBranchAdmin = {
              id: 'BA001',
              name: 'Nguyễn Bảo Thạch',
              email: 'thach@husbakery.vn',
              role: 'admin',
              role_name: 'Quản lý',
              salary: 15000000,
              status: 'Active',
              branch_id: 1,
              branch_name: 'HUS Bakery - Hoàn Kiếm',
              viewing_branch: null
            };
            localStorage.setItem('admin_info', JSON.stringify(mockBranchAdmin));
            localStorage.setItem('employee_id', 'BA001');
            localStorage.setItem('access_token', 'mock_token');
            window.location.reload();
          }}
          style={{
            marginTop: 12,
            padding: '10px 24px',
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          Mock Login (Branch Admin)
        </button>
      </div>
    );
  }

  // Render các routes hợp lệ
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {routes.map((route) => {
          const Component = route.element;
          return (
            <Route
              key={route.path}
              path={route.path}
              element={<Component />}
            />
          );
        })}
      </Route>
    </Routes>
  );
}

export default App;