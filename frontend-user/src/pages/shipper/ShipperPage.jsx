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
  Spin,
} from "antd";
import {
  PhoneOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  EyeOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  CarOutlined,
  InboxOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { useOrder } from "../../context/OrderContext";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import OrderDetails from "../../components/Order/OrderDetails";

/* =========================
   STEP <-> STATUS MAP
========================= */
const STEP_ITEMS = [
  { title: "Đang xử lý", icon: <InboxOutlined /> },
  { title: "Đang giao", icon: <CarOutlined /> },
  { title: "Đã giao", icon: <CheckCircleOutlined /> },
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
  const [messageApi, contextHolder] = message.useMessage();
  const { orderDetails } = useOrder();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy đơn hàng hiện tại của shipper
  const fetchCurrentOrder = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/shipper/notifications/current-order`,
        { method: "GET" }
      );

      if (response.status === 204) {
        setCurrentOrder(null);
        return;
      }

      if (!response.ok) {
        throw new Error(`Lỗi hệ thống: ${response.status}`);
      }

      const data = await response.json();
      setCurrentStatus({ status: data.status });
      const order = await orderDetails(data.order_id);
      setCurrentOrder(order);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
      messageApi.error("Không thể tải thông tin đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentOrder();
  }, []);

  // Đồng bộ Step khi Status thay đổi
  useEffect(() => {
    if (currentStatus?.status && STATUS_STEP_MAP[currentStatus.status] !== undefined) {
      setCurrentStep(STATUS_STEP_MAP[currentStatus.status]);
    }
  }, [currentStatus]);

  /* =========================
     CẬP NHẬT TRẠNG THÁI
  ========================= */
  const handleUpdateStatus = async () => {
    if (currentStep >= STEP_ITEMS.length - 1) {
      messageApi.info("Đơn hàng đã hoàn thành!");
      return;
    }

    const nextStep = currentStep + 1;
    const nextStatus = STEP_STATUS_MAP[nextStep];

    try {
      const response = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/shipper/notifications/update_order_status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

      messageApi.success(`Chuyển trạng thái sang: ${nextStatus}`);

      if (nextStep >= STEP_ITEMS.length - 1) {
        // Hoàn thành đơn hàng thì xóa khỏi màn hình shipper
        setCurrentOrder(null);
      } else {
        setCurrentStatus({ status: nextStatus });
      }
    } catch (error) {
      messageApi.error(error.message || "Không thể cập nhật trạng thái");
    }
  };

  const handleDeliveryFailed = async () => {
    try {
      const response = await fetchWithAuth(
        `${import.meta.env.VITE_API_URL}/shipper/notifications/update_order_status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: currentOrder.order_id,
            status: "Không thành công",
          }),
        }
      );

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error("Thất bại");

      setCurrentOrder(null);
      messageApi.warning("Đã xác nhận: Giao hàng không thành công");
    } catch (error) {
      messageApi.error("Lỗi cập nhật trạng thái thất bại");
    }
  };

  if (loading) return <div className="fl-center" style={{ minHeight: "100vh" }}><Spin size="large" /></div>;

  if (!currentOrder) {
    return (
      <div className="fl-center" style={{ minHeight: "100vh" }}>
        <Empty description="Bạn không có đơn hàng nào đang xử lý" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px" }}>
      {contextHolder}
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", color: "#8b4513", fontSize: 28, fontWeight: 700, marginBottom: 32 }}>
          Đơn hàng hiện tại
        </h1>

        <Card style={{ borderRadius: 16, marginBottom: 32 }} className="shadow-sm">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <span style={{ color: "#ff6b35", fontWeight: 600 }}>{currentOrder.branch_name}</span>
            <span>Mã đơn: #{currentOrder.order_id}</span>
          </div>

          <div style={{ display: "flex", marginBottom: 24, textAlign: "start" }}>
            <Avatar size={64} src="https://i.pinimg.com/originals/24/bd/d9/24bdd9ec59a9f8966722063fe7791183.jpg" />
            <div style={{ marginLeft: 16 }}>
              <h3 style={{ marginBottom: 4 }}>{currentOrder.recipient_name}</h3>
              <div><PhoneOutlined /> {currentOrder.phone}</div>
              <div style={{ fontSize: "13px", color: "#666" }}><EnvironmentOutlined /> {currentOrder.address}</div>
            </div>
          </div>

          <div style={{ background: "#fafafa", padding: 16, borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span><DollarOutlined /> Tổng tiền</span>
              <b style={{ color: "#ff6b35" }}>{currentOrder.total_money?.toLocaleString()}đ</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span><FormOutlined /> Ghi chú</span>
              <span style={{ color: "#666" }}>{currentOrder.note || "Không có"}</span>
            </div>
          </div>

          <Button 
            size="large" 
            icon={<EyeOutlined />} 
            block 
            style={{ marginTop: 16 }} 
            onClick={() => setShowDetail(true)}
            className="btn-primary"
          >
            Xem chi tiết sản phẩm
          </Button>
        </Card>

        <Card style={{ borderRadius: 16 }}>
          <h2 style={{ textAlign: "center", fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Trạng thái đơn hàng</h2>

          <Steps
            current={currentStep}
            labelPlacement="vertical"
            items={STEP_ITEMS.map((item, index) => ({
              title: item.title,
              icon: React.cloneElement(item.icon, {
                style: {
                  borderRadius: "50%",
                  fontSize: 20,
                  padding: 8,
                  border: index === currentStep ? "2px solid #D93F3C" : "2px solid #ddd",
                  color: index === currentStep ? "#fff" : "#999",
                  backgroundColor: index === currentStep ? "#D93F3C" : "#fff",
                },
              }),
            }))}
          />

          <Row className="mt-8" gutter={16} justify="center">
            <Col xs={24} sm={12}>
              <Button block size="large" onClick={handleUpdateStatus} className="btn-primary" type="primary">
                Cập nhật trạng thái
              </Button>
            </Col>
            <Col xs={24} sm={12}>
              <Popconfirm title="Xác nhận giao hàng thất bại?" onConfirm={handleDeliveryFailed} okText="Đồng ý" cancelText="Hủy">
                <Button block size="large" danger ghost>Giao hàng thất bại</Button>
              </Popconfirm>
            </Col>
          </Row>
        </Card>
      </div>

      {showDetail && (
        <div className="fl-center showUp" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000 }}>
          <div style={{ width: "95%", maxWidth: "550px", backgroundColor: "#fdfbf5", height: "85%", borderRadius: "12px", position: "relative", overflowY: "auto", padding: "20px" }}>
            <OrderDetails order={currentOrder} />
            <Button 
              type="text"
              onClick={() => setShowDetail(false)} 
              style={{ position: "absolute", top: 10, right: 10 }} 
              icon={<CloseOutlined />} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;