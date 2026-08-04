import { apiRequest, apiDelete } from "../api/client";

export const createCategory = (categoryData) => {
  return apiRequest("/categories", {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
};

export const updateCategory = async (id, categoryData) => {
  return await apiRequest(`/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(categoryData),
  });
};

export const deleteCategory = async (id) => {
  return await apiDelete(`/categories/${id}`, {
    method: "DELETE",
  });
};

export const getCategories = async () => {
  return await apiRequest("/categories", {
    method: "GET",
  });
};
