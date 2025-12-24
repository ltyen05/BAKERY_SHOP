import { tokenStorage } from "./token";

export async function fetchWithAuth(url, options = {}) {
  const token = tokenStorage.get();

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  return res;
}
