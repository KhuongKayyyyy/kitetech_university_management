import { API_CONFIG } from "@/constants/api_config";
import axiosClient from "../client/axiosClient";
import { Teacher } from "../model/TeacherModel";


export const teacherRepository = {
  getTeachers: () =>
    axiosClient.get(API_CONFIG.GET_TEACHERS),
  addTeacher: (teacherData: Teacher) => {
    const body = {
      "full_name": teacherData.full_name,
      "email": teacherData.email,
      "phone": teacherData.phone,
      "address": teacherData.address,
      "gender": teacherData.gender,
      "birth_date": teacherData.birth_date,
      "qualification": teacherData.qualification,
      "department": teacherData.department,
      "faculty_id": teacherData.faculty_id
    };
    console.log(body);
    return axiosClient.post(API_CONFIG.ADD_TEACHER, body);
  },
  updateTeacher: (teacherData: Teacher) => {
    const body = {
      "full_name": teacherData.full_name,
      "email": teacherData.email,
      "phone": teacherData.phone,
      "address": teacherData.address,
      "gender": teacherData.gender,
      "birth_date": teacherData.birth_date,
      "qualification": teacherData.qualification,
      "department": teacherData.department,
      "faculty": teacherData.faculty
    };
    return axiosClient.put(API_CONFIG.UPDATE_TEACHER(teacherData.id?.toString() || ""), body);
  },
  deleteTeacher: (id: number) => {
    return axiosClient.delete(API_CONFIG.DELETE_TEACHER(id.toString()));
  },


  getTeacher: (id: number) =>
    axiosClient.get(API_CONFIG.GET_TEACHER(id.toString())),
};
