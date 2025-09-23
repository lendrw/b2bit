import { AxiosError } from "axios";

export const errorInterceptor = (error: AxiosError) => {
  if (error.message === "Network Error") {
    return Promise.reject(new Error("Connection error. Please try again."));
  }

  if (error.response?.status === 403) {
    console.warn("Forbidden: you don't have permission to access this resource.");
  }

  return Promise.reject(error);
};
