// src/components/RoleGuard.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { tokenStorage } from "../../utils/token";
/**
 * Component bảo vệ route dựa trên vai trò người dùng.
 * @param {object} user - Đối tượng người dùng (chứa role) hoặc null.
 * @param {Array<string>} roles - Mảng các vai trò được phép truy cập (e.g., ["admin", "user"]).
 * @param {React.ReactNode} children - Component con (trang cần bảo vệ).
 */
const RoleGuard = ({ roles, children }) => {
  const { user } = useAuth();
  // 1. Xác định vai trò hiện tại
  const currentRole = user?.role || "guest"; // Nếu user là null, vai trò là "guest"
  if (!roles || roles.length === 0) {
    return children;
  }
  const isGuestOnly = roles.length === 1 && roles[0] === "guest";
  const token = tokenStorage.get();
  // 2. Nếu route không định nghĩa roles, cho phép truy cập
  if (user && isGuestOnly) {
    console.warn(
      `User role "${currentRole}" tried to access restricted route.`
    );

    if (currentRole === "shipper") {
      return <Navigate to="/shipperDashBoard" replace />;
    }
    if (currentRole === "customer") {
      return <Navigate to="/" replace />;
    }
    if (currentRole === "Quản lý" || currentRole === "Siêu quản lý") {
      return (window.location.href = `http://localhost:3001?token=${token}`);
    }
  }

  // 3. Kiểm tra quyền truy cập
  if (roles.includes(currentRole)) {
    return children; // Được phép truy cập
  }

  // 4. KHÔNG được phép truy cập -> Xử lý chuyển hướng

  // Nếu người dùng đã đăng nhập (không phải guest) và bị cấm truy cập
  if (user) {
    // Chuyển hướng về trang chủ
    console.warn(
      `User role "${currentRole}" tried to access restricted route.`
    );
    return <Navigate to="/" replace />;
  }

  // Nếu là khách (guest) cố truy cập trang cần đăng nhập/quyền
  console.warn("Guest user tried to access restricted route.");
  return <Navigate to="/logIn" replace />;
};

export default RoleGuard;
