import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
//   const token = localStorage.getItem("authToken");

//   const headers = {
//     ...options.headers,
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   };

//   return fetch(url, { ...options, headers });
// };


export default API;
