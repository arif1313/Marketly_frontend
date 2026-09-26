import api from "./api";

export const VendorApi = {
  list: (params) => api.get("/vendors", { params }),
  storefront: (idOrSlug) => api.get(`/vendors/${idOrSlug}`),
  reviews: (id) => api.get(`/vendors/${id}/reviews`),
  myShop: () => api.get("/vendors/me"),
  updateMyShop: (formData) =>
    api.patch("/vendors/me", formData, { headers: { "Content-Type": "multipart/form-data" } }),
};
