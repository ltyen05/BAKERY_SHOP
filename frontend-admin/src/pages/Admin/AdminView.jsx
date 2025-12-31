// ===============================================
// src/pages/Admin/AdminView.jsx
// ===============================================
import React from 'react';
import './AdminView.css';

export default function AdminView() {
  return (
    <div className="admin-view-container">
      <div className="page-header">
        <h1>Quản lý Admin</h1>
        <p>Quản lý tài khoản admin của các chi nhánh</p>
      </div>

      <div className="coming-soon-card">
        <div className="icon"></div>
        <h2>Đang phát triển</h2>
        <p>Trang quản lý admin sẽ sớm được hoàn thiện</p>
        <ul className="feature-list">
          <li>Xem danh sách admin</li>
          <li>Thêm admin mới cho chi nhánh</li>
          <li>Chỉnh sửa thông tin admin</li>
          <li>Vô hiệu hóa tài khoản</li>
          <li>Phân quyền truy cập</li>
        </ul>
      </div>
    </div>
  );
}