// src/components/Layout/Layout.jsx
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <Header />
        <div className="layout-content">{children}</div>
      </div>
    </div>
  );
}
