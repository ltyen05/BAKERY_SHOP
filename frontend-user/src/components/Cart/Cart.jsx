import { Button } from "antd";
import ProductInCart from "../Product/ProductInCart";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";

const ProductCart = ({ onCloseDrawer }) => {
  const { user } = useAuth();
  const { productInCart, setProductInCart, removeFromCart } = useOrder();
  const navigate = useNavigate();
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      setProductInCart(productInCart.filter((p) => p.product_id !== id));
      return;
    }
    setProductInCart(
      productInCart.map((p) =>
        p.product_id === id ? { ...p, quantity: newQuantity } : p
      )
    );
  };

  const handleRemove = async (product_id) => {
 
    if (!user) {
      alert.error("Bạn cần đăng nhập.");
      return;
    }

    if (user.role !== "customer") {
      alert.error("Chỉ khách hàng mới có thể thêm sản phẩm vào giỏ hàng.");
      return;
    }

    try {
      await removeFromCart(product_id);
      console.log(`Đã xóa "${product_id}" khỏi giỏ hàng!`);
    } catch (err) {
      console.log(err.message || "Không thể xóa khỏi giỏ hàng");
    }
  };

  const totalItems = productInCart.reduce((sum, p) => sum + p.quantity, 0);
  const totalPrice = productInCart.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  if (productInCart.length === 0) {
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
        {productInCart.map((product) => (
          <ProductInCart
            key={product.product_id}
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
