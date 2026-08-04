import { getStoredToken } from "../services/authStorage";

const BASE_URL = "http://127.0.0.1:3000/api/version1";

export const apiRequest = async (endpoint, options = {}) => {
  const token = getStoredToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    const message =
      typeof data?.message === "string"
        ? data.message
        : JSON.stringify(data?.message) || "Server Error";

    throw new Error(message);
  }
  return data;
};
export const apiDelete = async (endpoint, options = {}) => {
  const token = getStoredToken();
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    ...options,
    headers,
  });
  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return { success: true };
  }
  const contentType = response.headers.get("content-type");
  let data = null;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  }
  if (!response.ok) {
    throw new Error(data?.message || `Delete failed (${response.status})`);
  }
  return data || { success: true };
};
