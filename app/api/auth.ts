// import { API_CONFIG } from "@/constants/api_config";
// import { store } from "@/store/store";
// import { clearAuth, setTokens, setUserInfo } from "@/store/authSlice";
// import axios from "axios";

// export interface LoginRequest {
//   username: string;
//   password: string;
// }

// export interface LoginResponse {
//   accessToken: string;
//   refreshToken: string;
// }

// export async function login(payload: LoginRequest) {
//   try {
//     const response = await axios.post<LoginResponse>(
//       `${API_CONFIG.LOGIN}`,
//       payload,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//       }
//     );

//     store.dispatch(
//       setTokens({
//         accessToken: response.data.accessToken,
//         refreshToken: response.data.refreshToken,
//       })
//     );

//     const userInfo = await getUserInfo();
//     store.dispatch(setUserInfo(userInfo));

//     return { ...response.data, userInfo };
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(error.response?.data?.message || "Login failed");
//     }
//     throw error;
//   }
// }


// export async function getUserInfo() {
//   try {
//     const accessToken = store.getState().auth.accessToken;
//     if (!accessToken) {
//       throw new Error("No access token found");
//     }else{
//       console.log(accessToken);
//     }

//     const response = await axios.get(`${API_CONFIG.GET_USER_INFO}`, {
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(error.response?.data?.message || "Failed to get user info");
//     }
//     throw error;
//   }
// }


// export function logout() {
//   store.dispatch(clearAuth());
// }
