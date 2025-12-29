import React, { useState } from "react";
import { Card, Avatar, Button, Steps, message, Empty } from "antd";
import {
  PhoneOutlined,
  MessageOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";

/* =========================
   STEP <-> STATUS MAP
========================= */
const STEP_STATUS_MAP = {
  0: "pending",
  1: "picked_up",
  2: "delivering",
  3: "completed",
};

const STATUS_STEP_MAP = {
  pending: 0,
  picked_up: 1,
  delivering: 2,
  completed: 3,
};

const OrderDetailPage = () => {
  /* =========================
     MOCK DATA (GIẢ LẬP BACKEND)
  ========================= */
  const initialOrder = {
    orderId: "231",
    branch: "Hoa Bakery Cơ sở 1",
    status: "delivering",
    customer: {
      name: "Phan Diệu Liễu",
      phone: "+84 912 345 678",
      address: "234 Nguyễn Trãi, Thanh Xuân, Hà Nội",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    distance: "3 km",
    totalAmount: "424.000 đ",
    deliveryTime: "25 phút",
  };

  /* =========================
     STATE
  ========================= */
  const [order, setOrder] = useState(initialOrder);
  const [orderStatus, setOrderStatus] = useState(initialOrder.status);
  const [currentStep, setCurrentStep] = useState(
    STATUS_STEP_MAP[initialOrder.status]
  );

  /* =========================
     STEPS
  ========================= */
  const steps = [
    { title: "Shipper đang lấy hàng" },
    { title: "Đã lấy hàng" },
    { title: "Đang giao" },
    { title: "Giao hàng thành công" },
  ];

  /* =========================
     UPDATE STATUS
  ========================= */
  const handleUpdateStatus = () => {
    if (currentStep >= steps.length - 1) return;

    const nextStep = currentStep + 1;
    const nextStatus = STEP_STATUS_MAP[nextStep];

    setCurrentStep(nextStep);
    setOrderStatus(nextStatus);

    message.success("Cập nhật trạng thái thành công");

    // Giả lập backend: completed => không còn đơn active
    if (nextStatus === "completed") {
      setTimeout(() => {
        setOrder(null); // ❗ mấu chốt: xoá đơn
      }, 500);
    }
  };

  /* =========================
     NO DATA
  ========================= */
  if (!order) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Empty description="Không có đơn hàng đang xử lý" />
      </div>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1
          style={{
            textAlign: "center",
            color: "#8b4513",
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 32,
          }}
        >
          Đơn hàng hiện tại
        </h1>

        {/* ORDER INFO */}
        <Card style={{ borderRadius: 16, marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <span style={{ color: "#ff6b35", fontWeight: 600 }}>
              {order.branch}
            </span>
            <span>Mã đơn: #{order.orderId}</span>
          </div>

          {/* CUSTOMER */}
          <div style={{ display: "flex", marginBottom: 24 }}>
            <Avatar size={64} src={order.customer.avatar} />
            <div style={{ marginLeft: 16 }}>
              <h3 style={{ marginBottom: 4 }}>{order.customer.name}</h3>
              <div>
                <PhoneOutlined /> {order.customer.phone}
              </div>
              <div>
                <EnvironmentOutlined /> {order.customer.address}
              </div>
            </div>
          </div>

          {/* DETAIL */}
          <div
            style={{
              background: "#fafafa",
              padding: 16,
              borderRadius: 8,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                <EnvironmentOutlined /> Khoảng cách
              </span>
              <b>{order.distance}</b>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                <DollarOutlined /> Tổng tiền
              </span>
              <b style={{ color: "#ff6b35" }}>{order.totalAmount}</b>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                <ClockCircleOutlined /> Thời gian dự kiến
              </span>
              <b>{order.deliveryTime}</b>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <Button icon={<EyeOutlined />} block>
              Chi tiết
            </Button>
            <Button icon={<MessageOutlined />} block>
              Nhắn tin
            </Button>
          </div>
        </Card>

        {/* STATUS */}
        <Card style={{ borderRadius: 16 }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 24,
            }}
          >
            Trạng thái đơn hàng
          </h2>

          <Steps current={currentStep}>
            {steps.map((s, i) => (
              <Steps.Step key={i} title={s.title} />
            ))}
          </Steps>

          <Button
            type="primary"
            block
            size="large"
            style={{ marginTop: 24 }}
            onClick={handleUpdateStatus}
          >
            Cập nhật trạng thái
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailPage;
