import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";

import {
  TbLayoutDashboard,
  TbCake,
  TbShoppingBag,
  TbCalendarEvent,
  TbUser,
  TbStar,
  TbTicket,
  TbUsers,
  TbTruckDelivery,
  TbX,
  TbSettings,
  TbLogout,
} from "react-icons/tb";

export default function Sidebar({ isOpen, onCloseSidebar }) {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Hàm đóng sidebar khi click vào menu item (chỉ trên mobile)
  const handleMenuClick = () => {
    if (window.innerWidth <= 768) {
      onCloseSidebar();
    }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    console.log("Đăng xuất");
    // Thêm logic đăng xuất ở đây
    // Ví dụ: window.location.href = "/login";
  };

  return (
    <>
      {/* Overlay để đóng sidebar khi click bên ngoài (chỉ hiện trên mobile) */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onCloseSidebar}></div>
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Nút đóng sidebar (chỉ hiện trên mobile) */}
        <button className="sidebar-close" onClick={onCloseSidebar}>
          <TbX />
        </button>

        {/* LOGO */}
        <div className="logo">
          <h1>BAKERY PRO</h1>
          <p>Admin Dashboard</p>
        </div>

        {/* MENU CHÍNH */}
        <div className="menu-section">
          <div className="menu-title">MENU CHÍNH</div>

          <Link to="/dashboard" className={`menu-item ${isActive("/dashboard") ? "active" : ""}`} onClick={handleMenuClick}>
            <span className="icon"><TbLayoutDashboard /></span>
            <span>Dashboard</span>
          </Link>

          <Link to="/products" className={`menu-item ${isActive("/products") ? "active" : ""}`} onClick={handleMenuClick}>
            <span className="icon"><TbCake /></span>
            <span>Sản phẩm</span>
          </Link>

          <Link to="/orders" className={`menu-item ${isActive("/orders") ? "active" : ""}`} onClick={handleMenuClick}>
            <span className="icon"><TbShoppingBag /></span>
            <span>Đơn hàng</span>
          </Link>

          <Link to="/schedule" className={`menu-item ${isActive("/schedule") ? "active" : ""}`} onClick={handleMenuClick}>
            <span className="icon"><TbCalendarEvent /></span>
            <span>Lịch làm việc</span>
          </Link>
        </div>

        {/* KHÁCH HÀNG */}
        <div className="menu-section">
          <div className="menu-title">KHÁCH HÀNG</div>

          <Link to="/customers" className={`menu-item ${isActive("/customers") ? "active" : ""}`} onClick={handleMenuClick}>
            <span className="icon"><TbUser /></span>
            <span>Khách hàng</span>
          </Link>

          <Link to="/feedback" className={`menu-item ${isActive("/feedback") ? "active" : ""}`} onClick={handleMenuClick}>
            <span className="icon"><TbStar /></span>
            <span>Feedback</span>
          </Link>

          <Link to="/voucher" className={`menu-item ${isActive("/voucher") ? "active" : ""}`} onClick={handleMenuClick}>
            <span className="icon"><TbTicket /></span>
            <span>Voucher</span>
          </Link>
        </div>

        {/* QUẢN LÝ */}
        <div className="menu-section">
          <div className="menu-title">QUẢN LÝ</div>

          <Link to="/employee" className={`menu-item ${isActive("/employee") ? "active" : ""}`} onClick={handleMenuClick}>
            <span className="icon"><TbUsers /></span>
            <span>Nhân viên</span>
          </Link>

          <Link to="/shipper" className={`menu-item ${isActive("/shipper") ? "active" : ""}`} onClick={handleMenuClick}>
            <span className="icon"><TbTruckDelivery /></span>
            <span>Shipper</span>
          </Link>

          {/* Cài đặt với dropdown */}
          <div className="settings-wrapper">
            <div 
              className={`menu-item ${isActive("/settings") ? "active" : ""}`}
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            >
              <span className="icon"><TbSettings /></span>
              <span>Cài đặt</span>
            </div>

            {/* Dropdown logout */}
            {showSettingsMenu && (
              <div className="settings-dropdown">
                <div className="dropdown-item-sidebar logout" onClick={handleLogout}>
                  <TbLogout />
                  <span>Đăng xuất</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}