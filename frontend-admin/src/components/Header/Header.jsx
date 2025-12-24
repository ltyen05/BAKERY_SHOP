import { useState } from "react";
import "./Header.css";
import {
  FaSearch,
  FaBell,
  FaExpand,
  FaBars,
} from "react-icons/fa";

export default function Header({ onToggleSidebar, onToggleFullscreen }) {
  return (
    <header className="header-container">
       {/* Nút menu hamburger */}
      <button className="menu-toggle" onClick={onToggleSidebar}>
        <FaBars />
      </button>

      <div className="header-search">
        {/* Icon kính lúp ở TRƯỚC */}
        <FaSearch className="search-icon-left" />
        <input type="text" placeholder="Search Here........" />
      </div>

      <div className="header-right">
        {/* Icon thông báo */}
        <div className="icon-circle">
          <FaBell />
        </div>
        
        {/* Icon fullscreen - Ẩn/hiện sidebar khi click */}
        <div className="icon-circle" onClick={onToggleFullscreen}>
          <FaExpand />
        </div>

        {/* Profile - chỉ hiển thị, không có dropdown */}
        <div className="profile">
          <img
            src="https://i.postimg.cc/4ykv8DXb/avatar1.png"
            alt="avatar"
            className="profile-img"
          />
          <div className="profile-info">
            <span className="name">Helen Walter</span>
            <span className="role">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}