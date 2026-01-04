import { useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd"; // Thêm message
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import { useAuth } from "../../../context/AuthContext";
import bakesLogo from "../../../assets/bakes.svg";

const SignUp = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false); // State để hiển thị loading

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const data = await signup({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        confirm: values.confirm,
      });

      // ✅ Đăng ký thành công
      if (data.status === "success") {
        messageApi.success(data.message);
        form.resetFields();

        setTimeout(() => {
          navigate("/login");
        }, 1000);

        return;
      }

      // ❌ Lỗi validate (email trùng, password không khớp, ...)
      if (data.status === "fail") {
        if (data.errors) {
          // Map lỗi backend → AntD Form
          const fieldErrors = Object.entries(data.errors).map(
            ([field, errors]) => ({
              name: field,
              errors: errors,
            })
          );

          form.setFields(fieldErrors);
          messageApi.error("Vui lòng kiểm tra lại thông tin");
        } else if (data.message) {
          messageApi.error(data.message);
        }

        return;
      }

      // ❌ Lỗi server
      if (data.status === "error") {
        messageApi.error(data.message || "Có lỗi xảy ra từ server");
        return;
      }
    } catch (err) {
      messageApi.error("Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {contextHolder}
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
              <Link
                to="/login"
                style={{ color: "#b96d2a", fontWeight: "bold" }}
              >
                Đăng nhập ngay
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};
export default SignUp;
