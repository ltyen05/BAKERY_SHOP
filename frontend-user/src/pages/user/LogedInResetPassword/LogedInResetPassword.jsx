import { Form, Input, Button, message } from "antd";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAccount } from "../../../context/AccountContext";
const ResetPassword = () => {
  const navigate = useNavigate();
  const { change_password } = useAccount();
  const [loading, setLoading] = useState(false);
  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      const data = await change_password(
        values.old_password,
        values.new_password,
        values.confirm_password
      );
      if (data.success) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bound mt-24 mb-24">
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
          <Form.Item name="old_password" rules={[{ required: true, min: 6 }]}>
            <Input.Password
              placeholder="Nhập mật khẩu cũ"
              className="newHeight"
            />
          </Form.Item>
          <Form.Item name="new_password" rules={[{ required: true, min: 6 }]}>
            <Input.Password
              placeholder="Nhập mật khẩu mới"
              className="newHeight"
            />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            dependencies={["new_password"]}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
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
