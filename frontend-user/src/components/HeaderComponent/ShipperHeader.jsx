import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import { useState, useEffect } from "react";
import { Dropdown, Space, Button, Badge, Drawer } from "antd";
import bakesLogo from "../../assets/bakes.svg";
import { routes } from "../../routes";
import { LogoutOutlined, LockOutlined, MenuOutlined } from "@ant-design/icons";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import OrderNotification from "../Notification/OrderNotification";

import bell from "../../assets/bell.svg";
function getRoutesShipper(routesShipper) {
  return routesShipper.map((route) => {
    // Route không có children → chỉ là link thường
    return (
      <Link
        key={route.path}
        to={route.path}
        className="text-main-color text-16"
        style={{ fontWeight: "200" }}
      >
        {route.name}
      </Link>
    );
  });
}

function NavBar({ user, onLogout }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const view = {
    items: [
      {
        key: "username",
        label: user?.full_name, // ✅ phải là JSX hoặc string
        disabled: true,
      },
      {
        type: "divider",
      },
      {
        key: "3",
        label: "Đổi mật khẩu",
        icon: <LockOutlined />,
      },
      {
        key: "logout",
        label: <span>Đăng xuất</span>,
        onClick: onLogout,
        danger: true,
        icon: <LogoutOutlined />,
      },
    ],
  };
  const routes_Shipper = routes.filter((route) => route.onlyShipper);
  const [notifications, setNotifications] = useState([
    {
      id: 2,

      time: "Mon Dec 29 2025 22:42:30 GMT+0700",
      unread: true,
      actionText: "Xem đơn hàng",
    },
  ]);
  const fetchNotification = async () => {
    try {
      const res = await fetchWithAuth(
        "http://localhost:5001/api/shipper/notifications/check-notification",
        { method: "GET" }
      );

      if (!res.ok) return;

      const data = await res.json();

      if (data.is_read) return;

      setNotifications((prev) => {
        if (prev.some((n) => n.id === data.id)) return prev;

        return [
          {
            id: data.id,
            type: "order",
            time: data.created_at, // frontdend kiểm soát time
            unread: true,
            actionText: "Xem đơn hàng",
            orderId: data.order_id,
            address: data.address,
          },
          ...prev,
        ];
      });
    } catch (err) {
      console.error("Fetch notification error:", err);
    }
  };

  useEffect(() => {
    fetchNotification(); // gọi ngay khi load

    const interval = setInterval(() => {
      // ❗ chỉ poll khi tab đang active
      if (document.visibilityState === "visible") {
        fetchNotification();
      }
    }, 10000); // ⏱ 15s (rất ổn)

    return () => clearInterval(interval);
  }, []);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkRead = (id) => {
    // ❗ Xoá ngay khỏi UI (UX mượt)
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    // // Gọi API nền
    // try {
    //   await fetchWithAuth(
    //     `http://localhost:5000/api/shipper/notifications/mark-read/${id}`,
    //     { method: "POST" }
    //   );
    // } catch (err) {
    //   console.error("Mark read error:", err);
    // }
  };

  const renderNotification = (notification) => {
    const props = {
      notification,
      onMarkRead: handleMarkRead,
    };

    return <OrderNotification key={notification.id} now={now} {...props} />;
  };

  const dropdownContent = (
    <div
      style={{
        width: "420px",
        maxWidth: "100vw",
        backgroundColor: "white",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div className="notification-header">
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              level={5}
              style={{ color: "white", margin: 0, fontSize: "16px" }}
            >
              Thông báo
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px" }}>
              Bạn có {unreadCount} thông báo chưa đọc
            </p>
          </div>
        </Space>
      </div>

      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
        {notifications.length === 0 ? (
          <div
            style={{ padding: "40px 20px", textAlign: "center", color: "#999" }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔔</div>
            <p type="secondary">Không có thông báo mới</p>
          </div>
        ) : (
          notifications.map((notification) => renderNotification(notification))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="notification-footer">
          <Button
            type="link"
            style={{ color: "#92400e", fontWeight: 600, padding: 0 }}
          >
            Xem tất cả thông báo
          </Button>
        </div>
      )}
    </div>
  );
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Row
        justify="space-around"
        align="bottom"
        style={{ height: "77px", width: "90%" }}
      >
        <Col xs={9} md={4}>
          <Row justify="space-between">
            <Button
              type="text"
              icon={<MenuOutlined />}
              className="md-hidden"
              onClick={() => setOpenMenu(true)}
              style={{ marginTop: "10px" }}
            />
            <img
              src={bakesLogo}
              alt="Stylized bakery logo"
              style={{ height: "55px" }}
            />
          </Row>
        </Col>

        <Col xs={0} md={10}>
          <Row>
            {getRoutesShipper(routes_Shipper).map((comp, idx) => (
              <Col
                xs={0}
                md={24 / routes_Shipper.length}
                key={idx}
                style={{
                  margin: "auto",
                  minHeight: "35px",
                }}
              >
                {comp}
              </Col>
            ))}
          </Row>
        </Col>
        <Col xs={12} md={4}>
          <Row justify="end" style={{ minHeight: "55px" }} align="middle">
            <div
              style={{
                display: "flex",
                gap: "15px",
                alignItems: "center",
              }}
            >
              <Dropdown
                popupRender={() => dropdownContent}
                trigger={["click"]}
                placement="bottomRight"
              >
                <div
                  className="fl-center hover-grey"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                >
                  <Badge count={unreadCount} showZero color="#ab5506ff">
                    <div className="fl-center">
                      <img src={bell} alt="bell-image" width="25px" color="" />
                    </div>
                  </Badge>
                </div>
              </Dropdown>

              <Dropdown
                placement="bottom"
                menu={{
                  ...view,

                  className: "my-dropdown",
                }}
              >
                <img
                  src={
                    "https://i.pinimg.com/originals/24/bd/d9/24bdd9ec59a9f8966722063fe7791183.jpg"
                  }
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                  style={{ width: "35px", borderRadius: "50%" }}
                />
              </Dropdown>
            </div>
          </Row>
        </Col>
      </Row>
      <Drawer
        title="Menu"
        placement="left"
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        width={260}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {getRoutesShipper(routes_Shipper).map((comp, idx) => (
            <div key={idx} onClick={() => setOpenMenu(false)}>
              {comp}
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
}

export default NavBar;
