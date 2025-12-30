import { tokenStorage } from "./token";

export async function fetchWithAuth(url, options = {}) {
  const token = tokenStorage.get();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });
    return res;
  } catch (error) {
    console.error("Lỗi kết nối mạng hoặc Server sập:", error);
    throw error; // Ném lỗi để fetchCoupons có thể catch được
  }
}
