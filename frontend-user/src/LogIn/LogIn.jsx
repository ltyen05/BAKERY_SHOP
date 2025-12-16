import { Form, Button, Input, Checkbox } from "antd";
import { Link } from "react-router-dom";
import bakesLogo from "../assets/bakes.svg";
export default function Login({ onLogin }) {
  const handleSubmit = (values) => {
    const { username, password } = values;
    // Giả sử chỉ cần nhập đúng "admin" và "123"
    if (username === "admin" && password === "123") {
      onLogin(username); // Gọi callback để App biết đã login
    } else {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div className="bound">
      <div className="fl-center bg-color pb-6 pt-3">
        <Link to={"/"}>
          <img
            src={bakesLogo}
            alt="Stylized bakery logo"
            style={{ height: "100px" }}
          />
        </Link>
        <Form
          name="basic"
          style={{
            maxWidth: "430px",
            width: "80%",
            display: "flex",
            flexDirection: "column",
          }}
          className="main-font pt-3"
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input placeholder="Tên đăng nhập" className="newHeight" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            className="mb-3"
          >
            <Input.Password placeholder="Mật khẩu" className="newHeight" />
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
            label={null}
            className="m-0 p-0 mb-2 als-start"
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item style={{ width: "100%" }} className="m-0">
            <Button
              htmlType="submit"
              style={{ width: "100%" }}
              className="mb-3 btn btn-primary"
            >
              Đăng nhập
            </Button>
          </Form.Item>
          <div className="als-start">
            <span> Chưa có tài khoản? </span>
            <Link to="/signUp" style={{ color: "#b96d2a" }}>
              Đăng ký
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
