import axios from "axios";

const API_URL =
  "https://localhost:7071/api/groups";

export const getGroups = () =>
  axios.get(API_URL);

export const addGroup = (data) =>
  axios.post(API_URL, data);

export const updateGroup = (id, data) =>
  axios.put(`${API_URL}/${id}`, data);

export const deleteGroup = (id) =>
  axios.delete(`${API_URL}/${id}`);