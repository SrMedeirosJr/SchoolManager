import axios from "axios";

console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://schoolmanager-production-4cea.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
