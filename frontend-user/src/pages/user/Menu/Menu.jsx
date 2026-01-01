import React from "react";
import { Tabs } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { routes } from "../../../routes";
import { useMemo } from "react";
import Bread from "../../../assets/toast.svg";
import Cookie from "../../../assets/cookie.svg";
import Croissant from "../../../assets/croissant.svg";
import { useAuth } from "../../../context/AuthContext";
import history from "../../../assets/history.svg";
const iconMap = {
  Bread: Bread,
  Cookie: Cookie,
  Pastry: Croissant,
  "Đã mua": history,
};
export default function Menu() {
  const { user } = useAuth();
  const isCustomer = user?.role === "customer";
  const navigate = useNavigate();
  const location = useLocation();
  const menuRoute = useMemo(() => routes.find((r) => r.path === "/menu"), []);

  const items = useMemo(() => {
    if (!menuRoute?.children) return [];
    return menuRoute.children
      .filter((child) => {
        if (!child.name) return false; // bỏ redirect
        // chỉ hiển thị tab "Đã mua" nếu user là customer
        if (child.path === "purchased" && !isCustomer) return false;
        return true;
      })
      .map((child) => ({
        key: child.path,
        label: (
          <div className="fl-center" style={{ fontSize: 16, gap: "8px" }}>
            <div>
              <img
                src={iconMap[child.name]}
                alt=""
                style={{ width: 25, height: 25, color: "#7b3d00ff" }}
              />
            </div>
            <span>{child.name}</span>
          </div>
        ),
      }));
  }, [menuRoute]);
  // Lấy path con hiện tại, ví dụ: /menu/cake → "cake"
  const activeKey = location.pathname.split("/")[2] || "cake";

  return (
    <div style={{ width: "100%", maxWidth: 1400, margin: "0 auto" }}>
      <h1 className="mb-6">Menu</h1>
      <Tabs
        centered
        activeKey={activeKey}
        onChange={(key) => navigate(`/menu/${key}`)}
        items={items}
        tabBarGutter="70px"
      />
      <div style={{ marginTop: 20 }}>
        <Outlet />
      </div>
    </div>
  );
}
