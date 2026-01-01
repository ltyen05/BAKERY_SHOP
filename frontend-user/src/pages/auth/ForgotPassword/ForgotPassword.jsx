import { Form, Button, Input } from "antd";
import { Link } from "react-router-dom";
import bakesLogo from "../../../assets/bakes.svg";
import React, { useState } from "react";
import { message } from "antd";

export default function ForgotPassword() {
  const handleSendEmail = async (values) => {
    try {
      const res = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        message.error(data.message || "Có lỗi xảy ra");
        return;
      }

      message.success(data.message);
    } catch (err) {
      message.error("Không thể kết nối server");
    }
  };

  return (
    <div className="bound">
      <div className="fl-center bg-color pb-6 pt-3">
        <Link to={"/"} className="mb-6">
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
          layout="vertical"
          onFinish={handleSendEmail}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
            className="mb-6"
          >
            <Input placeholder="Nhập email" className="newHeight" />
          </Form.Item>

          <Button className="mb-3 btn btn-primary" htmlType="submit" block>
            Gửi link đặt lại mật khẩu
          </Button>
        </Form>
      </div>
    </div>
  );
}
