import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import { Dropdown, Space, Button, Avatar, Badge, Drawer } from "antd";
import { useState } from "react"; // ⚠️ phải có// ⚠️ phải có
import bakesLogo from "../../assets/bakes.svg";
import { routes } from "../../routes";
import {
  UserOutlined,
  LogoutOutlined,
  LockOutlined,
  DownOutlined,
} from "@ant-design/icons";
import bell from "../../assets/bell.svg";
import cart from "../../assets/cart.svg";
function getRoutesByPosition(routesByPosition) {
  return routesByPosition.map((route) => {
    if (route.children && route.children.length > 0) {
      // Tạo danh sách item con cho Dropdown
      const items = route.children.map((child) => ({
        key: child.path,
        label: <Link to={`${route.path}/${child.path}`}>{child.name}</Link>,
      }));

      return (
        <Dropdown
          key={route.path}
          placement="bottom"
          menu={{ items, className: "my-dropdown" }}
        >
          <span onClick={(e) => e.preventDefault()}>
            <Space>
              <Link
                key={route.path}
                to={route.path}
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
    } else {
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
    }
  });
}

function NavBar({ user, onLogout }) {
  const view = {
    items: [
      {
        key: "username",
        label: user?.name, // ✅ phải là JSX hoặc string
        disabled: true,
      },
      {
        type: "divider",
      },
      {
        key: "Tài khoản",
        label: <Link to="/viewProfile">Tài khoản</Link>,
        icon: <UserOutlined />,
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
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const routes_middle = routes.filter((route) => route.position === "middle");
  const routes_right = routes.filter((route) => route.position === "right");
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
          <Row justify="end" style={{ minHeight: "55px" }} align="middle">
            {user ? (
              <>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "center",
                  }}
                >
                  <Badge count={1} showZero color="#ab5506ff">
                    <div className="fl-center">
                      <img src={bell} alt="bell-image" width="25px" color="" />
                    </div>
                  </Badge>

                  <button className="no-border" onClick={showDrawer}>
                    <div className="fl-center">
                      <img src={cart} alt="cart-image" width="30px" />
                    </div>
                  </button>
                  <Drawer
                    title="Giỏ hàng"
                    closable={{ "aria-label": "Close Button" }}
                    onClose={onClose}
                    open={open}
                  >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                  </Drawer>
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
    </div>
  );
}

export default NavBar;
