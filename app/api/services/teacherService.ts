import { Teacher } from "../model/TeacherModel";
import { teacherRepository } from "../repositories/teacherRepository";
import { toast } from "sonner";

export const teacherService = {
  getTeachers: async () => {
    try {
      const response = await teacherRepository.getTeachers();    
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to fetch teachers");
      throw error;
    }
  },

  getTeacherById: async (id: number) => {
    try {
      const response = await teacherRepository.getTeacher(id);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to fetch teacher");
      throw error;
    }
  },

  addTeacher: async (teacherData: Teacher) => {
    try {
      const response = await teacherRepository.addTeacher(teacherData);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to add teacher");
      throw error;
    }
  },

  updateTeacher: async (teacherData: Teacher) => {
    try {
      const response = await teacherRepository.updateTeacher(teacherData);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to update teacher");
      throw error;
    }
  },

  deleteTeacher: async (id: number) => {
    try {
      await teacherRepository.deleteTeacher(id);
      return;
    } catch (error: any) {
      handleServiceError(error, "Failed to delete teacher");
      throw error;
    }
  },

  importTeacher: async (file: File) => {
    try {
      const response = await teacherRepository.importTeacher(file);
      console.log("Raw API response:", response);
      console.log("Response data:", response.data);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to import teacher");
      throw error;
    }
  },

  downloadTeacherTemplate: async () => {
    try {
      const response = await teacherRepository.downloadTeacherTemplate();
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to download teacher template");
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
