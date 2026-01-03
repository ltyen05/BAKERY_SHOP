import React, { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
const ProductInCart = ({ product, onQuantityChange, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="p-4 border-b border-gray-200 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="fl align-center">
        {isHovered && (
          <button
            onClick={() => onRemove(product.id)}
            className="w-12 h-12 bg-red-400 rounded-xl flex items-center justify-center text-white hover:bg-red-500 transition-all"
          >
            <CloseOutlined />
          </button>
        )}

        <img
          src={product.image}
          alt={product.name}
          className="w-20 h-20 rounded-xl object-cover"
        />

        <div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-800 mb-1">{product.name}</h3>
            <p className="text-red-500 font-semibold">
              {product.price.toLocaleString("vi-VN")} VNĐ
            </p>
          </div>
          <div
            style={{
              justifyContent: "start",

              gap: "10px",
            }}
            className="fl-center mb-6"
          >
            <div
              style={{
                border: "2px solid  #61432b",
                borderRadius: "14px",
                overflow: "hidden",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() =>
                  onQuantityChange(product.id, product.quantity - 1)
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
                  onQuantityChange(product.id, product.quantity + 1)
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
        </div>
      </div>
    </div>
  );
};

export default ProductInCart;
