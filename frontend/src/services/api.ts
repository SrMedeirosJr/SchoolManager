import axios from "axios";

const api = axios.create({
baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://schoolmanager-production-4cea.up.railway.app',
 //baseURL: 'http://localhost:3000' ,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default api;
