import api from "./api";

export const CategoryApi = {
  list: () => api.get("/categories"),
  getOne: (id) => api.get(`/categories/${id}`),
};
