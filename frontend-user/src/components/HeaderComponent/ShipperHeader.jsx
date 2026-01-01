import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import { useState, useEffect, useRef } from "react";
import { Dropdown, Space, Button, Badge, Drawer, Spin } from "antd";
import bakesLogo from "../../assets/bakes.svg";
import { routes } from "../../routes";
import { LogoutOutlined, LockOutlined, MenuOutlined } from "@ant-design/icons";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import OrderNotification from "../Notification/OrderNotification";
import bell from "../../assets/bell.svg";

function getRoutesShipper(routesShipper) {
  return routesShipper.map((route) => {
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
  const [notifications, setNotifications] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const latestIdRef = useRef(null);
  const totalCountRef = useRef(0);
  const isLoadingMoreRef = useRef(false);
  const isShipper = user?.role === "shipper";

  const hasUnread = notifications.some((n) => n.unread);
  useEffect(() => {
    if (!isShipper) return;
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 10000);

    return () => clearInterval(timer);
  }, [isShipper]);

  const checkForNewNotifications = async () => {
    if (!isShipper) return;
    try {
      const res = await fetchWithAuth(
        "http://localhost:5000/api/shipper/notifications/check-status",
        { method: "GET" }
      );

      if (!res.ok) return;

      const data = await res.json();

      // Check có thông báo mới không (dựa vào total_count hoặc latest_id)
      const hasNewNotification =
        totalCountRef.current > 0 &&
        (data.total_count > totalCountRef.current ||
          (data.latest_id && data.latest_id !== latestIdRef.current));
      if (hasNewNotification) {
        // Có thông báo mới → Fetch full data
        await fetchAllNotifications(1, true);

        // Phát âm thanh + notification
        // playNotificationSound();
        showBrowserNotification();

        // Cập nhật refs
        totalCountRef.current = data.total_count;
        latestIdRef.current = data.latest_id;
      }
    } catch (err) {
      console.error("Check notification error:", err);
    }
  };
  const fetchAllNotifications = async (page = 1, reset = false) => {
    if (!isShipper || isLoadingMoreRef.current) return;

    isLoadingMoreRef.current = true;
    setLoading(true);

    try {
      const res = await fetchWithAuth(
        `http://localhost:5000/api/shipper/notifications/all-notifications?page=${page}`,
        { method: "GET" }
      );

      if (!res.ok) return;

      const data = await res.json();

      const formattedNotifications = data.notifications.map((n) => ({
        id: n.id,
        time: n.created_at,
        unread: !n.is_read,
        actionText: "Xem đơn hàng",
        orderId: n.order_id,
        address: n.address || "",
      }));

      if (reset || page === 1) {
        setNotifications(formattedNotifications);
        setCurrentPage(1);

        // Cập nhật totalCountRef khi fetch page 1
        totalCountRef.current = data.total_notifications;
      } else {
        // Load more - append
        setNotifications((prev) => [...prev, ...formattedNotifications]);
        setCurrentPage(page);
      }

      setHasMore(data.current_page < data.total_pages);

      if (formattedNotifications.length > 0 && page === 1) {
        latestIdRef.current = formattedNotifications[0].id;
      }
    } catch (err) {
      console.error("Fetch notifications error:", err);
    } finally {
      setLoading(false);
      isLoadingMoreRef.current = false;
    }
  };
  const showBrowserNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("Đơn hàng mới! 🚚", {
        body: "Bạn có đơn hàng mới cần xử lý",
        icon: bakesLogo,
      });
    }
  };

  const handleMarkRead = async (id) => {
    // Optimistic update

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );

    try {
      const res = await fetchWithAuth(
        `http://localhost:5000/api/shipper/notifications/mark-read/${id}`,
        { method: "POST" }
      );

      if (!res.ok) {
        // Rollback - fetch lại page 1
        console.log("Lỗi ");
      }
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };
  const handleScroll = (e) => {
    const container = e.target;
    const scrollBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    if (scrollBottom < 50 && hasMore && !loading) {
      fetchAllNotifications(currentPage + 1);
    }
  };

  useEffect(() => {
    if (!isShipper) return;
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Fetch lần đầu
    fetchAllNotifications(1);

    // Polling mỗi 5s
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        checkForNewNotifications();
      }
    }, 20000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkForNewNotifications();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isShipper]);

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
        label: <Link to="/logInResetPassword">Đổi mật khẩu</Link>,
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

  const dropdownContent = (
    <div
      style={{
        width: "380px",
        maxWidth: "100vw",
        backgroundColor: "white",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div className="notification-header">
        <Space
          style={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="w100"
        >
          <div>
            <h1
              level={5}
              style={{ color: "white", margin: 0, fontSize: "16px" }}
            >
              Thông báo
            </h1>
          </div>
        </Space>
      </div>

      <div
        onScroll={handleScroll}
        style={{
          maxHeight: "500px",
          overflowY: "auto",
        }}
      >
        {loading ? (
          // Loading lần đầu
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <Spin size="large" />
          </div>
        ) : notifications.length === 0 ? (
          // Không có thông báo
          <div
            style={{ padding: "40px 20px", textAlign: "center", color: "#999" }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔔</div>
            <p>Không có thông báo</p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <OrderNotification
                key={notification.id}
                notification={notification}
                now={now}
                onMarkRead={handleMarkRead}
              />
            ))}

            {/* Loading indicator */}
            {loading && (
              <div style={{ padding: "16px", textAlign: "center" }}>
                <Spin size="small" />
                <p
                  style={{ marginTop: "8px", fontSize: "12px", color: "#999" }}
                >
                  Đang tải thêm...
                </p>
              </div>
            )}

            {/* End message */}
            {!hasMore && notifications.length > 0 && (
              <div
                style={{
                  padding: "16px",
                  textAlign: "center",
                  color: "#999",
                  fontSize: "12px",
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                Đã hiển thị tất cả thông báo
              </div>
            )}
          </>
        )}
      </div>
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
                open={dropdownOpen}
                onOpenChange={setDropdownOpen}
                popupRender={() => dropdownContent}
                trigger={["click"]}
                placement="bottom"
              >
                <div
                  className="fl-center hover-grey"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    position: "relative",
                  }}
                >
                  {/* Dấu chấm đỏ thay vì Badge count */}
                  {hasUnread && (
                    <span
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#ef4444",
                        border: "2px solid white",
                      }}
                    />
                  )}
                  <div className="fl-center">
                    <img src={bell} alt="bell-image" width="25px" />
                  </div>
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
