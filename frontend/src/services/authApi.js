import apiClient from "./apiClient";

export const registerUser = async (payload) => {
  const response = await apiClient.post("/api/users/register", payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await apiClient.post("/api/users/login", payload);
  return response.data;
};
