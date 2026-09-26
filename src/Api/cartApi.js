import api from "./api";

export const CartApi = {
  get: () => api.get("/cart"),
  add: (productId, quantity = 1) => api.post("/cart/add", { productId, quantity }),
  update: (productId, quantity) => api.put("/cart/update", { productId, quantity }),
  remove: (productId) => api.delete(`/cart/remove/${productId}`),
  clear: () => api.delete("/cart/clear"),
};
