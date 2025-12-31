import React from "react";
import { Row, Col } from "antd";
import ProductItem from "../Product/ProductItem";

const formatCurrency = (amount) => {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};
const OrderDetails = ({ order }) => {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = order.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div
      className="scrollbar w100"
      style={{
        maxHeight: "100%",
        overflowY: "auto",
      }}
    >
      <Row
        style={{
          borderBottom: "1px solid",
          padding: "15px 25px",
          fontSize: "24px",
          fontWeight: "600",
        }}
      >
        <p>Thông tin đơn hàng</p>
      </Row>

      <Row
        className="order-content"
        style={{ textAlign: "start", maxHeight: "100%" }}
      >
        <Col span={24} className="order-col-right" style={{ padding: "15px" }}>
          <div className="info-box">
            <div className="info-row">
              <span className="info-label">Người nhận </span>
              <span className="info-value">{order.recipient_name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Số điện thoại: </span>
              <span className="info-value">{order.phone}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Địa chỉ nhận </span>
              <span className="info-value">{order.address}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Mã đơn hàng </span>
              <span className="info-value">{order.order_id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phương thức thanh toán </span>
              <span className="info-value">{order.payment_method}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Thời gian đặt hàng </span>
              <span className="info-value">{order.created_at}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Cơ sở </span>
              <span className="info-value">{order.branch_name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Nhân viên giao hàng </span>
              <span className="info-value">{order.shipper_name}</span>
            </div>
          </div>

          <div
            className="product-section fl-center"
            style={{ flexDirection: "column" }}
          >
            <div
              className="fl-center mb-2"
              style={{ fontSize: "23px", fontWeight: "500" }}
            >
              Sản phẩm
            </div>
            {order.items.map((product) => (
              <div className=" mb-3">
                <ProductItem key={product.id} product={product} />
              </div>
            ))}
          </div>

          <div className="order-summary mt-3 mb-2" style={{ textAlign: "end" }}>
            Tổng số tiền ({totalItems} sản phẩm):
            <span className="total-amount"> {formatCurrency(totalPrice)}</span>
          </div>
          <h3 className="order-summary " style={{ textAlign: "end" }}>
            Tổng tiền hàng :
            <span className="total-amount">
              {formatCurrency(order.total_money)}
            </span>
          </h3>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetails;
