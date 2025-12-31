import { createContext, useContext, useEffect, useState } from "react";
import { accountApi } from "../api/accountApi";

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  /* =======================
     2️⃣ Profile
  ======================= */
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
  const history_orders = async () => {
    const res = await accountApi.history_orders();
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Lấy lịch sử đơn hàng thất bại");
    }
    return data.data;
  };
  return (
    <AccountContext.Provider
      value={{
        update_profile,
        change_password,
        get_rank,
        history_orders,
        get_active_order,
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
