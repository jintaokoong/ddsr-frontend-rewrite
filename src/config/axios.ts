import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  headers: {
    "x-api-key": String(localStorage.getItem("api-key")),
  },
});

export default axiosInstance;
