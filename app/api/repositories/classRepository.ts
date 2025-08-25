import { API_CONFIG } from "@/constants/api_config";
import axiosClient from "../client/axiosClient";
import { ClassModel } from "../model/ClassModel";


export const classRepository = {
  getClasses: () =>
    axiosClient.get(API_CONFIG.GET_CLASSES),
  addClass: (classData: ClassModel) => {
    const body = {
      "major_id": classData.major_id,
      "academic_year": classData.academic_year,
      "description": classData.description
    };
    console.log(body);
    return axiosClient.post(API_CONFIG.ADD_CLASS, body);
  },
  updateClass: (classData: ClassModel) => {
    const body = {
      "major_id": classData.major_id,
      "academic_year": classData.academic_year,
      "description": classData.description
    };
    return axiosClient.put(API_CONFIG.UPDATE_CLASS(classData.id?.toString() || ""), body);
  },
  deleteClass: (id: number) => {
    return axiosClient.delete(API_CONFIG.DELETE_CLASS(id.toString()));
  },


  getClass: (id: number) =>
    axiosClient.get(API_CONFIG.GET_CLASS(id.toString())),
};