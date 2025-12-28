import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import { Dropdown, Space, Button, Badge } from "antd";
import { useState } from "react"; // ⚠️ phải có// ⚠️ phải có
import bakesLogo from "../../assets/bakes.svg";
import { routes } from "../../routes";
import {
  UserOutlined,
  LogoutOutlined,
  LockOutlined,
  DownOutlined,
} from "@ant-design/icons";
import OrderNotification from "../Notification/OrderNotification";
import ReviewNotification from "../Notification/ReviewNotification";
import PromoNotification from "../Notification/PromoNotification";

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
      id: 1,
      type: "review",
      title: "Đánh giá sản phẩm",
      message:
        "Cảm ơn bạn vì đã mua sản phẩm của chúng tôi. Chúng tôi rất mong nhận được đánh giá từ bạn để phục vụ tốt hơn trong lần tới!",
      time: "5 phút trước",
      unread: true,
      actionText: "Để lại nhận xét",
    },
    {
      id: 2,
      type: "order",
      title: "Đơn hàng đã giao",
      message:
        "Đơn hàng #12345 của bạn đã được giao thành công. Hãy kiểm tra và cho chúng tôi biết ý kiến của bạn!",
      time: "2 giờ trước",
      unread: true,
      actionText: "Xem đơn hàng",
    },

    {
      id: 4,
      type: "promo",
      title: "Ưu đãi đặc biệt",
      message: "Giảm 20% cho đơn hàng tiếp theo của bạn. Mã: REVIEW20",
      time: "2 ngày trước",
      unread: false,
      actionText: "Sử dụng mã",
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const renderNotification = (notification) => {
    const props = {
      notification,
      onMarkRead: handleMarkRead,
      onDelete: handleDelete,
    };

    switch (notification.type) {
      case "review":
        return <ReviewNotification key={notification.id} {...props} />;
      case "order":
        return <OrderNotification key={notification.id} {...props} />;
      case "promo":
        return <PromoNotification key={notification.id} {...props} />;
      default:
        return null;
    }
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
        <Col xs={6} md={4}>
          <Row justify="start">
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
                dropdownRender={() => dropdownContent}
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
    </div>
  );
}

export default NavBar;
