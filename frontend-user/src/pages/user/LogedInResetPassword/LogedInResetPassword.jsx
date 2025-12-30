import { Form, Input, Button, message } from "antd";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();

  const handleResetPassword = async (values) => {
    try {
      const res = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        message.error(data.message || "Link không hợp lệ");
        return;
      }

      message.success(data.message);
      navigate("/login");
    } catch (err) {
      message.error("Không thể kết nối server");
    }
  };

  return (
    <div className="bound">
      <div className="fl-center bg-color pb-6 pt-3">
        <Form
          name="basic"
          style={{
            maxWidth: "430px",
            width: "80%",
            display: "flex",
            flexDirection: "column",
          }}
          className="main-font pt-3"
          layout="vertical"
          onFinish={handleResetPassword}
        >
          <Form.Item name="password" rules={[{ required: true, min: 6 }]}>
            <Input.Password
              placeholder="Nhập mật khẩu mới"
              className="newHeight"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Mật khẩu không khớp");
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Xác nhận mật khẩu mới"
              className="newHeight"
            />
          </Form.Item>
          <Button className="mb-3 btn btn-primary" htmlType="submit" block>
            Đổi mật khẩu
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
