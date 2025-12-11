import { useState } from "react";
import { Form, Button, Input, Checkbox, message } from "antd"; // Nhớ import message
import { Link, useNavigate } from "react-router-dom"; // Nhớ import useNavigate
import bakesLogo from "../assets/bakes.svg";

export default function Login({ onLogin }) { // Thêm prop onLogin nếu bạn dùng nó để update state App
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook để chuyển trang

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Gọi API Login thực tế
      const response = await fetch("http://127.0.0.1:5001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email, // Backend cần 'email', không phải 'username'
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success("Đăng nhập thành công!");
        
        // Lưu token vào localStorage để dùng cho các request sau
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_info", JSON.stringify(data.data));

        // Cập nhật trạng thái đăng nhập (nếu app của bạn cần)
        if (onLogin) onLogin(data.data);

        // Chuyển hướng về trang chủ
        navigate("/");
      } else {
        // Backend trả về lỗi (401, 400...)
        message.error(data.message || "Sai email hoặc mật khẩu!");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      message.error("Lỗi kết nối đến Server!");
    } finally {
      setLoading(false);
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
          {/* Sửa name="username" thành "email" cho khớp backend */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập Email!" },
              { type: "email", message: "Email không hợp lệ!" }
            ]}
          >
            <Input placeholder="Email đăng nhập" className="newHeight" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            className="mb-3"
          >
            <Input.Password placeholder="Mật khẩu" className="newHeight" />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            className="m-0 p-0 mb-2 als-start"
          >
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>

          <Form.Item style={{ width: "100%" }} className="m-0">
            <Button
              htmlType="submit"
              style={{ width: "100%" }}
              className="mb-3 btn btn-primary"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
          
          <div className="als-start">
            <span> Chưa có tài khoản? </span>
            <Link to="/signUp" style={{ color: "#b96d2a", fontWeight: "bold" }}>
              Đăng ký ngay
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}