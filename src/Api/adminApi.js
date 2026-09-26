import api from "./api";

export const AdminApi = {
  dashboardStats: () => api.get("/admin/dashboard-stats"),

  // Vendors
  vendors: (params) => api.get("/admin/vendors", { params }),
  vendor: (id) => api.get(`/admin/vendors/${id}`),
  blockVendor: (id, isBlocked) => api.patch(`/admin/vendors/${id}/block`, { isBlocked }),
  deleteVendor: (id) => api.delete(`/admin/vendors/${id}`),
  restoreVendor: (id) => api.patch(`/admin/vendors/${id}/restore`),

  // Products
  products: (params) => api.get("/admin/products", { params }),
  blockProduct: (id, isBlocked) => api.patch(`/admin/products/${id}/block`, { isBlocked }),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  restoreProduct: (id) => api.patch(`/admin/products/${id}/restore`),

  // Users
  customers: (params) => api.get("/admin/customers", { params }),
  users: (params) => api.get("/admin/users", { params }),
  blockUser: (id, isBlocked) => api.patch(`/admin/users/${id}/block`, { isBlocked }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  restoreUser: (id) => api.patch(`/admin/users/${id}/restore`),

  // Orders
  orders: (params) => api.get("/admin/orders", { params }),
  updateOrderStatus: (id, payload) => api.patch(`/admin/orders/${id}/status`, payload),

  // Reviews
  reviews: (params) => api.get("/admin/reviews", { params }),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
};
