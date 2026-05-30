import apiClient from "./apiClient";

const authHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const fetchContactsRequest = async (token) => {
  const response = await apiClient.get("/api/contacts", authHeaders(token));
  return response.data;
};

export const createContactRequest = async (token, payload) => {
  const response = await apiClient.post("/api/contacts", payload, authHeaders(token));
  return response.data;
};

export const updateContactRequest = async (token, contactId, payload) => {
  const response = await apiClient.put(`/api/contacts/${contactId}`, payload, authHeaders(token));
  return response.data;
};

export const deleteContactRequest = async (token, contactId) => {
  const response = await apiClient.delete(`/api/contacts/${contactId}`, authHeaders(token));
  return response.data;
};
