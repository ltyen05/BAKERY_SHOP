import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import "./Layout.css";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Theo dõi kích thước màn hình để tự động đóng sidebar khi ở mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="layout">
      <Sidebar
        isOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />

      <div className="layout-main">
        {/* Header cố định trên cùng */}
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Nội dung cuộn */}
        <div className="layout-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
