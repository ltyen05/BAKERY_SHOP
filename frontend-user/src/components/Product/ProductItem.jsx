import React from "react";
import { Row, Col } from "antd";
import garlicBread from "../../assets/garlicBread.png";
const formatCurrency = (amount) => {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

const ProductItem = ({ product }) => (
  <Row
    className="product-item"
    style={{
      // backgroundColor: "white",
      borderRadius: "12px",
      width: "100%",
      maxWidth: "500px",
    }}
  >
    <Col span={8} className="fl-center" style={{ padding: "10px" }}>
      <img
        src={product.image || garlicBread}
        alt={product.name}
        className="product-image"
        style={{
          width: "100%",
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
      <h3 className="mb-1">{product.name.toUpperCase()}</h3>

      <p className="mb-1">Số lượng: {product.quantity}</p>
      <p>Giá: {formatCurrency(product.price)}</p>
    </Col>
  </Row>
);
export default ProductItem;
