import React from "react";
import { Row, Col } from "antd";
const formatCurrency = (amount) => {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

const ProductItem = ({ product }) => (
  <Row
    className="product-item w100"
    style={{
      borderRadius: "12px",
      maxWidth: "500px",
    }}
  >
    <Col span={8} className="fl-center" style={{ padding: "10px" }}>
      <img
        src={product.image || garlicBread}
        alt={product.product_name}
        className="product-image w100"
        style={{
          aspectRatio: "1 / 1",
          objectFit: "cover",
          borderRadius: "12px",
        }}
      />
    </Col>

    <Col
      span={16}
      className="product-details fl-center"
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
        paddingLeft: "20px",
        textAlign: "left",
      }}
    >
      <h3 className="mb-1">{product.product_name.toUpperCase()}</h3>

      <p className="mb-1">Số lượng: {product.quantity}</p>
      <p>Giá: {formatCurrency(product.price)}</p>
    </Col>
  </Row>
);
export default ProductItem;
