import { SemesterModel } from "../model/SemesterModel";
import { semesterRepository } from "../repositories/semesterRepository";

export const semesterService = {
  getSemesters: async () => {
    const response = await semesterRepository.getSemesters();
    return response.data;
  },

  getSemester: async (id: string) => {
    const response = await semesterRepository.getSemester(id);
    console.log("response", response);
    return response.data;
  },

  getByAcademicYearId: async (academic_year_id: string) => {
    const response = await semesterRepository.getByAcademicYearId(academic_year_id);
    return response.data;
  },

  addSemester: async (semester: SemesterModel) => {
    const response = await semesterRepository.addSemester(semester);
    return response.data;
  },

  updateSemester: async (id: string, semester: SemesterModel) => {
    const response = await semesterRepository.updateSemester(id, semester);
    return response.data;
  },

  deleteSemester: async (id: string) => {
    const response = await semesterRepository.deleteSemester(id);
    return response.data;
  },
};
