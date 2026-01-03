// ===============================================
// FILE: frontend-user/src/Login/Login.jsx
// ✅ Login chung cho User & Admin - phân luồng theo role
// ===============================================
import { Form, Button, Input, Checkbox, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import bakesLogo from "../assets/bakes.svg";
import api from "../api/axiosConfig"; // Import axios đã config

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      // 1️⃣ GỌI API ĐĂNG NHẬP
      const res = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        const { access_token, data: userData } = data;

        // 2️⃣ LƯU TOKEN
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("employee_id", userData.id); // Lưu ID để call API sau

        // 3️⃣ PHÂN LUỒNG THEO ROLE
        if (userData.role === "admin" || userData.role === "super_admin") {
          // ✅ LÀ ADMIN → GỌI API LẤY THÔNG TIN CHI TIẾT
          try {
            const adminInfoRes = await api.get(`/admin/me?e_id=${userData.id}`);
            
            if (adminInfoRes.data) {
              const adminInfo = adminInfoRes.data;

              // Lưu thông tin admin vào localStorage hoặc Context
              localStorage.setItem("admin_info", JSON.stringify({
                id: adminInfo.id,
                name: adminInfo.name,
                email: adminInfo.email,
                role: adminInfo.role_name === "Super Admin" ? "super_admin" : "admin",
                role_name: adminInfo.role_name,
                branch_id: adminInfo.branch_id,
                salary: adminInfo.salary,
                status: adminInfo.status
              }));

              message.success(`Chào mừng ${adminInfo.name}!`);

              // Chuyển sang trang admin
              window.location.href = "/admin/dashboard"; // Hoặc navigate nếu cùng router
            }
          } catch (err) {
            console.error("❌ Lỗi lấy thông tin admin:", err);
            message.error("Không thể tải thông tin tài khoản");
          }

        } else if (userData.role === "user") {
          // ✅ LÀ USER THƯỜNG → VÀO TRANG USER
          localStorage.setItem("user_info", JSON.stringify(userData));
          message.success(`Chào mừng ${userData.name}!`);
          navigate("/"); // Trang chủ user
        } else {
          // ❌ ROLE KHÔNG HỢP LỆ
          message.error("Tài khoản không có quyền truy cập");
          localStorage.clear();
        }

      } else {
        // ❌ ĐĂNG NHẬP THẤT BẠI
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join("\n");
          message.error(errorMessages);
        } else {
          message.error(data.message || "Đăng nhập thất bại");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      message.error("Lỗi kết nối server: " + err.message);
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
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <Link to="/forgotPassword">Quên mật khẩu?</Link>
          </div>

          <Form.Item style={{ width: "100%" }} className="m-0">
            <Button
              htmlType="submit"
              loading={loading}
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