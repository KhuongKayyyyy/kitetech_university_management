import { toast } from "sonner";
import { majorRepository } from "../repositories/majorRepository";
import { MajorModel } from "../model/model";

export const majorService = {
  getMajors: async () => {
    try {
      const response = await majorRepository.getMajors();
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to fetch majors");
      throw error;
    }
  },

  addMajor: async (major: MajorModel) => {
    try {
      const response = await majorRepository.addMajor(major);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to add major");
      throw error;
    }
  },

  updateMajor: async (major: MajorModel) => {
    try {
      console.log(major);
      const response = await majorRepository.updateMajor(major);
      console.log(response);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to update major");
      throw error;
    }
  },

  deleteMajor: async (majorId: string) => {
    try {
      const response = await majorRepository.deleteMajor(majorId);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to delete majors");
      throw error;
    }
  },
};

function handleServiceError(error: any, fallbackMessage: string) {
  toast.error(error.response?.data?.message || fallbackMessage);
  throw error;
}