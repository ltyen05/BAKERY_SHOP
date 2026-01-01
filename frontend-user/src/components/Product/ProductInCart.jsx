import React, { useState } from "react";
import { Row, Col } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const ProductInCart = ({ product, onQuantityChange, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="mb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Row align="middle" gutter={10}>
        {isHovered && (
          <button
            onClick={() => onRemove(product.product_id)}
            style={{
              width: "25px",
              height: "25px",
              borderRadius: "50%",
              border: "none",
            }}
            className="fl-center hover-grey"
          >
            <CloseOutlined style={{ fontSize: "15px" }} />
          </button>
        )}

        <Col span={8} className="fl-center">
          <img
            src={product.image}
            alt={product.name}
            style={{
              borderRadius: "50%",
              aspectRatio: "1/1",
              objectFit: "cover",
            }}
            className="w100"
          />
        </Col>

        <Col span={14} style={{ overflowWrap: "break-word" }}>
          <div className="mt-1">
            <h3 className="mb-1">{product.product_name}</h3>
            <p className="mb-1">{product.price.toLocaleString("vi-VN")} VNĐ</p>
          </div>
          <div
            style={{
              justifyContent: "start",
            }}
            className="fl-center"
          >
            <div
              style={{
                border: "2px solid  #61432b",
                borderRadius: "14px",
                overflow: "hidden",
                display: "inline-flex",
              }}
              className="fl-center mb-1"
            >
              <button
                onClick={() =>
                  onQuantityChange(product.product_id, product.quantity - 1)
                }
                style={{
                  width: "30px",
                  height: "30px",
                  background: "transparent",
                  fontSize: "20px",
                  cursor: "pointer",
                  border: "none",
                  color: "#4E3E2A",
                }}
                className="hover-grey fl-center"
              >
                −
              </button>

              <div
                style={{
                  width: "30px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "#4E3E2A",
                }}
              >
                {product.quantity}
              </div>

              <button
                onClick={() =>
                  onQuantityChange(product.product_id, product.quantity + 1)
                }
                style={{
                  width: "30px",
                  height: "30px",
                  border: "none",
                  background: "transparent",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#4E3E2A",
                }}
                className="hover-grey"
              >
                +
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductInCart;
