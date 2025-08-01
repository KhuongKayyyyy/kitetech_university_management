import { FacultyModel } from "../model/model";
import { departmentRepository } from "../repositories/departmentRepository";
import { toast } from "sonner";

export const departmentService = {
  getDepartments: async () => {
    try {
      const response = await departmentRepository.getDepartments();    
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to fetch departments");
      throw error;
    }
  },

  addDepartment: async (department: FacultyModel) => {
    try {
      const response = await departmentRepository.addDepartment(department);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to add department");
      throw error;
    }
  },

  updateDepartment: async (department: FacultyModel) => {
    try {
      const response = await departmentRepository.updateDepartment(department);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to update department");
      throw error;
    }
  },

  deleteDepartment: async (id: number) => {
    try {
      await departmentRepository.deleteDepartment(id);
      return;
    } catch (error: any) {
      handleServiceError(error, "Failed to delete department");
      throw error;
    }
  },
};

function handleServiceError(error: any, fallbackMessage: string) {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;

  // Example: 409 Conflict
  if (status === 409) {
    toast.error(message ?? "Conflict occurred");
  } else {
    toast.error(message ?? fallbackMessage);
  }

  console.error("Service Error:", error);
}
