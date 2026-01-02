import { fetchWithAuth } from "../utils/fetchWithAuth";

const API = import.meta.env.VITE_API_URL;
console.log("🔥 API URL HIỆN TẠI LÀ:", API);
export const authApi = {
  login(data) {
    return fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  signup(data) {
    return fetch(`${API}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  me() {
    return fetchWithAuth(`${API}/me`);
  },
};
