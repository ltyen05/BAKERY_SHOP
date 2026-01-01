import React from "react";
import { Badge, List, Avatar, Button, Space } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { timeAgo } from "../../utils/timeAgo";
import { useNavigate } from "react-router-dom";
import "./notification.css";
function ReviewNotification({ notification, onMarkRead, handleOpenFeedback }) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (notification.unread) {
      onMarkRead(notification.orderId); // ✅ đánh dấu đã đọc
    }
  };
  return (
    <List.Item
      className={`notification-item ${notification.unread ? "unread" : ""}`}
      onClick={handleClick}
      style={{
        padding: "12px 20px",
        border: "none",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <List.Item.Meta
        avatar={
          <Badge color="#92400e" className="mb-1">
            <Avatar
              size={40}
              className="notification-avatar-review"
              icon={<span style={{ fontSize: "20px" }}>⭐</span>}
            />
          </Badge>
        }
        title={
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <p style={{ fontSize: "14px" }}>Đánh giá sản phẩm</p>
            {notification.unread && <span className="unread-badge" />}
          </Space>
        }
        description={
          <div>
            <p
              style={{
                fontSize: "13px",
                color: "#666",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Cảm ơn bạn vì đã mua sản phẩm của chúng tôi. Chúng tôi rất mong
              nhận được đánh giá cho đơn hàng id#{notification.orderId} từ bạn
            </p>
            <Space
              style={{
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p type="secondary" style={{ fontSize: "12px" }}>
                <ClockCircleOutlined /> {notification.time}
              </p>
              <Button
                type="link"
                size="small"
                style={{ color: "#92400e", padding: 0, height: "auto" }}
                onClick={() => handleOpenFeedback(notification)}
              >
                Đánh giá ngay
              </Button>
            </Space>
          </div>
        }
      />
    </List.Item>
  );
}

export default ReviewNotification;
