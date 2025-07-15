
import { API_CONFIG } from "@/constants/api_config";
import axiosClient from "../client/axiosClient";
import { AcademicYearModel } from "../model/AcademicYearModel";


export const academicYearRepository = {
  getAcademicYears: () =>
    axiosClient.get(API_CONFIG.GET_ACADEMIC_YEARS),
  addAcademicYear: (academicYear: AcademicYearModel) => {
    const body = {
      "year": academicYear.year,
      "start_date": academicYear.start_date,
      "end_date": academicYear.end_date,
      "status": academicYear.status
    };
    console.log(body);
    return axiosClient.post(API_CONFIG.ADD_ACADEMIC_YEAR, body);
  },


  getAcademicYear: (id: number) =>
    axiosClient.get(API_CONFIG.GET_ACADEMIC_YEAR.replace(":id", id.toString())),
};