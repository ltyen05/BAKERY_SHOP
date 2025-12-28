import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Typography, Tooltip } from "antd";
import {
  ShoppingCartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const MAX_VALUE = 100;

export default function Dashboard() {
  const [weeklyOrders, setWeeklyOrders] = useState([]);

  useEffect(() => {
    // fake API
    setWeeklyOrders([
      { day: "Thứ 2", value: 60 },
      { day: "Thứ 3", value: 80 },
      { day: "Thứ 4", value: 40 },
      { day: "Thứ 5", value: 70 },
      { day: "Thứ 6", value: 60 },
      { day: "Thứ 7", value: 25 },
      { day: "CN", value: 60 },
    ]);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      {/* SUMMARY CARDS */}
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn hàng"
              value={175}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Giao thành công"
              value={100}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Không thành công"
              value={75}
              valueStyle={{ color: "#ff4d4f" }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đánh giá trung bình"
              value={4.8}
              suffix="/5"
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* WEEKLY BAR */}
      <Card style={{ marginTop: 24 }}>
        <Title level={5} style={{ textAlign: "center" }}>
          Số đơn hàng đã giao trong tuần
        </Title>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            height: 260,
            marginTop: 20,
          }}
        >
          {weeklyOrders.map((item) => {
            const height = (item.value / MAX_VALUE) * 180;

            return (
              <div key={item.day} style={{ flex: 1, textAlign: "center" }}>
                <Tooltip title={`${item.value} đơn`}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>
                    {item.value}
                  </div>

                  <div
                    style={{
                      height,
                      width: "60%", // 👈 theo cột
                      maxWidth: 40, // 👈 chặn to quá
                      minWidth: 20,
                      margin: "0 auto",
                      borderRadius: 6,
                      background: item.value < 40 ? "#ffd591" : "#ff7a45",
                      transition: "height 0.3s ease",
                    }}
                  />
                </Tooltip>

                <div style={{ marginTop: 8, color: "#888" }}>{item.day}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
