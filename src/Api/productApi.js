import api from "./api";

export const ProductApi = {
  // Public storefront
  list: (params) => api.get("/products", { params }),
  getOne: (idOrSlug) => api.get(`/products/${idOrSlug}`),
  reviews: (id) => api.get(`/products/${id}/reviews`),

  // Vendor dashboard
  myProducts: (params) => api.get("/vendor/products", { params }),
  create: (formData) =>
    api.post("/vendor/products", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id, formData) =>
    api.patch(`/vendor/products/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  remove: (id) => api.delete(`/vendor/products/${id}`),
};
