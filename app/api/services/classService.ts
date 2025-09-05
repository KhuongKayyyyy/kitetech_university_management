import { ClassModel } from "../model/ClassModel";
import { classRepository } from "../repositories/classRepository";
import { toast } from "sonner";

export const classService = {
  getClasses: async () => {
    try {
      const response = await classRepository.getClasses();    
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to fetch classes");
      throw error;
    }
  },

  getClassById: async (id: number) => {
    try {
      const response = await classRepository.getClass(id);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to fetch class");
      throw error;
    }
  },

  addClass: async (classData: ClassModel) => {
    try {
      const response = await classRepository.addClass(classData);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to add class");
      throw error;
    }
  },

  updateClass: async (classData: ClassModel) => {
    try {
      const response = await classRepository.updateClass(classData);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to update class");
      throw error;
    }
  },

  deleteClass: async (id: number) => {
    try {
      await classRepository.deleteClass(id);
      return;
    } catch (error: any) {
      handleServiceError(error, "Failed to delete class");
      throw error;
    }
  },

  downloadClassTemplate: async () => {
    try {
      const response = await classRepository.downloadClassTemplate();
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to download class template");
      throw error;
    }
  },

  importClass: async (file: File) => {
    try {
      const response = await classRepository.importClass(file);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to import class");
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
