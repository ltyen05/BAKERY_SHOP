import { Form, Button, Input, Checkbox } from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bakesLogo from "../assets/bakes.svg";
export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    // values từ Ant Design Form: { email, password, remember }
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        // Lưu token
        localStorage.setItem("access_token", data.access_token);

        // Gọi handleLogin từ App với thông tin user
        onLogin({
          id: data.data.id,
          name: data.data.name,
          email: data.data.email,
          avatar: data.data.avatar,
          role: data.data.role,
        });

        // Hiển thị thông báo thành công
        alert(data.message);

        // Navigate dựa vào role
        if (data.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        // Xử lý lỗi validation
        if (data.errors) {
          // Hiển thị lỗi từ backend
          const errorMessages = Object.values(data.errors).flat().join("\n");
          alert(errorMessages);
        } else {
          alert(data.message || "Đăng nhập thất bại");
        }
      }
    } catch (err) {
      alert("Lỗi kết nối server: " + err.message);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };
  // const handleSubmit = (values) => {
  //   if (values.username === "admin" && values.password === "1234567979") {
  //     onLogin({ username: "admin", role: "admin" });
  //     alert("Đăng nhập thành công!");
  //   } else if (values.username === "user" && values.password === "1234567979") {
  //     onLogin({ username: "user", role: "user" });
  //     alert("Đăng nhập thành công!");
  //   } else {
  //     alert("Tên đăng nhập hoặc mật khẩu không đúng!");
  //   }
  // };

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
            name="email"
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
