import { Link } from "react-router-dom";
import { Row, Col, Spin } from "antd";
import { Dropdown, Space, Button, Avatar, Badge, Drawer } from "antd";
import { useState, useEffect } from "react"; // ⚠️ phải có// ⚠️ phải có
import bakesLogo from "../../assets/bakes.svg";
import FeedbackComponent from "../../components/Feedback/Feedback";
import { routes } from "../../routes";
import {
  UserOutlined,
  LogoutOutlined,
  LockOutlined,
  DownOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import ReviewNotification from "../Notification/ReviewNotification";
import Cart from "../Cart/Cart";
import bell from "../../assets/bell.svg";
import cart from "../../assets/cart.svg";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import { useNotification } from "../../context/Notifications";
function getRoutesByPosition(routesByPosition) {
  return routesByPosition
    .map((route) => {
      const visibleChildren = route.children?.filter((child) => !child.tabOnly);

      if (visibleChildren && visibleChildren.length > 0) {
        const items = visibleChildren.map((child) => ({
          key: child.path,
          label: <Link to={`${route.path}/${child.path}`}>{child.name}</Link>,
        }));
        const defaultPath = route.path === "/menu" ? "/menu/bread" : route.path;
        return (
          <Dropdown
            key={route.path}
            placement="bottom"
            menu={{ items, className: "my-dropdown" }}
          >
            <span onClick={(e) => e.preventDefault()}>
              <Space>
                <Link
                  to={defaultPath}
                  className="text-main-color text-16"
                  style={{ fontWeight: "200" }}
                >
                  {route.name}
                </Link>
                <DownOutlined className="text-main-color" />
              </Space>
            </span>
          </Dropdown>
        );
      }

      if (route.children && route.children.length > 0) return null;
      if (route.isTabOnly) return null;
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
    })
    .filter(Boolean);
}

function NavBar({ user, onLogout, productInCart }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [now, setNow] = useState(Date.now());
  const {
    notifications,
    hasMore,
    currentPage,
    loading,
    setNotifications,
    fetchAllNotifications,
  } = useNotification();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const handleOpenFeedback = (notification) => {
    setSelectedNotification(notification);
    setShowFeedback(true);
  };
  const isCustomer = user?.role === "customer";
  const hasUnread = notifications.some((n) => n.unread);

  useEffect(() => {
    if (!isCustomer) return;
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 10000);

    return () => clearInterval(timer);
  }, [isCustomer]);
  const totalItems = productInCart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

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
      ...(user?.role === "shipper"
        ? [
            {
              key: "shipperPage",
              label: <Link to="/shipperDelivery">Shipper</Link>,
              icon: <UserOutlined />,
            },
          ]
        : []),
      ...(user?.role === "customer"
        ? [
            {
              key: "Tài khoản",
              label: <Link to="/viewProfile">Tài khoản</Link>,
              icon: <UserOutlined />,
            },
          ]
        : []),
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

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleScroll = (e) => {
    const container = e.target;
    const scrollBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    if (scrollBottom < 50 && hasMore && !loading) {
      fetchAllNotifications(currentPage + 1);
    }
  };

  const routes_middle = routes.filter((route) => route.position === "middle");
  const routes_right = routes.filter((route) => route.position === "right");

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkRead = async (id) => {
    // Optimistic update

    setNotifications((prev) =>
      prev.map((n) => (n.orderId === id ? { ...n, unread: false } : n))
    );

    try {
      const res = await fetchWithAuth(
        `http://localhost:5000/api/notification/mark-read/${id}`,
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
          <div
            style={{ padding: "40px 20px", textAlign: "center", color: "#999" }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔔</div>
            <p>Không có thông báo</p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <ReviewNotification
                key={notification.id}
                notification={notification}
                now={now}
                onMarkRead={handleMarkRead}
                handleOpenFeedback={handleOpenFeedback}
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
            <Link to="/">
              <img
                src={bakesLogo}
                alt="Stylized bakery logo"
                style={{ height: "55px" }}
              />
            </Link>
          </Row>
        </Col>

        <Col xs={0} md={10}>
          <Row>
            {getRoutesByPosition(routes_middle).map((comp, idx) => (
              <Col
                xs={0}
                md={24 / routes_middle.length}
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
          <Row justify="end" style={{ minHeight: "45px" }} align="middle">
            {user ? (
              <>
                <div
                  style={{
                    gap: "15px",
                    alignItems: "center",
                  }}
                  className="fl"
                >
                  {isCustomer && (
                    <>
                      <Dropdown
                        open={dropdownOpen}
                        onOpenChange={setDropdownOpen}
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
                            position: "relative",
                          }}
                        >
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
                      <button className="no-border" onClick={showDrawer}>
                        <div
                          className="fl-center hover-grey"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50px",
                          }}
                        >
                          <Badge count={totalItems} showZero color="#ab5506ff">
                            <div className="fl-center">
                              <img src={cart} alt="cart-image" width="30px" />
                            </div>
                          </Badge>
                        </div>
                      </button>
                      <Drawer
                        title="Giỏ hàng"
                        closable={{ "aria-label": "Close Button" }}
                        onClose={onClose}
                        open={open}
                        width={400}
                      >
                        <Cart
                          productList={productInCart}
                          onCloseDrawer={onClose}
                        />
                      </Drawer>
                    </>
                  )}
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
              </>
            ) : (
              getRoutesByPosition(routes_right).map((comp, idx) => (
                <Col xs={24} md={18 / routes_right.length} key={idx}>
                  {" "}
                  {comp}{" "}
                </Col>
              ))
            )}
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
          {getRoutesByPosition(routes_middle).map((comp, idx) => (
            <div key={idx} onClick={() => setOpenMenu(false)}>
              {comp}
            </div>
          ))}
        </div>
      </Drawer>
      {showFeedback && selectedNotification && (
        <div className="fl-center showUp">
          <div
            style={{
              width: "95%",
              maxWidth: "500px",
              backgroundColor: " #fdfbf5",
              maxHeight: "90%",
              borderRadius: "8px",
              flexDirection: "column",
              position: "relative",
            }}
            className="fl-center"
          >
            <div
              className="scrollbar w100"
              style={{
                maxHeight: "100%",
                maxWidth: "450px",
                overflowY: "auto",
                padding: "20px",
              }}
            >
              <button
                onClick={() => setShowFeedback(false)}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  fontSize: "15px",
                }}
                className="out-line"
              >
                <CloseOutlined />
              </button>

              <FeedbackComponent order_id={selectedNotification.orderId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
