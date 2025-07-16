
import { API_CONFIG } from "@/constants/api_config";
import axiosClient from "../client/axiosClient";
import { MajorModel } from "../model/model";


export const majorRepository = {
  getMajors: () => axiosClient.get(API_CONFIG.GET_MAJORS),
  addMajor: (major: MajorModel) =>
    axiosClient.post(API_CONFIG.ADD_MAJOR, {
      name: major.name,
      code: major.code,
      description: major.description,
      faculty_id: major.faculty?.id,
    }),

  updateMajor: (major: MajorModel) =>
    axiosClient.patch(API_CONFIG.UPDATE_MAJOR(major.id.toString()), {
      name: major.name,
      code: major.code,
      description: major.description,
      faculty_id: major.faculty?.id,
    }),


  deleteMajor: (majorId: string) =>
    axiosClient.delete(API_CONFIG.DELETE_MAJOR(majorId)),
};
