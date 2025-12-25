import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../api/order_processApi";
import { tokenStorage } from "../utils/token";
import { useAuth } from "./AuthContext";
import Product from "../components/Product/Product";
const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [productInCart, setProductInCart] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [couponError, setCouponError] = useState(null);
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
        throw new Error(data.message || "Lấy coupon thất bại");
      }
      setProductInCart(Array.isArray(data.items) ? data.items : []);
      return data.items;
    } catch (err) {
      console.log(err.message);
      throw err;
    } finally {
      // setLoadingCoupons(false);
    }
  };

  // 🔥 Fetch 1 lần khi app load
  useEffect(() => {
    if (user) {
      fetchCoupons();
      fetchCart();
    }
  }, []);

  return (
    <OrderContext.Provider
      value={{
        refetchCoupons: fetchCoupons,
        coupons,
        setCoupons,
        selectedVoucher,
        setSelectedVoucher,
        loadingCoupons,
        couponError,
        productInCart,
        setProductInCart,
        refetchCart: fetchCart,
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
