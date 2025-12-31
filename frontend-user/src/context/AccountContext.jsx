import { createContext, useContext, useEffect, useState } from "react";
import { accountApi } from "../api/accountApi";

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  /* =======================
     2️⃣ Profile
  ======================= */
  const [branches, setBranches] = useState([]);
  const [loadingBranch, setLoadingBranch] = useState(false);
  useEffect(() => {
    const fetchBranches = async () => {
      setLoadingBranch(true);
      try {
        const res = await accountApi.get_branch();
        const data = await res.json();

        if (res.ok) {
          // backend có thể trả { data: [...] } hoặc [...]
          setBranches(data.details || data);
        } else {
          console.error(data.message || "Fetch branch thất bại");
        }
      } catch (err) {
        console.error("Lỗi fetch branch:", err);
      } finally {
        setLoadingBranch(false);
      }
    };

    fetchBranches();
  }, []);

  const update_profile = async (email, phone) => {
    const res = await accountApi.update_profile({ email, phone });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Cập nhật thông tin thất bại");
    }

    return data;
  };

  const change_password = async (
    old_password,
    new_password,
    confirm_password
  ) => {
    const res = await accountApi.change_password({
      old_password,
      new_password,
      confirm_password,
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Thay đổi mật khẩu thất bại");
    }

    return data;
  };

  const get_rank = async () => {
    const res = await accountApi.rank(); // Giả sử accountApi.get_rank() gọi /rank
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Lấy thông tin rank thất bại");
    }

    return data;
  };
  const get_active_order = async () => {
    const res = await accountApi.active_orders(); // Giả sử accountApi.get_rank() gọi /rank
    const data = await res.json();
    console.log(data);
    if (!res.ok) {
      throw new Error(data.message || "Lấy thông tin rank thất bại");
    }

    return data;
  };
  // ----------------------------History orders
  const history_orders = async () => {
    const res = await accountApi.history_orders();
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Lấy lịch sử đơn hàng thất bại");
    }
    return data.data;
  };

  // ------------------ Products bought ------------------
  const products_bought = async () => {
    try {
      const res = await accountApi.products_bought();
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Lấy sản phẩm đã mua thất bại");
      return data.data || []; // trả về mảng sản phẩm
    } catch (err) {
      console.error("Lỗi fetch bought products:", err);
      return [];
    }
  };
  return (
    <AccountContext.Provider
      value={{
        update_profile,
        change_password,
        get_rank,
        history_orders,
        get_active_order,
        branches,
        products_bought,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export const useAccount = () => {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used inside AccountProvider");
  return ctx;
};
