import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import "./Layout.css";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle sidebar khi bấm nút menu
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  // Đóng sidebar (khi chọn menu)
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="layout">
      <Sidebar isOpen={isSidebarOpen} onCloseSidebar={closeSidebar} />
      <div className="layout-main">
        <Header onToggleSidebar={toggleSidebar} />
        <div className="layout-content">{children}</div>
      </div>
    </div>
  );
}
