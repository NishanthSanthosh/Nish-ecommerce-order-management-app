import { apiRequest, apiDelete } from "../api/client";

export const createProduct = (productData) => {
  return apiRequest("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
};
export const updateProduct = async (id, productData) => {
  return await apiRequest(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(productData),
  });
};
export const deleteProduct = async (id) => {
  return await apiDelete(`/products/${id}`, {
    method: "DELETE",
  });
};
export const getProducts = async () => {
  return await apiRequest("/products", {
    method: "GET",
  });
};
