import React, { useState, useEffect } from "react";
import {
  Card,
  Avatar,
  Button,
  Steps,
  message,
  Empty,
  Popconfirm,
  Col,
  Row,
} from "antd";
import {
  PhoneOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  CarOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useOrder } from "../../context/OrderContext";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import OrderDetails from "../../components/Order/OrderDetails";
/* =========================
   STEP <-> STATUS MAP
========================= */
const STEP_ITEMS = [
  {
    title: "Đang xử lý",
    icon: <InboxOutlined />,
  },
  {
    title: "Đang giao",
    icon: <CarOutlined />,
  },
  {
    title: "Đã giao",
    icon: <CheckCircleOutlined />,
  },
];

const STEP_STATUS_MAP = {
  0: "Đang xử lý",
  1: "Đang giao",
  2: "Đã giao",
};

const STATUS_STEP_MAP = {
  "Đang xử lý": 0,
  "Đang giao": 1,
  "Đã giao": 2,
};

const OrderDetailPage = () => {
  /* =========================
     MOCK DATA (GIẢ LẬP BACKEND)
  ========================= */
  const [messageApi, contextHolder] = message.useMessage();
  const { orderDetails } = useOrder();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchCurrentOrder = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(
        "http://localhost:5000/api/shipper/notifications/current-order",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (response.status === 204) {
        setCurrentOrder(null);
        setCurrentStep(0);
        setCurrentStatus(null);
        return;
      }
      const data = await response.json();
      setCurrentStatus(data.status);
      const order = await orderDetails(data.order_id);
      setCurrentOrder(order);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      messageApi.error("Không thể tải đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentOrder();
  }, []);

  /* =========================
     STEPS
  ========================= */
  const steps = [
    { title: "Đang xử lý" },
    { title: "Đang giao" },
    { title: "Đã giao" },
  ];

  /* =========================
     UPDATE STATUS
  ========================= */
  const handleUpdateStatus = async () => {
    if (currentStep >= steps.length - 1) {
      message.info("Đơn hàng đã ở trạng thái cuối cùng");
      return;
    }

    const nextStep = currentStep + 1;
    const nextStatus = STEP_STATUS_MAP[nextStep];

    try {
      const response = await fetchWithAuth(
        "http://localhost:5000/api/shipper/notifications/update_order_status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: currentOrder.order_id,
            status: nextStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Cập nhật thất bại");
      }

      messageApi.success("Cập nhật trạng thái thành công");

      if (nextStep >= steps.length - 1) {
        // Nếu đã đến trạng thái cuối, xoá đơn
        setCurrentOrder(null);
        setCurrentStep(0);
        setCurrentStatus(null);
      } else {
        // Cập nhật trạng thái bình thường
        setCurrentStep(nextStep);
        setCurrentStatus({ status: nextStatus });
      }
    } catch (error) {
      // console.error("Lỗi khi cập nhật trạng thái:", error);
      messageApi.error("Cập nhật trạng thái thất bại");
    }
  };
  useEffect(() => {
    if (currentStatus?.status) {
      setCurrentStep(STATUS_STEP_MAP[currentStatus.status]);
    }
  }, [currentStatus]);
  /* =========================
     NO DATA
  ========================= */
  if (!currentOrder) {
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
              {currentOrder.branch_name}
            </span>
            <span>Mã đơn: #{currentOrder.order_id}</span>
          </div>

          {/* CUSTOMER */}
          <div
            style={{ display: "flex", marginBottom: 24, textAlign: "start" }}
          >
            <Avatar
              size={64}
              src="https://i.pinimg.com/originals/24/bd/d9/24bdd9ec59a9f8966722063fe7791183.jpg"
            />
            <div style={{ marginLeft: 16 }}>
              <h3 style={{ marginBottom: 4 }}>{currentOrder.recipient_name}</h3>
              <div>
                <PhoneOutlined /> {currentOrder.phone}
              </div>
              <div>
                <EnvironmentOutlined /> {currentOrder.address}
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
                <DollarOutlined /> Tổng tiền
              </span>
              <b style={{ color: "#ff6b35" }}>{currentOrder.total_money}</b>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <Button
              size="large"
              icon={<EyeOutlined />}
              block
              onClick={() => setShowDetail(true)}
              className="btn-primary"
            >
              Chi tiết
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

          <Steps
            current={currentStep}
            labelPlacement="vertical"
            items={STEP_ITEMS.map((item, index) => ({
              ...item,
              icon: React.cloneElement(item.icon, {
                style: {
                  borderRadius: "50%",
                  fontSize: 24, // giữ icon step 2 lớn hơn
                  border:
                    index === currentStep
                      ? "2px solid #fdfbf5"
                      : "2px solid #D93F3C",
                  padding: 8,
                  color: index === currentStep ? "#fdfbf5" : "#D93F3C",
                  backgroundColor:
                    index === currentStep ? "#D93F3C" : "#fdfbf5",
                },
              }),
            }))}
            style={{ marginTop: 16 }}
          />

          <Row
            // style={{
            //   gap: 12,
            // }}
            className="mt-6"
            justify="space-around"
          >
            {/* Nút cập nhật trạng thái */}
            <Col xs={22} md={10} className="mb-3">
              <Button
                block
                size="large"
                onClick={handleUpdateStatus}
                className="btn-primary"
              >
                Cập nhật trạng thái
              </Button>
            </Col>

            {/* Nút giao không thành công */}
            <Col xs={22} md={10}>
              <Popconfirm
                title="Xác nhận giao không thành công?"
                onConfirm={async () => {
                  if (!currentOrder) return;

                  try {
                    const response = await fetchWithAuth(
                      "http://localhost:5000/api/shipper/notifications/update_order_status",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          order_id: currentOrder.order_id,
                          status: "Không thành công", // trạng thái thất bại
                        }),
                      }
                    );

                    const data = await response.json();
                    if (!response.ok || !data.success) {
                      throw new Error(data.message || "Cập nhật thất bại");
                    }

                    // Xoá đơn khỏi UI vì đã thất bại
                    setCurrentOrder(null);
                    setCurrentStep(0);
                    setCurrentStatus(null);

                    messageApi.success("Cập nhật trạng thái: Không thành công");
                  } catch (error) {
                    console.error(error);
                    messageApi.error("Cập nhật trạng thái thất bại");
                  }
                }}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                <Button size="large" danger block>
                  Giao không thành công
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </Card>
      </div>
      {showDetail && (
        <div className="fl-center showUp">
          <div
            style={{
              width: "95%",
              maxWidth: "550px",
              backgroundColor: "#fdfbf5",
              height: "90%",
              borderRadius: "8px",
              flexDirection: "column",
              position: "relative",
            }}
            className="fl-center"
          >
            <OrderDetails order={currentOrder} />
            <button
              onClick={() => setShowDetail(false)}
              style={{ position: "absolute", top: 15, right: 15, fontSize: 15 }}
              className="out-line"
            >
              <CloseOutlined />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
