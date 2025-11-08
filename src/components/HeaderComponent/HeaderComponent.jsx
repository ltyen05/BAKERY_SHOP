import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import { Dropdown, Space, Button } from "antd"; // ⚠️ phải có
import { DownOutlined } from "@ant-design/icons"; // ⚠️ phải có
import bakesLogo from "../../assets/bakes.svg";
import { routes } from "../../routes";
import { UserOutlined, LogoutOutlined, LockOutlined } from "@ant-design/icons";
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
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Link
                key={route.path}
                to={route.path}
                className="text-main-color text-16"
              >
                {route.name}
              </Link>
              <DownOutlined className="text-main-color" />
            </Space>
          </a>
        </Dropdown>
      );
    } else {
      // Route không có children → chỉ là link thường
      return (
        <Link
          key={route.path}
          to={route.path}
          className="text-main-color text-16"
        >
          {route.name}
        </Link>
      );
    }
  });
}

function NavBar({ username, onLogout }) {
  const view = {
    items: [
      {
        key: "username",
        label: <span>{username}</span>, // ✅ phải là JSX hoặc string
        disabled: true,
      },
      {
        type: "divider",
      },
      {
        key: "Tài khoản",
        label: <Link to="../viewProfile/viewProfile">Tài khoản</Link>,
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
  const routes_middle = routes.filter((route) => route.position === "middle");
  const routes_right = routes.filter((route) => route.position === "right");
  return (
    <Row
      className="nav-bar"
      style={{
        height: "77px",
        fontSize: "16px",
      }}
      justify="space-around"
      align={{
        xs: "middle",
        md: "bottom",
      }}
    >
      <Col span={4} style={{}}>
        <img
          src={bakesLogo}
          alt="Stylized bakery logo"
          style={{ height: "55px" }}
        />
      </Col>

      <Col span={10} style={{ minHeight: "40px" }}>
        <Row justify="center">
          {getRoutesByPosition(routes_middle).map((comp, idx) => (
            <Col
              xs={0}
              md={24 / routes_middle.length}
              key={idx}
              style={{
                margin: "auto",
              }}
            >
              {comp}
            </Col>
          ))}
        </Row>
      </Col>
      <Col span={4} style={{ minHeight: "40px" }}>
        <Row justify="center">
          {username ? (
            <Col span={24}>
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
                  style={{ width: "40px", borderRadius: "50%" }}
                />
              </Dropdown>
            </Col>
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
  );
}

export default NavBar;
