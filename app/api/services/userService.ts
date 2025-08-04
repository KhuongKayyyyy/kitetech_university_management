    import { toast } from "sonner";
import { userRepository } from "../repositories/userRepository";
import { UserCreateModel, UserModel } from "../model/UserModel";

export const userService = {
  getUsers: async () => {
    try {
      const response = await userRepository.getUsers();
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to fetch users");
      throw error;
    }
  },

  getUser: async (id: string) => {
    try {
      const response = await userRepository.getUser(id);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to fetch user");
      throw error;
    }
  },

  addUser: async (user: UserCreateModel) => {
    try {
      const response = await userRepository.addUser(user);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to add user");
      throw error;
    }
  },

  updateUser: async (user: UserModel) => {
    try {
      const response = await userRepository.updateUser(user);
      return response.data;
  } catch (error: any) {
      handleServiceError(error, "Failed to update user");
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    try {
      const response = await userRepository.deleteUser(id);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to delete user");
      throw error;
    }
  },
};

function handleServiceError(error: any, fallbackMessage: string) {
  toast.error(error.response?.data?.message || fallbackMessage);
  throw error;
}
