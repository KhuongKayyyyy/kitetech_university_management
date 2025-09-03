import { API_CONFIG } from "@/constants/api_config";
import axiosClient from "../client/axiosClient";
import { Student } from "../model/StudentModel";


export const studentRepository = {
  getStudents: () =>
    axiosClient.get(API_CONFIG.GET_STUDENTS),
  addStudent: (studentData: Student) => {
    const body = {
      "full_name": studentData.full_name,
      "email": studentData.email,
      "phone": studentData.phone,
      "address": studentData.address,
      "gender": studentData.gender,
      "birth_date": studentData.birth_date,
      "class_id": studentData.class_id
    };
    console.log(body);
    return axiosClient.post(API_CONFIG.ADD_STUDENT, body);
  },
  updateStudent: (studentData: Student) => {
    const body = {
      "full_name": studentData.full_name,
      "email": studentData.email,
      "phone": studentData.phone,
      "address": studentData.address,
      "gender": studentData.gender,
      "birth_date": studentData.birth_date,
      "classes": studentData.classes
    };
    return axiosClient.put(API_CONFIG.UPDATE_STUDENT(studentData.id?.toString() || ""), body);
  },
  deleteStudent: (id: number) => {
    return axiosClient.delete(API_CONFIG.DELETE_STUDENT(id.toString()));
  },
  getStudent: (id: number) =>
    axiosClient.get(API_CONFIG.GET_STUDENT(id.toString())),

  importStudent: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post(API_CONFIG.IMPORT_STUDENT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
