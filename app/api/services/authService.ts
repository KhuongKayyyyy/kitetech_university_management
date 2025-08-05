import { store } from "@/store/store";
import { authRepository, LoginRequest } from "../repositories/authRepository";
import { setTokens, setUserInfo, clearAuth } from "@/store/authSlice";
import { toast } from "sonner";

export const authService = {
  login: async (payload: LoginRequest) => {
    try {
      const response = await authRepository.login(payload);
      
      store.dispatch(
        setTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      );

      const userInfoResponse = await authRepository.getUserInfo();
      store.dispatch(setUserInfo(userInfoResponse.data));

      return {
        ...response.data,
        userInfo: userInfoResponse.data,
      };
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific error cases
      if (error.response?.status === 500) {
        toast.error("Server is currently unavailable. Please try again later.");
        throw new Error("Server error - please try again later");
      } else if (error.response?.status === 401) {
        toast.error("Invalid username or password");
        throw new Error("Invalid credentials");
      } else if (error.code === "ECONNREFUSED" || error.message?.includes("Network Error")) {
        toast.error("Cannot connect to server. Please check your internet connection.");
        throw new Error("Network error - cannot connect to server");
      } else {
        toast.error("Login failed. Please try again.");
        throw error;
      }
    }
  },

  logout: () => {
    store.dispatch(clearAuth());
  },
};
