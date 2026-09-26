import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the logged-in user's token, and the guest id for anonymous cart/checkout.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const guestId = localStorage.getItem("guestId");
  if (guestId) config.headers["x-guest-id"] = guestId;

  return config;
});

// The backend hands back (or refreshes) the guest id on every response header.
api.interceptors.response.use(
  (response) => {
    const guestId = response.headers?.["x-guest-id"];
    if (guestId) localStorage.setItem("guestId", guestId);
    return response;
  },
  (error) => Promise.reject(error)
);

export default api;
