import { Form, Button, Input, Checkbox } from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import bakesLogo from "../../../assets/bakes.svg";
export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (values) => {
    // values từ Ant Design Form: { email, password, remember }

    setLoading(true);

    try {
      const user = await login(values.email, values.password);

      // điều hướng theo role
      if (user.role === "employee") {
        window.location.href = `http://localhost:3001?token=${token}`;
      } else if (user.role == "shipper") {
        navigate("/shipperDashBoard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      alert(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bound">
      <div className="fl-center bg-color pb-6 pt-3">
        <Link to="/">
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
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập Email!" }]}
          >
            <Input placeholder="Email" className="newHeight" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            className="mb-3"
          >
            <Input.Password placeholder="Mật khẩu" className="newHeight" />
          </Form.Item>
          <div
            style={{
              flexDirection: "row",
            }}
            className="fl mb-2"
          >
            <Form.Item
              name="remember"
              valuePropName="checked"
              label={null}
              className="m-0"
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Link to="/forgotPassword">Forgot Password</Link>
          </div>
          <Form.Item className="m-0 w100">
            <Button htmlType="submit" className="mb-3 btn btn-primary w100">
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
