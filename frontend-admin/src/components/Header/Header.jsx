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
       {/* Nút menu hamburger */}
      <button className="menu-toggle" onClick={onToggleSidebar}>
        <FaBars />
      </button>

      <div className="header-search">
        <input type="text" placeholder="Search Here........" />
        <FaSearch className="search-icon" />
      </div>

      <div className="header-right">
       

        {/* Icon trong hình tròn xám */}
        <div className="icon-circle">
          <FaBell />
        </div>
        <div className="icon-circle">
          <FaRegCommentDots />
        </div>
        <div className="icon-circle">
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
