// ===============================================
// Location: src/App.jsx
// FIX: Branch Admin automatic redirect to Dashboard
// ===============================================
import { Suspense, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout/Layout";
import { getRoutesForUser } from "./routes";
import { Spin } from 'antd';
import 'antd/dist/reset.css';

// Loading fallback for lazy loading
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
      <Spin size="large" />
      <p style={{ marginLeft: 16 }}>Đang tải trang...</p>
    </div>
  );
}

// Loading screen during fetch user info
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

// Component to render routes based on user session
function AppContent() {
  const { user, loading } = useAuth();

  // Use useMemo to prevent unnecessary route recalculations
  const routes = useMemo(() => {
    if (!user) return [];
    return getRoutesForUser(user);
  }, [user?.role, user?.viewing_branch]);

  console.log('Debug: Routing update', {
    user: user?.name,
    role: user?.role,
    viewing_branch: user?.viewing_branch,
    routes_count: routes.length,
    loading
  });

  if (loading) {
    return <AuthLoading />;
  }

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
        <h2 style={{ marginBottom: 8 }}>Bạn chưa đăng nhập</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>Vui lòng đăng nhập để tiếp tục</p>
        
        <button 
          onClick={() => {
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
            marginBottom: 12,
            padding: '12px 32px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
          }}
        >
          Login as Super Admin
        </button>
        
        <button 
          onClick={() => {
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
            padding: '12px 32px',
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
          }}
        >
          Login as Branch Admin
        </button>
      </div>
    );
  }

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