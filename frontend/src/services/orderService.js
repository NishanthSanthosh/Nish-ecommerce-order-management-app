import { apiRequest, apiDelete } from "../api/client";

export const createOrder = (orderData) => {
  return apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
};

export const updateOrder = async (id, orderData) => {
  return await apiRequest(`/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(orderData),
  });
};

export const deleteOrder = async (id) => {
  return await apiDelete(`/orders/${id}`, {
    method: "DELETE",
  });
};

export const getOrders = async () => {
  return await apiRequest("/orders", {
    method: "GET",
  });
};
