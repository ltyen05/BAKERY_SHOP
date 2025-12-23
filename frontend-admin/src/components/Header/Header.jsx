import "./Header.css";
import {
  FaSearch,
  FaBell,
  FaRegCommentDots,
  FaExpand,
  FaBars,
} from "react-icons/fa";

export default function Header({ onToggleSidebar }) {
  return (
    <header className="header-container">
      {/* Hamburger */}
      <button className="menu-toggle" onClick={onToggleSidebar}>
        <FaBars />
      </button>

      {/* Search */}
      <div className="header-search">
        <input type="text" placeholder="Search..." />
        <FaSearch className="search-icon" />
      </div>

      {/* Right */}
      <div className="header-right">
        <div className="icon-circle">
          <FaBell />
        </div>
        <div className="icon-circle">
          <FaRegCommentDots />
        </div>
        <div className="icon-circle fullscreen">
          <FaExpand />
        </div>

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
