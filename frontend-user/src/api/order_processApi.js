import { fetchWithAuth } from "../utils/fetchWithAuth";

const API = "http://localhost:5000/api";

export const orderApi = {
  get_coupons() {
    return fetchWithAuth(`${API}/my-coupons`);
  },
  get_cart() {
    return fetchWithAuth(`${API}/cart`);
  },
};
