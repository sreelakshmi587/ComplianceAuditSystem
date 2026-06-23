import axios from "axios";

const API_URL =
  "https://localhost:7071/api/User";

export const getUsers = () =>
  axios.get(API_URL);

export const addUser = (data) =>
  axios.post(API_URL, data);

export const updateUser = (id, data) =>
  axios.put(`${API_URL}/${id}`, data);

export const deleteUser = (id) =>
  axios.delete(`${API_URL}/${id}`);