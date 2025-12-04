// src/components/RoleGuard.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Component bảo vệ route dựa trên vai trò người dùng.
 * @param {object} user - Đối tượng người dùng (chứa role) hoặc null.
 * @param {Array<string>} roles - Mảng các vai trò được phép truy cập (e.g., ["admin", "user"]).
 * @param {React.ReactNode} children - Component con (trang cần bảo vệ).
 */
const RoleGuard = ({ user, roles, children }) => {
  // 1. Xác định vai trò hiện tại
  const currentRole = user?.role || "guest"; // Nếu user là null, vai trò là "guest"

  // 2. Nếu route không định nghĩa roles, cho phép truy cập
  if (!roles || roles.length === 0) {
    return children;
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
  return <Navigate to="/logIn" replace />;
};

export default RoleGuard;
