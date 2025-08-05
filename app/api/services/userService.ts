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
      console.error("getUsers error:", error);
      
      // Handle specific error cases
      if (error.response?.status === 500) {
        toast.error("Server is currently unavailable. Please try again later.");
        throw new Error("Server error - please try again later");
      } else if (error.response?.status === 401) {
        toast.error("Authentication required. Please log in again.");
        throw new Error("Authentication required");
      } else if (error.code === "ECONNREFUSED" || error.message?.includes("Network Error")) {
        toast.error("Cannot connect to server. Please check your internet connection.");
        throw new Error("Network error - cannot connect to server");
      } else {
        handleServiceError(error, "Failed to fetch users");
        throw error;
      }
    }
  },

  getUser: async (id: string) => {
    try {
      const response = await userRepository.getUser(id);
      return response.data;
    } catch (error: any) {
      console.error("getUser error:", error);
      handleServiceError(error, "Failed to fetch user");
      throw error;
    }
  },

  addUser: async (user: UserCreateModel) => {
    try {
      const response = await userRepository.addUser(user);
      return response.data;
    } catch (error: any) {
      console.error("addUser error:", error);
      handleServiceError(error, "Failed to add user");
      throw error;
    }
  },

  updateUser: async (user: UserModel) => {
    try {
      const response = await userRepository.updateUser(user);
      return response.data;
  } catch (error: any) {
      console.error("updateUser error:", error);
      handleServiceError(error, "Failed to update user");
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    try {
      const response = await userRepository.deleteUser(id);
      return response.data;
    } catch (error: any) {
      console.error("deleteUser error:", error);
      handleServiceError(error, "Failed to delete user");
      throw error;
    }
  },
};

function handleServiceError(error: any, fallbackMessage: string) {
  const errorMessage = error.response?.data?.message || fallbackMessage;
  console.error("Service error:", errorMessage);
  toast.error(errorMessage);
  throw error;
}
