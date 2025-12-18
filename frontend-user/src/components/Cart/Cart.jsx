import { useState } from "react";
import ProductInCart from "../Product/ProductInCart";

const ProductCart = ({ productList }) => {
  const [products, setProducts] = useState(productList);

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
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6 bg-white rounded-2xl shadow-sm overflow-hidden">
          {products.map((product) => (
            <ProductInCart
              key={product.id}
              product={product}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600">Số lượng</span>
            <span className="font-medium">{totalItems} sản phẩm</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tổng thanh toán</span>
            <span className="font-bold text-lg text-red-500">
              {totalPrice.toLocaleString("vi-VN")} VNĐ
            </span>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:from-amber-700 hover:to-amber-800">
          Đặt ngay →
        </button>
      </div>
    </div>
  );
};

export default ProductCart;
