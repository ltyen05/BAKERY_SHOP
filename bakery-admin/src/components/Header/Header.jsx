import "./Header.css";
import { FaBell, FaMoon, FaSun, FaSearch, FaBars } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Header({ onToggleSidebar }) {
  const [theme, setTheme] = useState("light");
  const [branch, setBranch] = useState("Chi nhánh Khương Trung");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <header className="header">
      <div className="header-left">

        {/* NÚT MENU MOBILE */}
        <button className="menu-btn" onClick={onToggleSidebar}>
          <FaBars />
        </button>

        {/* Chọn chi nhánh */}
        <select
          className="branch-selector"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          <option value="all">All</option>
          <option>Branch Khương Trung</option>
          <option>Branch nhánh Hoàn Kiếm</option>
          <option>Branch Cầu Giấy</option>
        </select>

        
      </div>

      <div className="header-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>

        <FaBell className="bell-icon" />

        <button className="logout">Đăng xuất</button>
      </div>
    </header>
  );
}
