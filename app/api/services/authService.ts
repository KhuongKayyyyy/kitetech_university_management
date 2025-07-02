import { store } from "@/store/store";
import { authRepository, LoginRequest } from "../repositories/authRepository";
import { setTokens, setUserInfo, clearAuth } from "@/store/authSlice";

export const authService = {
  login: async (payload: LoginRequest) => {
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
  },

  logout: () => {
    store.dispatch(clearAuth());
  },
};
