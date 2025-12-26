import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  // Mock user - Sau này lấy từ API login
  const [user, setUser] = useState(() => {
    return {
      employee_id: 1, // ← Đổi id thành employee_id
      employee_name: 'Nguyễn Bảo Thạch', // ← Đổi name thành employee_name
      email: 'thach.nguyen@husbakery.vn',
      role: 'super_admin', // Hoặc 'admin'
      role_name: 'Quản lý', // ← Field từ DB
      branch_id: 1, // ← Admin thường có branch_id cố định
      avatar: 'https://i.postimg.cc/4ykv8DXb/avatar1.png'
    };
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}