import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const get_rank = async () => {
    const res = await accountApi.rank(); // Giả sử accountApi.get_rank() gọi /rank
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Lấy thông tin rank thất bại");
    }

    return data;
  };

  return (
    <AccountContext.Provider value={{ update_profile, get_rank }}>
      {children}
    </AccountContext.Provider>
  );
}

export const useAccount = () => {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used inside AccountProvider");
  return ctx;
};
