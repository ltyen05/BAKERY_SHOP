import React from "react";
import { Tabs } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { routes } from "../routes";
import { useMemo } from "react";

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
      }));
  }, [menuRoute]);
  // Lấy path con hiện tại, ví dụ: /menu/cake → "cake"
  const activeKey = location.pathname.split("/")[2] || "cake";

  return (
    <div style={{ padding: 20 }}>
      <h2>Menu</h2>
      <Tabs
        activeKey={activeKey}
        onChange={(key) => navigate(`/menu/${key}`)}
        items={items}
      />
      <div style={{ marginTop: 20 }}>
        <Outlet />
      </div>
    </div>
  );
}
