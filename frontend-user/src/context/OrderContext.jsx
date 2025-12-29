import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../api/order_processApi";
import { tokenStorage } from "../utils/token";
import { useAuth } from "./AuthContext";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [productInCart, setProductInCart] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [couponError, setCouponError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false); // ⭐ THÊM DÒNG NÀY
  const [loadingCreateOrder, setLoadingCreateOrder] = useState(false);
  const fetchCoupons = async () => {
    try {
      setLoadingCoupons(true);
      setCouponError(null);
      const token = tokenStorage.get();
      if (!token) {
        console.log("No token found, cannot fetch coupons");
        return;
      }
      const res = await orderApi.get_coupons();
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Lấy coupon thất bại");
      }
      setCoupons(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setCouponError(err.message);
      throw err;
    } finally {
      setLoadingCoupons(false);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await orderApi.get_cart();
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Lấy giỏ hàng thất bại");
      }

      setProductInCart((prevCart) => {
        const newCart = Array.isArray(data.items) ? data.items : [];

        // So sánh để tránh re-render không cần thiết
        if (JSON.stringify(prevCart) === JSON.stringify(newCart)) {
          return prevCart;
        }
        console.log("Cart updated:", newCart);
        return newCart;
      });

      return data.items;
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  };
  const orderDetails = async (order_id) => {
    try {
      const res = await orderApi.order_details(order_id);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Lấy chi tiết đơn hàng thất bại");
      }
      console.log("Response data:", data.data);
      return data.data;
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  };
  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      throw new Error("Vui lòng đăng nhập");
    }

    const previousCart = [...productInCart];
    setAddingToCart(true);

    // Optimistic update
    setProductInCart((prev) => {
      const existing = prev.find(
        (item) => item.product_id === product.product_id
      );
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    try {
      const res = await orderApi.add_to_cart({
        customer_id: user.user_id,
        product_id: product.product_id,
        quantity,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Thêm vào giỏ hàng thất bại");
      }

      // Fetch lại cart để sync với server
      await fetchCart();

      return data;
    } catch (err) {
      setProductInCart(previousCart);
      console.error("Add to cart error:", err);
      throw err;
    } finally {
      setAddingToCart(false);
    }
  };
  const create_order = async (data) => {
    // Thay vì 7 tham số, chỉ nhận 1 object 'data'
    setLoadingCreateOrder(true);
    if (!user) {
      throw new Error("Vui lòng đăng nhập");
    }

    try {
      // Bóc tách dữ liệu từ object data truyền vào
      const {
        recipient_name,
        phone,
        total_amount,
        branch_id,
        shipping_address,
        payment_method,
        coupon_id,
      } = data;

      const payload = {
        recipient_name,
        phone,
        total_amount,
        branch_id,
        shipping_address,
        payment_method,
        coupon_id,
      };

      const res = await orderApi.create_order(payload);
      const resultData = await res.json(); // Đổi tên biến để tránh trùng với tham số 'data'

      if (!res.ok) {
        throw new Error(resultData.error || "Tạo đơn hàng thất bại");
      }

      setProductInCart([]);
      setSelectedVoucher(null);
      fetchCart();

      return resultData;
    } catch (err) {
      console.error("Create order error:", err.message);
      throw err;
    } finally {
      setLoadingCreateOrder(false);
    }
  };
  const removeFromCart = async (product_id) => {
    const previousCart = [...productInCart];

    // Optimistic update
    setProductInCart((prev) =>
      prev.filter((item) => item.product_id !== product_id)
    );

    try {
      const res = await orderApi.remove_from_cart(product_id);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Remove failed");
      }
      await fetchCart();
      return data;
    } catch (err) {
      setProductInCart(previousCart); // rollback
      throw err;
    }
  };
  // Fetch khi user đăng nhập
  useEffect(() => {
    if (user && user.role === "customer") {
      fetchCoupons();
      fetchCart();
    } else {
      setProductInCart([]);
      setCoupons([]);
      setSelectedVoucher(null);
    }
  }, [user]); // ⭐ THÊM dependency [user]

  return (
    <OrderContext.Provider
      value={{
        refetchCoupons: fetchCoupons,
        coupons,
        setCoupons,
        selectedVoucher,
        setSelectedVoucher,
        loadingCoupons,
        orderDetails,
        couponError,
        productInCart,
        setProductInCart,
        refetchCart: fetchCart,
        addToCart, // ⭐ THÊM vào value
        addingToCart, // ⭐ THÊM vào value
        removeFromCart,
        create_order,
        loadingCreateOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used inside OrderProvider");
  return ctx;
};
