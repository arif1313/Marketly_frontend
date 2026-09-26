import api from "./api";

export const AuthApi = {
  registerCustomer: (payload) => api.post("/auth/register", payload),
  registerVendor: (formData) =>
    api.post("/vendors/register", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  login: (payload) => {
    const guestId = localStorage.getItem("guestId");
    return api.post("/auth/login", { ...payload, guestId });
  },
  me: () => api.get("/auth/me"),
  updateMe: (formData) =>
    api.patch("/auth/me", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  changePassword: (payload) => api.post("/auth/change-password", payload),
};
