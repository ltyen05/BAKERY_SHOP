

// ===============================================
// src/App.jsx
// ===============================================
import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout/Layout";
import { getRoutesForUser } from "./routes";
import 'antd/dist/reset.css';

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

//  Component để render routes dựa trên user
function AppContent() {
  const { user } = useAuth();
  const routes = getRoutesForUser(user);

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