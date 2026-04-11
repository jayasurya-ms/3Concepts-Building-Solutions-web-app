import axios from "axios";
import Cookies from "js-cookie";
import BASE_URL from "../config/BaseUrl";

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Convert to FormData if the content type is multipart/form-data
    if (config.headers["Content-Type"] === "multipart/form-data" && config.data && !(config.data instanceof FormData)) {
      const formData = new FormData();
      Object.keys(config.data).forEach((key) => {
        formData.append(key, config.data[key]);
      });
      config.data = formData;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      console.error("Unauthorized! Redirecting to login...");
      Cookies.remove("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
