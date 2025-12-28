import React from "react";
import { Card, Avatar, Button, Steps } from "antd";
import {
  PhoneOutlined,
  MessageOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const OrderDetailPage = () => {
  const orderData = {
    orderId: "231",
    branch: "Hoa Bakery Cơ sở 1",
    customer: {
      name: "Phan Diệu Liễu",
      phone: "+23432432432",
      address: "234 Nguyễn Trãi, Thanh Xuân, Hà Nội",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    distance: "3 km",
    totalAmount: "424.000 đ",
    deliveryTime: "2.3 km",
  };

  const deliverySteps = [
    {
      title: "Shipper đang lấy hàng",
      icon: "🏪",
      status: "finish",
    },
    {
      title: "Đã lấy hàng",
      icon: "📦",
      status: "finish",
    },
    {
      title: "Đang giao",
      icon: "🏍️",
      status: "process",
    },
    {
      title: "Giao hàng thành công",
      icon: "✅",
      status: "wait",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {/* Header */}
        <h1
          style={{
            textAlign: "center",
            color: "#8b4513",
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "32px",
          }}
        >
          Đơn hàng hiện tại của bạn
        </h1>

        {/* Order Card */}
        <Card
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            marginBottom: "32px",
          }}
        >
          {/* Branch and Order ID */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <span
              style={{ color: "#ff6b35", fontSize: "14px", fontWeight: "600" }}
            >
              {orderData.branch}
            </span>
            <span
              style={{ fontSize: "14px", fontWeight: "600", color: "#262626" }}
            >
              Mã Đơn hàng: {orderData.orderId}
            </span>
          </div>

          {/* Customer Info */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: "24px",
            }}
          >
            <Avatar
              size={64}
              src={orderData.customer.avatar}
              style={{ marginRight: "16px" }}
            />
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                {orderData.customer.name}
              </h3>
              <div
                style={{
                  color: "#8c8c8c",
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                <PhoneOutlined style={{ marginRight: "8px" }} />
                {orderData.customer.phone}
              </div>
              <div style={{ color: "#8c8c8c", fontSize: "14px" }}>
                <EnvironmentOutlined style={{ marginRight: "8px" }} />
                {orderData.customer.address}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div
            style={{
              background: "#fafafa",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                <EnvironmentOutlined
                  style={{ marginRight: "8px", color: "#ff6b35" }}
                />
                Khoảng cách
              </span>
              <span style={{ fontWeight: "600", fontSize: "14px" }}>
                {orderData.distance}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                <DollarOutlined
                  style={{ marginRight: "8px", color: "#ff6b35" }}
                />
                Tổng tiền (Đã bao gồm phí)
              </span>
              <span
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  color: "#ff6b35",
                }}
              >
                {orderData.totalAmount}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                <ClockCircleOutlined
                  style={{ marginRight: "8px", color: "#ff6b35" }}
                />
                Khoảng cách
              </span>
              <span style={{ fontWeight: "600", fontSize: "14px" }}>
                {orderData.deliveryTime}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <Button
              icon={<EyeOutlined />}
              size="large"
              style={{
                flex: 1,
                borderRadius: "8px",
                border: "1px solid #ff6b35",
                color: "#ff6b35",
                fontWeight: "600",
              }}
            >
              Chi tiết
            </Button>
            <Button
              icon={<MessageOutlined />}
              size="large"
              style={{
                flex: 1,
                borderRadius: "8px",
                border: "1px solid #ff6b35",
                color: "#ff6b35",
                fontWeight: "600",
              }}
            >
              Nhắn tin cho
            </Button>
          </div>
        </Card>

        {/* Delivery Status */}
        <Card
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "32px",
              color: "#262626",
            }}
          >
            Cập nhật trạng thái đơn hàng
          </h2>

          {/* Custom Steps */}
          <div style={{ position: "relative", padding: "0 20px" }}>
            {/* Progress Line */}
            <div
              style={{
                position: "absolute",
                top: "24px",
                left: "20px",
                right: "20px",
                height: "3px",
                background: "#f0f0f0",
                zIndex: 0,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "50%",
                  background: "#ff6b35",
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            {/* Steps */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                position: "relative",
                zIndex: 1,
              }}
            >
              {deliverySteps.map((step, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  {/* Icon Circle */}
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: step.status === "wait" ? "#fff" : "#ff6b35",
                      border: `3px solid ${
                        step.status === "wait" ? "#f0f0f0" : "#ff6b35"
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      marginBottom: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    {step.icon}
                  </div>

                  {/* Step Title */}
                  <span
                    style={{
                      fontSize: "12px",
                      textAlign: "center",
                      color: step.status === "wait" ? "#8c8c8c" : "#262626",
                      fontWeight: step.status === "process" ? "600" : "400",
                      maxWidth: "100px",
                    }}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailPage;
