import { fetchWithAuth } from "../utils/fetchWithAuth";

const API = "http://localhost:5000/api/account";

export const accountApi = {
  update_profile(data) {
    return fetchWithAuth(`${API}/profile`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  rank() {
    return fetchWithAuth(`${API}/rank`, {
      method: "GET",
    });
  },
  history_orders() {
    return fetchWithAuth(`${API}/order_history`, {
      method: "GET",
    });
  },
  active_orders() {
    return fetchWithAuth(`${API}/current-active-order`, {
      method: "GET",
    });
  },
  change_password(data) {
    return fetchWithAuth(`${API}/change-password`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  get_branch() {
    return fetch(`${API}/branch_detail`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  products_bought() {
    return fetchWithAuth(`${API}/bought_products`, {
      method: "GET",
    });
  },
};
