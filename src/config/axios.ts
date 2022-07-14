import axios from "axios";
import * as R from "ramda";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  headers: {
    "x-api-key": String(localStorage.getItem("api-key")),
  },
});

axiosInstance.interceptors.request.use((config) => {
  const key = localStorage.getItem("api-key");
  if (!key) return config;
  config.headers = R.assoc("x-api-key", key, R.defaultTo({}, config.headers));
  return config;
});

export default axiosInstance;
