import type {
  LoginPayload,
  LoginResponse,
  UserProfile,
} from "../../../types/auth";
import { api } from "../axios-config";

export const authService = {
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login/", data);

    if (response.data.tokens.access) {
      localStorage.setItem("access_token", response.data.tokens.access);
    }

    return response.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>("/auth/profile/");
    return response.data;
  },
};
