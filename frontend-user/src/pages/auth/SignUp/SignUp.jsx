import { useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd"; // Thêm message
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import { useAuth } from "../../../context/AuthContext";
import bakesLogo from "../../../assets/bakes.svg";

const SignUp = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false); // State để hiển thị loading
  // const checkEmailExists = async (email) => {
  //   try {
  //     const response = await fetch("http://localhost:5000/signup/check-email", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email: email }),
  //     });

  //     if (!response.ok) {
  //       // Nếu server lỗi 500, vẫn cho qua để validator không chặn người dùng (hoặc xử lý tuỳ bạn)
  //       return { isDuplicate: false, error: null };
  //     }

  //     const data = await response.json();
  //     return { isDuplicate: data.exists, error: null };
  //   } catch (error) {
  //     console.error("Lỗi kiểm tra email:", error);
  //     return { isDuplicate: false, error: "Lỗi kết nối Server" };
  //   }
  // };

  // 2. Hàm xử lý khi bấm nút Đăng Ký

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Dùng hàm từ Context
      const data = await signup({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        confirm: values.confirm,
      });

      if (data.status === "success") {
        // Hiển thị thông báo thành công
        message.success(data.message);
        alert(data.message);
        form.resetFields();

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (data.status === "fail") {
        // Xử lý lỗi validation từ backend
        if (data.errors) {
          alert("Có lỗi xảy ra");
          // Hiển thị tất cả lỗi validation
          Object.entries(data.errors).forEach(([field, errors]) => {
            errors.forEach((error) => {
              message.error(`${field}: ${error}`);
            });
          });

          // Hoặc set lỗi trực tiếp vào form fields
          const formErrors = Object.entries(data.errors).map(
            ([field, errors]) => ({
              name: field,
              errors: errors,
            })
          );
          form.setFields(formErrors);
        }
      } else if (data.status === "error") {
        // Lỗi server
        message.error(data.message || "Có lỗi xảy ra từ server");
        alert(data.message);
      }
    } catch (err) {
      message.error("Lỗi kết nối server: " + err.message);
      alert(err);
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
              // ({ getFieldValue }) => ({
              //   validator(_, value) {
              //     if (!value) return Promise.resolve();

              //     return checkEmailExists(value).then((result) => {
              //       if (result.error) {
              //         return Promise.reject(new Error(result.error));
              //       }

              //       if (result.isDuplicate) {
              //         return Promise.reject(
              //           new Error("Email này đã được sử dụng!")
              //         );
              //       }

              //       // 3. Nếu không lỗi mạng và không trùng => Hợp lệ
              //       return Promise.resolve();
              //     });
              // },
              // }),
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
              className="mb-3 btn btn-primary w100"
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
