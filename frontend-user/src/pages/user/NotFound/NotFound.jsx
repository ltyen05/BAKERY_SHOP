import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Trang bạn tìm không tồn tại</p>
      <Link to="/">Quay về trang chủ</Link>
    </div>
  );
};

export default NotFound;
