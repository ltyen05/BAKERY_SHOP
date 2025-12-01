import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import {
  FaChartBar,
  FaBirthdayCake,
  FaUsers,
  FaCalendarAlt,
  FaConciergeBell,
  FaUserTie,
  FaCommentDots,
  FaGift,
} from "react-icons/fa";

export default function Sidebar({ isOpen, onCloseSidebar }) {
  const location = useLocation();

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <FaChartBar className="icon" /> },
    { key: "products", label: "Products", icon: <FaBirthdayCake className="icon" /> },
    { key: "customers", label: "Customer", icon: <FaUsers className="icon" /> },
    { key: "booking", label: "Order", icon: <FaCalendarAlt className="icon" /> },
    { key: "service", label: "Service", icon: <FaConciergeBell className="icon" /> },
    { key: "employee", label: "Employee", icon: <FaUserTie className="icon" /> },
    { key: "feedback", label: "Feedback", icon: <FaCommentDots className="icon" /> },
    { key: "promotions", label: "Promotions", icon: <FaGift className="icon" /> },
  ];

  // Khi bấm vào menu trên mobile, đóng sidebar
  const handleClick = () => {
    if (onCloseSidebar) onCloseSidebar();
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Logo */}
      <div className="logo-section">
        <img src="/images/logo.png" alt="Logo" className="logo" />
      </div>

      {/* Profile */}
      <div className="profile">
        <img src="/images/avt.png" alt="Admin avatar" className="avatar" />
        <div className="info">
          <div className="role">Admin</div>
          <div className="email">abc@gmail.com</div>
        </div>
      </div>

      {/* Menu */}
      <nav className="menu">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            to={`/${item.key}`}
            className={`menu-item ${location.pathname === `/${item.key}` ? "active" : ""}`}
            onClick={handleClick}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
