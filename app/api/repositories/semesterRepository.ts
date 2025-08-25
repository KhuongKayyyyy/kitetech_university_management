import axiosClient from "../client/axiosClient";
import { API_CONFIG } from "@/constants/api_config";
import { SemesterModel } from "../model/SemesterModel";

export const semesterRepository = {
  getSemesters: () => axiosClient.get(API_CONFIG.GET_SEMESTERS),
  getSemester: (id: string) => axiosClient.get(API_CONFIG.GET_SEMESTER(id)),
  getByAcademicYearId: (academic_year_id: string) => axiosClient.get(API_CONFIG.GET_BY_ACADEMIC_YEAR_ID(academic_year_id)),
  addSemester: (semester: SemesterModel) => {
    const body = {
      "academic_year_id": semester.academic_year_id,
      "name": semester.name,
      "start_date": semester.start_date,
      "end_date": semester.end_date,
      "status": semester.status,
      "description": semester.description
    };
    return axiosClient.post(API_CONFIG.ADD_SEMESTER, body);
  },
  updateSemester: (id: string, semester: SemesterModel) => axiosClient.put(API_CONFIG.UPDATE_SEMESTER(id), semester),
  deleteSemester: (id: string) => axiosClient.delete(API_CONFIG.DELETE_SEMESTER(id)),
};