import { useState } from "react";
import { Form, Button, Input, Checkbox, message } from "antd"; 
import { Link, useNavigate } from "react-router-dom"; 
import bakesLogo from "../assets/bakes.svg"; // Đảm bảo đường dẫn ảnh đúng

export default function Login({ onLogin }) { 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // KHẮC PHỤC 1: Sử dụng hook useMessage để thông báo hoạt động ổn định
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email, 
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Đăng nhập thành công
        messageApi.success("Đăng nhập thành công!");
        
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_info", JSON.stringify(data.data));

        if (onLogin) onLogin(data.data);

        // Chờ 1 chút để user đọc thông báo rồi mới chuyển trang (tuỳ chọn)
        setTimeout(() => {
            navigate("/");
        }, 500);
        
      } else {
        // KHẮC PHỤC 2: Xử lý hiển thị lỗi chi tiết
        // Backend có thể trả về 'message' (sai pass) hoặc 'errors' (lỗi form/token)
        let errorContent = "Đã có lỗi xảy ra!";
        
        if (data.message) {
            errorContent = data.message;
        } else if (data.errors) {
            // Nếu trả về errors dạng object {email: [...], password: [...]}, lấy lỗi đầu tiên
            const firstErrorKey = Object.keys(data.errors)[0];
            errorContent = data.errors[firstErrorKey];
            // Nếu lỗi là mảng thì lấy phần tử đầu, nếu là string thì giữ nguyên
            if (Array.isArray(errorContent)) errorContent = errorContent[0];
        }

        messageApi.error(errorContent);
      }

    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      messageApi.error("Không thể kết nối đến Server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bound">
      {/* Quan trọng: Đặt contextHolder ở đây để hiển thị thông báo */}
      {contextHolder}

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
