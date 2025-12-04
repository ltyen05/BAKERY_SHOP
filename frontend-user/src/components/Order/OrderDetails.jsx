import React from "react";
import { Row, Col } from "antd";
import ProductItem from "../Product/ProductItem";
import "./OrderDetails.css";
const mockOrderData = {
  shippingInfo: {
    recipient: "Phan Diệu Lê",
    phone: "0123456789",
    address: "334 Nguyễn Trãi, Thanh Xuân",
  },
  orderDetails: {
    orderId: "ABCDEFGH",
    paymentMethod: "Thanh toán khi nhận hàng",
    orderTime: "10-10-2025 15:42",
    store: "Hus Bakery 2",
  },
  products: [
    {
      id: 1,
      name: "Bánh mossue dưa lưới",
      quantity: 3,
      price: 299000,
      // Dùng placeholder image
      image: "https://via.placeholder.com/100x100/f8a32d/ffffff?text=Croissant",
    },
    {
      id: 2,
      name: "Bánh mossue dưa lưới",
      quantity: 3,
      price: 299000,
      image: "https://via.placeholder.com/100x100/f8a32d/ffffff?text=Croissant",
    },
    {
      id: 3,
      name: "Bánh mossue dưa lưới",
      quantity: 3,
      price: 299000,
      image: "https://via.placeholder.com/100x100/f8a32d/ffffff?text=Croissant",
    },
  ],
};
const formatCurrency = (amount) => {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};
const OrderDetails = () => {
  const { shippingInfo, orderDetails, products } = mockOrderData;

  const totalItems = products.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = products.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div
      className="order-container"
      style={{
        width: "100%",
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
              <span className="info-value">{shippingInfo.recipient}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Số điện thoại: </span>
              <span className="info-value">{shippingInfo.phone}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Người nhận </span>
              <span className="info-value">{shippingInfo.address}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Mã đơn hàng </span>
              <span className="info-value">{orderDetails.orderId}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phương thức thanh toán </span>
              <span className="info-value">{orderDetails.paymentMethod}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Thời gian đặt hàng </span>
              <span className="info-value">{orderDetails.orderTime}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Cơ sở </span>
              <span className="info-value">{orderDetails.store}</span>
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
            {products.map((product) => (
              <div className=" mb-3">
                <ProductItem key={product.id} product={product} />
              </div>
            ))}
          </div>

          <div className="order-summary mt-3 mb-3" style={{ textAlign: "end" }}>
            Tổng số tiền ({totalItems} sản phẩm):
            <span className="total-amount"> {formatCurrency(totalPrice)}</span>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetails;
