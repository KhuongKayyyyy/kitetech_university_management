
import { API_CONFIG } from "@/constants/api_config";
import axiosClient from "../client/axiosClient";
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const authRepository = {
  login: (payload: LoginRequest) =>
    axiosClient.post<LoginResponse>(API_CONFIG.LOGIN, payload),

  getUserInfo: () =>
    axiosClient.get(API_CONFIG.GET_USER_INFO),
};
