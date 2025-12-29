import { fetchWithAuth } from "../utils/fetchWithAuth";

const API = "http://localhost:5000/api";

export const orderApi = {
  get_coupons() {
    return fetchWithAuth(`${API}/my-coupons`);
  },
  get_cart() {
    return fetchWithAuth(`${API}/cart`);
  },
  add_to_cart(cartData) {
    return fetch(`${API}/addToCart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartData),
    });
  },
  remove_from_cart(product_id) {
    return fetchWithAuth(`${API}/cart/remove`, {
      method: "DELETE",
      body: JSON.stringify({ product_id: product_id }),
    });
  },
  changeQuantity(cartData) {
    return fetchWithAuth(`${API}/changeQuantity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartData),
    });
  },
  order_details(order_id) {
    return fetch(`${API}/order_details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: order_id }),
    });
  },
  create_order(data) {
    return fetchWithAuth(`${API}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
};
