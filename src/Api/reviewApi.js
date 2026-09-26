import api from "./api";

export const ReviewApi = {
  createProductReview: (productId, payload) => api.post(`/reviews/product/${productId}`, payload),
  createVendorReview: (vendorId, payload) => api.post(`/reviews/vendor/${vendorId}`, payload),
  productReviews: (productId) => api.get(`/reviews/product/${productId}`),
  vendorReviews: (vendorId) => api.get(`/reviews/vendor/${vendorId}`),
};
