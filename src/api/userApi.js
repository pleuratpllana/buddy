// userApi.js
import axios from "axios";

const userApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://6800e4bab72e9cfaf7291cea.mockapi.io/chatbotusers",
});

export default userApi;
