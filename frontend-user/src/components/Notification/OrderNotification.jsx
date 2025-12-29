import React from "react";
import { Badge, List, Avatar, Button, Space } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { timeAgo } from "../../utils/timeAgo";

import { useNavigate } from "react-router-dom";
import "./notification.css";
function OrderNotification({ notification, now, onMarkRead }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (notification.unread) {
      onMarkRead(notification.id); // ✅ đánh dấu đã đọc
    }

    navigate("/shipperDelivery"); // ✅ chuyển trang
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
          <Badge color="#1d4ed8" className="mb-1">
            <Avatar
              size={40}
              className="notification-avatar-order"
              icon={<span style={{ fontSize: "20px" }}>📦</span>}
            />
          </Badge>
        }
        title={
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <p strong style={{ fontSize: "14px" }}>
              Đơn hàng mới
            </p>
            {notification.unread && (
              <span
                className="unread-badge"
                style={{ backgroundColor: "#1d4ed8" }}
              />
            )}
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
              Bạn có đơn hàng mới (#id{notification.id})
            </p>
            <Space
              style={{
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p type="secondary" style={{ fontSize: "12px" }}>
                <ClockCircleOutlined /> {timeAgo(notification.time, now)}
              </p>
              <Button
                type="link"
                size="small"
                style={{ color: "#1d4ed8", padding: 0, height: "auto" }}
              >
                {notification.actionText}
              </Button>
            </Space>
          </div>
        }
      />
    </List.Item>
  );
}
export default OrderNotification;
