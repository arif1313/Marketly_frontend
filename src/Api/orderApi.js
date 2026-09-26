import api from "./api";

export const OrderApi = {
  // payload: { productId? (buy-now only), quantity, customerInfo: {name, phone, email?, address, city?, note?}, paymentMethod }
  place: (payload) => api.post("/orders", payload),
  myOrders: (params) => api.get("/orders/my-orders", { params }),
  getOne: (id) => api.get(`/orders/${id}`),

  // Vendor dashboard
  vendorOrders: (params) => api.get("/vendor/orders", { params }),
  updateStatus: (id, payload) => api.patch(`/vendor/orders/${id}/status`, payload),
};
