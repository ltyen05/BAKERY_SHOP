import React from "react";
import { Tabs } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { routes } from "../routes";
import { useMemo } from "react";
import Cake from "../assets/cake.svg";
import Bread from "../assets/Bread.svg";
import Coffee from "../assets/Coffee.svg";
const iconMap = {
  Cake: Cake,
  Bread: Bread,
  Drink: Coffee,
};
export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRoute = useMemo(() => routes.find((r) => r.path === "/menu"), []);

  const items = useMemo(() => {
    if (!menuRoute?.children) return [];
    return menuRoute.children
      .filter((child) => child.name) // bỏ redirect (vì nó ko có name)
      .map((child) => ({
        key: child.path,
        label: child.name,
        icon: (
          <img
            src={iconMap[child.name]}
            alt=""
            style={{ width: 20, height: 20, color: "#7b3d00ff" }}
          />
        ),
      }));
  }, [menuRoute]);
  // Lấy path con hiện tại, ví dụ: /menu/cake → "cake"
  const activeKey = location.pathname.split("/")[2] || "cake";

  return (
    <div style={{ padding: 20 }}>
      <h2>Menu</h2>
      <Tabs
        centered
        activeKey={activeKey}
        onChange={(key) => navigate(`/menu/${key}`)}
        items={items}
        tabBarGutter="100px"
      />
      <div style={{ marginTop: 20 }}>
        <Outlet />
      </div>
    </div>
  );
}
