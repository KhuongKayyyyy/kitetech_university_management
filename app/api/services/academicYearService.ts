import { AcademicYearModel } from "../model/AcademicYearModel";
import { academicYearRepository } from "../repositories/academicYearRepository";

export const academicYearService = {
  getAcademicYears: async () => {
    const response = await academicYearRepository.getAcademicYears();
    return response.data;
  },

  getAcademicYear: async (id: number) => {
    const response = await academicYearRepository.getAcademicYear(id);
    console.log("response", response);
    return response.data;
  },

  addAcademicYear: async (academicYear: AcademicYearModel) => {
    const response = await academicYearRepository.addAcademicYear(academicYear);
    return response.data;
  },


};
