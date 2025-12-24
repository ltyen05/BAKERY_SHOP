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
};
