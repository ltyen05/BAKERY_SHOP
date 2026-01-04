import { fetchWithAuth } from "../utils/fetchWithAuth";

const API = `${import.meta.env.VITE_API_URL}/notification`;

export const notificationApi = {
  mark_read(order_id) {
    return fetchWithAuth(`${API}/mark-read/${order_id}`, {
      method: "POST",
    });
  },

  all_notifications() {
    return fetchWithAuth(`${API}/all_notifications`, {
      method: "GET",
    });
  },

  check_status() {
    return fetchWithAuth(`${API}/check-status`, {
      method: "GET",
    });
  },
};

