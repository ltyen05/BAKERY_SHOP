import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import { Dropdown, Space, Button } from "antd"; // ⚠️ phải có
import { DownOutlined } from "@ant-design/icons"; // ⚠️ phải có
import bakesLogo from "../../assets/bakes.svg";
import { routes } from "../../routes";

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
          placement="bottomLeft"
          menu={{ items, style: { width: "150px", textAlign: "center" } }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Link key={route.path} to={route.path}>
                {route.name}
              </Link>
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      );
    } else {
      // Route không có children → chỉ là link thường
      return (
        <Link key={route.path} to={route.path}>
          {route.name}
        </Link>
      );
    }
  });
}

function NavBar({ username, onLogout }) {
  const routes_middle = routes.filter((route) => route.position === "middle");
  const routes_right = routes.filter((route) => route.position === "right");
  return (
    <Row style={{ border: "1px solid blue" }}>
      <Col span={6} style={{ margin: "auto" }}>
        <img
          src={bakesLogo}
          alt="Stylized bakery logo"
          style={{ height: "60px" }}
        />
      </Col>

      <Col span={12} style={{ border: "1px solid red", margin: "auto" }}>
        <Row justify="center">
          {getRoutesByPosition(routes_middle).map((comp, idx) => (
            <Col
              xs={24}
              md={24 / routes_middle.length}
              key={idx}
              style={{ border: "1px solid black", margin: "auto" }}
            >
              {comp}
            </Col>
          ))}
        </Row>
      </Col>
      <Col span={6} style={{ border: "1px solid black", margin: "auto" }}>
        <Row justify="end">
          {username ? (
            <Col span={24}>
              <div className="flex items-center gap-3 p-2 border rounded-lg">
                <img
                  src={
                    "https://i.pinimg.com/originals/24/bd/d9/24bdd9ec59a9f8966722063fe7791183.jpg"
                  }
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                  style={{ width: "50px", borderRadius: "50%" }}
                />
                <span className="font-medium">{username}</span>
                <Button
                  onClick={onLogout}
                  type="link"
                  danger
                  style={{ padding: 0 }}
                >
                  Đăng xuất
                </Button>
              </div>
            </Col>
          ) : (
            getRoutesByPosition(routes_right).map((comp, idx) => (
              <Col
                xs={24}
                md={24 / routes_right.length}
                key={idx}
                style={{ border: "1px solid black" }}
              >
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
