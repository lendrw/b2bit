import axios from "axios";
import { errorInterceptor, responseInterceptor } from "./interceptors";

const api = axios.create({
  baseURL: "https://api.homologation.cliqdrive.com.br",
  headers: {
    Accept: "application/json;version=v1_web",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => responseInterceptor(response),
  (error) => errorInterceptor(error)
);

export { api };
