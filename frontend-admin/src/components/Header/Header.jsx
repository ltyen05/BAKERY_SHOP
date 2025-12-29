import React from "react";
import { Avatar } from "antd";
import { FaExpand, FaBars } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

export default function Header({ onToggleSidebar, onToggleFullscreen }) {
  const { getCurrentBranch } = useAuth();
  const currentBranch = getCurrentBranch();

  return (
    <header className="header-container">
      {/* Nút menu hamburger - Mobile */}
      <button className="menu-toggle" onClick={onToggleSidebar}>
        <FaBars />
      </button>

      {/* Thông tin chi nhánh */}
      {currentBranch && (
        <div className="branch-info-header">
          <MdLocationOn className="location-icon" />
          <span className="branch-name-header">{currentBranch.name}</span>
        </div>
      )}

      {/* Icons bên phải */}
      <div className="header-right">
        {/* Icon fullscreen - Ẩn/hiện sidebar khi click */}
        <div className="icon-circle" onClick={onToggleFullscreen}>
          <FaExpand />
        </div>

        <div className="profile">
          <Avatar
            size={40}
            src="https://i.postimg.cc/4ykv8DXb/avatar1.png"
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