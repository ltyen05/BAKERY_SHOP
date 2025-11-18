import { useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd"; // Thêm message
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import bakesLogo from "../assets/bakes.svg";

const checkEmailExists = async (email) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email }),
    });

    if (!response.ok) {
      // Nếu server lỗi 500, vẫn cho qua để validator không chặn người dùng (hoặc xử lý tuỳ bạn)
      return { isDuplicate: false, error: null };
    }

    const data = await response.json();
    return { isDuplicate: data.exists, error: null };
  } catch (error) {
    console.error("Lỗi kiểm tra email:", error);
    return { isDuplicate: false, error: "Lỗi kết nối Server" };
  }
};

const SignUp = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // State để hiển thị loading

  // 2. Hàm xử lý khi bấm nút Đăng Ký
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          phone: values.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/logIn");
      } else {
        message.error(data.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      message.error("Không thể kết nối đến Server!");
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
          form={form}
          name="register"
          onFinish={onFinish}
          style={{
            maxWidth: "450px",
            width: "75%",
            display: "flex",
            flexDirection: "column",
          }}
          scrollToFirstError
          layout="vertical"
          className="custom-form"
        >
          <Form.Item
            name="name"
            label="Họ Tên"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập họ tên!",
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
            hasFeedback
            validateFirst
            validateTrigger="onBlur"
            rules={[
              { type: "email", message: "Email không hợp lệ!" },
              { required: true, message: "Vui lòng nhập E-mail!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();

                  return checkEmailExists(value).then((result) => {
                    if (result.error) {
                      return Promise.reject(new Error(result.error));
                    }

                    if (result.isDuplicate) {
                      return Promise.reject(
                        new Error("Email này đã được sử dụng!")
                      );
                    }

                    // 3. Nếu không lỗi mạng và không trùng => Hợp lệ
                    return Promise.resolve();
                  });
                },
              }),
            ]}
          >
            <Input placeholder="example@email.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Xác nhận mật khẩu"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng xác nhận lại mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Bạn phải đồng ý với điều khoản")
                      ),
              },
            ]}
          >
            <Checkbox>
              Tôi đã đọc và đồng ý <a href="">điều khoản</a>
            </Checkbox>
          </Form.Item>

          <Form.Item style={{ marginBottom: "0px" }}>
            <Button
              htmlType="submit"
              style={{ width: "100%" }}
              className="mb-3 btn btn-primary"
              loading={loading} // Hiệu ứng xoay khi đang gửi dữ liệu
            >
              Đăng ký
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <span> Đã có tài khoản? </span>
            <Link to="/login" style={{ color: "#b96d2a", fontWeight: "bold" }}>
              Đăng nhập ngay
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default SignUp;
