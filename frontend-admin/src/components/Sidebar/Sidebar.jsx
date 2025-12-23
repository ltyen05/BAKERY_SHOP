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
} from "react-icons/tb";

export default function Sidebar() {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="logo">
        <h1>BAKERY PRO</h1>
        <p>Admin Dashboard</p>
      </div>

      {/* MENU CHÍNH */}
      <div className="menu-section">
        <div className="menu-title">MENU CHÍNH</div>

        <Link to="/dashboard" className={`menu-item ${isActive("/dashboard") ? "active" : ""}`}>
          <span className="icon"><TbLayoutDashboard /></span>
          <span>Dashboard</span>
        </Link>

        <Link to="/products" className={`menu-item ${isActive("/products") ? "active" : ""}`}>
          <span className="icon"><TbCake /></span>
          <span>Sản phẩm</span>
        </Link>

        <Link to="/orders" className={`menu-item ${isActive("/orders") ? "active" : ""}`}>
          <span className="icon"><TbShoppingBag /></span>
          <span>Đơn hàng</span>
        </Link>

        <Link to="/schedule" className={`menu-item ${isActive("/schedule") ? "active" : ""}`}>
          <span className="icon"><TbCalendarEvent /></span>
          <span>Lịch làm việc</span>
        </Link>
      </div>

      {/* KHÁCH HÀNG */}
      <div className="menu-section">
        <div className="menu-title">KHÁCH HÀNG</div>

        <Link to="/customers" className={`menu-item ${isActive("/customers") ? "active" : ""}`}>
          <span className="icon"><TbUser /></span>
          <span>Khách hàng</span>
        </Link>

        <Link to="/reviews" className={`menu-item ${isActive("/reviews") ? "active" : ""}`}>
          <span className="icon"><TbStar /></span>
          <span>Đánh giá</span>
        </Link>

        <Link to="/voucher" className={`menu-item ${isActive("/voucher") ? "active" : ""}`}>
          <span className="icon"><TbTicket /></span>
          <span>Voucher</span>
        </Link>
      </div>

      {/* QUẢN LÝ */}
      <div className="menu-section">
        <div className="menu-title">QUẢN LÝ</div>

        <Link to="/employee" className={`menu-item ${isActive("/employee") ? "active" : ""}`}>
          <span className="icon"><TbUsers /></span>
          <span>Nhân viên</span>
        </Link>

        <Link to="/shipper" className={`menu-item ${isActive("/shipper") ? "active" : ""}`}>
          <span className="icon"><TbTruckDelivery /></span>
          <span>Shipper</span>
        </Link>
      </div>

    </aside>
  );
}
