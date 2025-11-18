import React from "react";
import { Row, Col, Input, Button, Tag, Steps, Typography, Avatar } from "antd";
import {
  UserOutlined,
  EditOutlined,
  CarOutlined,
  FileDoneOutlined,
  InboxOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const UserProfile = () => {
  // Dữ liệu giả lập (Mock Data)
  const userInfo = {
    name: "Phan Diệu Lê",
    rank: "Rank Gold",
    email: "husbakery@hus.edu.vn",
    phone: "0123456789",
    totalSpent: "10,000,000",
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFBF7",
        minHeight: "100vh",
        padding: "25px 0 10px",
        width: "90%",
        maxWidth: "700px",
        margin: "auto",
      }}
    >
      {/* --- 1. Header nhỏ phía trên --- */}

      <Title level={2} style={{ color: "#4A4A6A", marginBottom: 30 }}>
        Chào mừng bạn !!
      </Title>

      {/* --- 2. Card Thông tin cá nhân --- */}
      <div className="custom-card" style={{ ...cardStyle, padding: "70px" }}>
        <Row
          align="middle"
          justify="space-between"
          style={{ marginBottom: 30 }}
        >
          <Col style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <Avatar
              size={64}
              src="https://i.pravatar.cc/150?img=5"
              icon={<UserOutlined />}
            />
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {userInfo.name}
              </Title>
              <Tag color="gold" style={{ marginTop: 5, borderRadius: 10 }}>
                {userInfo.rank}
              </Tag>
            </div>
          </Col>
          <Col>
            <Button
              icon={<EditOutlined />}
              style={{
                backgroundColor: "#F4B400",
                color: "#fff",
                border: "none",
                borderRadius: 20,
              }}
            >
              Edit
            </Button>
          </Col>
        </Row>

        {/* Form thông tin (Read-only) */}
        <div style={{ maxWidth: "600px", textAlign: "start" }}>
          <div style={{ marginBottom: 15 }}>
            <Text type="secondary">Email</Text>
            <Input readOnly value={userInfo.email} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 15 }}>
            <Text type="secondary">Số điện thoại</Text>
            <Input readOnly value={userInfo.phone} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 15 }}>
            <Text type="secondary">Tổng tiền mua hàng</Text>
            <Input
              readOnly
              value={userInfo.totalSpent}
              suffix="VNĐ"
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* --- 3. Card Trạng thái đơn hàng --- */}
      <div className="custom-card" style={{ ...cardStyle, marginTop: 70 }}>
        <Title level={5} style={{ marginBottom: 40 }}>
          Đơn hàng hiện tại của bạn
        </Title>

        {/* Lưu ý: Trong ảnh là Custom Icon (hình shipper). 
          Ở đây mình dùng Icon có sẵn của Antd và tô màu đỏ để mô phỏng.
        */}
        <Steps
          current={2} // Đang ở bước 3
          labelPlacement="vertical"
          items={[
            {
              title: "Shipper đang lấy hàng",
              icon: <InboxOutlined style={stepIconStyle} />,
            },
            {
              title: "Đã lấy hàng",
              icon: <FileDoneOutlined style={stepIconStyle} />,
            },
            {
              title: "Đang giao",
              icon: <CarOutlined style={{ ...stepIconStyle, fontSize: 35 }} />, // Icon to hơn chút cho giống đang chạy
            },
            {
              title: "Giao hàng thành công",
              icon: <CheckCircleOutlined style={stepIconStyle} />,
            },
          ]}
        />
      </div>

      {/* --- 4. Footer Buttons --- */}
      <Row
        justify="center"
        gutter={40}
        style={{ marginTop: 40, paddingBottom: 40 }}
      >
        <Col>
          <Button style={footerBtnStyle}>Xem chi tiết đơn hàng</Button>
        </Col>
        <Col>
          <Button style={footerBtnStyle}>Kho Voucher</Button>
        </Col>
        <Col>
          <Button style={footerBtnStyle}>Lịch sử mua hàng</Button>
        </Col>
      </Row>
    </div>
  );
};

// --- CSS Styles (Viết dạng object để code gọn trong 1 file) ---
const cardStyle = {
  backgroundColor: "#FDF5ed", // Màu kem nền giống trong ảnh
  borderRadius: 15,
  padding: "40px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const inputStyle = {
  backgroundColor: "#FFFFFF",
  borderRadius: 8,
  border: "none",
  padding: "8px 12px",
  marginTop: 5,
  color: "#555",
};

const stepIconStyle = {
  color: "#D93F3C", // Màu đỏ chủ đạo của shipper
  fontSize: 24,
  backgroundColor: "#fff",
  padding: 8,
  borderRadius: "50%",
  border: "1px solid #f0f0f0",
};

const footerBtnStyle = {
  backgroundColor: "#EAE2D7", // Màu nâu nhạt nút footer
  border: "none",
  borderRadius: 20,
  padding: "0 30px",
  height: "40px",
  fontWeight: 500,
  color: "#4A4A4A",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

// Ghi đè CSS của Steps để thanh ngang có màu đỏ/nâu giống ảnh
// Bạn nên đưa phần này vào file .css riêng
// const globalStyles = `
//   .ant-steps-item-finish .ant-steps-item-icon {
//     border-color: #D93F3C !important;
//   }
//   .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-tail::after {
//     background-color: #D93F3C !important;
//   }

export default UserProfile;
