import { apiRequest } from "../api/client";

export const getSettings = async () => {
  return await apiRequest("/settings", {
    method: "GET",
  });
};

export const updateSettings = async (settingsData) => {
  return await apiRequest("/settings", {
    method: "PATCH",
    body: JSON.stringify(settingsData),
  });
};
