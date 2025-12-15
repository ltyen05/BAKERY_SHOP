import React from "react";
import { Badge, List, Avatar, Button, Space } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import "./notification.css";
function PromoNotification({ notification, onMarkRead, onDelete }) {
  return (
    <List.Item
      className={`notification-item ${notification.unread ? "unread" : ""}`}
      onClick={() => onMarkRead(notification.id)}
      style={{
        padding: "12px 20px",
        border: "none",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Button
        type="text"
        size="small"
        className="delete-btn"
        icon={<span>✕</span>}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification.id);
        }}
      />
      <List.Item.Meta
        avatar={
          <Badge color="#be185d" className="mb-1">
            <Avatar
              size={40}
              className="notification-avatar-promo"
              icon={<span style={{ fontSize: "20px" }}>❤️</span>}
            />
          </Badge>
        }
        title={
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <p strong style={{ fontSize: "14px" }}>
              {notification.title}
            </p>
            {notification.unread && (
              <span
                className="unread-badge"
                style={{ backgroundColor: "#be185d" }}
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
              {notification.message}
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
                style={{ color: "#be185d", padding: 0, height: "auto" }}
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
export default PromoNotification;
