import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";
const API = axios.create({
  baseURL: API_BASE,
});

// Add request interceptor for logging
API.interceptors.request.use(
  (config) => {
    const token = config.headers["x-auth-token"];
    if (token) {
      console.log("📤 API Request:", config.method.toUpperCase(), config.url, "with token");
    } else {
      console.log("📤 API Request:", config.method.toUpperCase(), config.url, "NO TOKEN");
    }
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
API.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.config.method.toUpperCase(), response.config.url, response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("❌ API Error:", error.response.status, error.response.data);
      // Don't automatically logout on 401 - let components handle it
    } else {
      console.error("❌ Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["x-auth-token"] = token;
    console.log("🔑 Auth token set in axios headers");
  } else {
    delete API.defaults.headers.common["x-auth-token"];
    console.log("🔓 Auth token removed from axios headers");
  }
};

export default API;
