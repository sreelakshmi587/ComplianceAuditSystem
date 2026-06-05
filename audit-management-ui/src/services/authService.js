import axios from "axios";

const API_URL = "https://localhost:7071/api/auth";

export const register = async (data) => {
  return await axios.post(
    `${API_URL}/register`,
    data
  );
};

export const login = async (data) => {
  return await axios.post(
    `${API_URL}/login`,
    data
  );
};


export const forgotPassword = async (data) => {
  return await axios.post(
    `${API_URL}/forgot-password`,
    data
  );
};