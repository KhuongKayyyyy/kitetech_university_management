import axiosClient from "../client/axiosClient";
import { API_CONFIG } from "@/constants/api_config";
import { UserCreateModel, UserModel } from "../model/UserModel";

export const userRepository = {
  getUsers: () => axiosClient.get(API_CONFIG.GET_USERS),
  getUser: (id: string) => axiosClient.get(API_CONFIG.GET_USER(id)),

  addUser: (user: UserCreateModel) =>
    axiosClient.post(API_CONFIG.ADD_USER, {
      username: user.username,
      password: user.password,
      full_name: user.full_name,
      email: user.email,
    }),

  updateUser: (user: UserModel) =>
    axiosClient.patch(API_CONFIG.UPDATE_USER(user.id?.toString() ?? ""), {
      username: user.username,
      password: user.password,
      full_name: user.full_name,
      email: user.email,
    }),

  deleteUser: (id: string) => axiosClient.delete(API_CONFIG.DELETE_USER(id)),
};



