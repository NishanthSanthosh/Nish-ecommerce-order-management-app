import { apiRequest } from "../api/client";

export const loginAdmin = (credentials) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const signupAdmin = (adminData) => {
  return apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify(adminData),
  });
};

export const getCurrentAdmin = () => {
  return apiRequest("/auth/me", {
    method: "GET",
  });
};
