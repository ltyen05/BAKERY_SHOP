import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import "./Layout.css";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Toggle fullscreen mode (ẩn/hiện sidebar)
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="layout">
      {/* Chỉ hiển thị sidebar khi KHÔNG ở chế độ fullscreen */}
      {!isFullscreen && (
        <Sidebar
          isOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="layout-main">
        {/* Header cố định trên cùng */}
        <Header 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onToggleFullscreen={handleToggleFullscreen}
        />

        {/* Nội dung cuộn */}
        <div className="layout-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}