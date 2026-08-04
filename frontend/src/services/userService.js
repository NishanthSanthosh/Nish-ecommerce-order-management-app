import { apiRequest, apiDelete } from "../api/client";

export const createUser = (userData) => {
  return apiRequest("/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const updateUser = async (id, userData) => {
  return await apiRequest(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(userData),
  });
};

export const deleteUser = async (id) => {
  return await apiDelete(`/users/${id}`, {
    method: "DELETE",
  });
};

export const getUsers = async () => {
  return await apiRequest("/users", {
    method: "GET",
  });
};
