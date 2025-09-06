import { API_CONFIG } from "@/constants/api_config";
import axiosClient from "../client/axiosClient";
import { Course } from "../model/Course";

export const courseRepository = {
  getSubjectClasses: () =>
    axiosClient.get(API_CONFIG.GET_COURSES),
  addSubjectClass: (subjectClassData: Course) => {
    const body = {
      "subject_id": subjectClassData.subject_id,
      "semester": subjectClassData.semester,
      "description": subjectClassData.description,
      "schedules": subjectClassData.schedules,
      "start_date": subjectClassData.start_date,
      "end_date": subjectClassData.end_date,
      "location": subjectClassData.location,
      "enrolled": subjectClassData.enrolled,
      "teacher_username": subjectClassData.teacher_username
    };
    console.log(body);
    return axiosClient.post(API_CONFIG.ADD_COURSE, body);
  },
  updateSubjectClass: (subjectClassData: Course) => {
    const body = {
      "subject_id": subjectClassData.subject_id,
      "semester": subjectClassData.semester,
      "description": subjectClassData.description,
      "schedules": subjectClassData.schedules,
      "start_date": subjectClassData.start_date,
      "end_date": subjectClassData.end_date,
      "location": subjectClassData.location,
      "enrolled": subjectClassData.enrolled,
      "teacher_username": subjectClassData.teacher_username
    };
    return axiosClient.put(API_CONFIG.UPDATE_COURSE(subjectClassData.subject_id?.toString() || ""), body);
  },
  deleteSubjectClass: (id: number) => {
    return axiosClient.delete(API_CONFIG.DELETE_COURSE(id.toString()));
  },

  getSubjectClass: (id: number) =>
    axiosClient.get(API_CONFIG.GET_COURSE(id.toString())),

  downloadSubjectClassTemplate: () => axiosClient.get(API_CONFIG.DOWNLOAD_COURSE_TEMPLATE),
  importSubjectClass: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post(API_CONFIG.IMPORT_COURSE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  
};