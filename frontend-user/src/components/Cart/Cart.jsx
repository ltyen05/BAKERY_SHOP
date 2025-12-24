import { useState } from "react";
import { Button } from "antd";
import ProductInCart from "../Product/ProductInCart";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ProductCart = ({ productList, onCloseDrawer }) => {
  const [products, setProducts] = useState(productList);
  const navigate = useNavigate();
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      setProducts(products.filter((p) => p.id !== id));
      return;
    }
    setProducts(
      products.map((p) => (p.id === id ? { ...p, quantity: newQuantity } : p))
    );
  };

  const handleRemove = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="w-full max-w-md text-center">
          <p className="text-gray-500">Giỏ hàng trống</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        {products.map((product) => (
          <ProductInCart
            key={product.product}
            product={product}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <div className="mb-3" style={{ borderTop: "1px solid #3434348e" }}>
        <div className="mt-3 mb-2" style={{ fontSize: "16px" }}>
          <span>Tổng số lượng: </span>
          <span style={{ fontWeight: "500" }}>{totalItems} sản phẩm</span>
        </div>
        <div style={{ fontSize: "16px" }}>
          <span>Tổng thanh toán: </span>
          <span style={{ fontWeight: "500" }}>
            {totalPrice.toLocaleString("vi-VN")} VNĐ
          </span>
        </div>
      </div>

      <Button
        className="btn btn-second mb-3 fl-center"
        style={{ fontSize: "16px" }}
        onClick={() => {
          onCloseDrawer(); // đóng Drawer
          navigate("/payment", {
            state: {
              products,
              totalItems,
              totalPrice,
            },
          });
        }}
      >
        <span style={{ fontWeight: "500" }}>Đặt ngay →</span>
      </Button>
    </div>
  );
};

export default ProductCart;
