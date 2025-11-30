import "./Header.css";
import { FaBell, FaMoon, FaSun, FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Header() {
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
        {/* Chọn chi nhánh */}
        <select
          className="branch-selector"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          <option>Chi nhánh Khương Trung</option>
          <option>Chi nhánh Hoàn Kiếm</option>
          <option>Chi nhánh Cầu Giấy</option>
        </select>

        {/* Ô tìm kiếm */}
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Tìm kiếm sản phẩm, đơn hàng..." />
        </div>
      </div>

      <div className="header-right">
        {/* Nút đổi theme */}
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>

        {/* Chuông thông báo */}
        <FaBell className="bell-icon" />

        {/* Nút đăng xuất */}
        <button className="logout">Đăng xuất</button>
      </div>
    </header>
  );
}
