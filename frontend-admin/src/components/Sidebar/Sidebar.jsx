import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Sidebar.css";

import {
  FaChartBar,
  FaBirthdayCake,
  FaUsers,
  FaCalendarAlt,
  FaConciergeBell,
  FaUserTie,
  FaCommentDots,
  FaGift
} from "react-icons/fa";

import { GiChefToque } from "react-icons/gi";

export default function Sidebar({ isOpen, onCloseSidebar }) {
  const location = useLocation();

  /* trạng thái mở / đóng submenu Feedback */
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menuKey) => {
    setOpenMenu((prev) => (prev === menuKey ? null : menuKey));
  };

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <FaChartBar className="icon" /> },
    { key: "products", label: "Products", icon: <FaBirthdayCake className="icon" /> },
    { key: "customers", label: "Customer", icon: <FaUsers className="icon" /> },
    { key: "orders", label: "Order", icon: <FaCalendarAlt className="icon" /> },
    { key: "service", label: "Service", icon: <FaConciergeBell className="icon" /> },
    { key: "employee", label: "Employee", icon: <FaUserTie className="icon" /> },

    {
      key: "feedback",
      label: "Feedback",
      icon: <FaCommentDots className="icon" />,
      sub: [
        { key: "feedback-overview", label: "Overview" },
        { key: "feedback-list", label: "Review List" }
      ]
    },

    { key: "promotions", label: "Promotions", icon: <FaGift className="icon" /> },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>

      {/* Logo */}
      <div className="logo-section">
        <div className="logo-icon-box">
          <GiChefToque className="logo-icon" />
        </div>
        <span className="logo-text">HUS BAKERY</span>
      </div>

      {/* Menu */}
      <nav className="menu">
        {menuItems.map((item) => (
          <div key={item.key}>

            {/* ITEM CÓ SUBMENU */}
            {item.sub ? (
              <>
                <div
                  className={`menu-item parent ${
                    openMenu === item.key ? "open" : ""
                  }`}
                  onClick={() => toggleMenu(item.key)}
                >
                  {item.icon}
                  {item.label}
                </div>

                {/* Hiện submenu nếu đang mở */}
                {openMenu === item.key && (
                  <div className="submenu">
                    {item.sub.map((sub) => (
                      <Link
                        key={sub.key}
                        to={`/${sub.key}`}
                        className={`submenu-item ${
                          location.pathname === `/${sub.key}` ? "active" : ""
                        }`}
                        onClick={onCloseSidebar}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* ITEM BÌNH THƯỜNG */
              <Link
                to={`/${item.key}`}
                className={`menu-item ${
                  location.pathname === `/${item.key}` ? "active" : ""
                }`}
                onClick={onCloseSidebar}
              >
                {item.icon}
                {item.label}
              </Link>
            )}

          </div>
        ))}
      </nav>
    </aside>
  );
}
