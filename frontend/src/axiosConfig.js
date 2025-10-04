import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const setAuthToken = (token) => {
  if (token) API.defaults.headers.common["x-auth-token"] = token;
  else delete API.defaults.headers.common["x-auth-token"];
};

export default API;
