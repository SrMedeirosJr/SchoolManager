import axios from "axios";

const api = axios.create({
  
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://schoolmanager-production-4cea.up.railway.app',
  headers: {
    "Content-Type": "application/json",

    
  },
});

console.log("✅ API Base URL:", process.env.NEXT_PUBLIC_API_URL);

export default api;
