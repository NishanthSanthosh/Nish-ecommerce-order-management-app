import { apiRequest, apiDelete } from "../api/client";

export const createCoupon = (couponData) => {
  return apiRequest("/coupons", {
    method: "POST",
    body: JSON.stringify(couponData),
  });
};

export const updateCoupon = async (id, couponData) => {
  return await apiRequest(`/coupons/${id}`, {
    method: "PATCH",
    body: JSON.stringify(couponData),
  });
};

export const deleteCoupon = async (id) => {
  return await apiDelete(`/coupons/${id}`, {
    method: "DELETE",
  });
};

export const getCoupons = async () => {
  return await apiRequest("/coupons", {
    method: "GET",
  });
};
