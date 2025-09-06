import { API_CONFIG } from "@/constants/api_config";
import axiosClient from "../client/axiosClient";
import { RegistrationPeriod } from "../model/RegistrationPeriodModel";

export const registrationPeriodRepository = {
  getRegistrationPeriods: () =>
    axiosClient.get(API_CONFIG.GET_COURSE_REGISTRATIONS),
  
  addRegistrationPeriod: (registrationPeriodData: RegistrationPeriod) => {
    const body = {
      "semester_id": registrationPeriodData.semester_id,
      "description": registrationPeriodData.description,
      "start_date": registrationPeriodData.start_date,
      "end_date": registrationPeriodData.end_date,
      "status": registrationPeriodData.status
    };
    console.log(body);
    return axiosClient.post(API_CONFIG.ADD_COURSE_REGISTRATION, body);
  },
  
  updateRegistrationPeriod: (registrationPeriodData: RegistrationPeriod) => {
    const body = {
      "semester_id": registrationPeriodData.semester_id,
      "start_date": registrationPeriodData.start_date,
      "end_date": registrationPeriodData.end_date,
      "status": registrationPeriodData.status,
      "description": registrationPeriodData.description
    };
    return axiosClient.put(API_CONFIG.UPDATE_COURSE_REGISTRATION(registrationPeriodData.id?.toString() || ""), body);
  },
  
  deleteRegistrationPeriod: (id: number) => {
    return axiosClient.delete(API_CONFIG.DELETE_COURSE_REGISTRATION(id.toString()));
  },

  getRegistrationPeriod: (id: number) =>
    axiosClient.get(API_CONFIG.GET_COURSE_REGISTRATION(id.toString())),

  downloadRegistrationPeriodTemplate: () => axiosClient.get(API_CONFIG.DOWNLOAD_COURSE_REGISTRATION_TEMPLATE),
  
  importRegistrationPeriod: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post(API_CONFIG.IMPORT_COURSE_REGISTRATION, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  addAvailableClass: (course_registration_id: string, class_ids: number[]) => {
    return axiosClient.post(API_CONFIG.ADD_AVAILABLE_CLASS(course_registration_id), {
      class_ids: class_ids
    });
  },
  removeAvailableClass: (course_registration_id: string, class_ids: number[]) => {
    return axiosClient.delete(API_CONFIG.REMOVE_AVAILABLE_CLASS(course_registration_id), {
      data: {
        class_ids: class_ids
      }
    });
  },

  addAvailableCourse: (course_registration_id: string, courseData: {
    subject_id: number;
    description: string;
    schedules: Array<{
      sections: number;
      schedule: string;
    }>;
    start_date: string;
    end_date: string;
    max_student: number;
    location: string;
  }) => {
    return axiosClient.post(API_CONFIG.ADD_AVAILABLE_COURSE(course_registration_id), courseData);
  },
  removeAvailableCourse: (course_registration_id: string, course_ids: number[]) => {
    console.log("API call - course_registration_id:", course_registration_id);
    console.log("API call - course_ids:", course_ids);
    console.log("API endpoint:", API_CONFIG.REMOVE_AVAILABLE_COURSE(course_registration_id));
    return axiosClient.delete(API_CONFIG.REMOVE_AVAILABLE_COURSE(course_registration_id), {
      data: {
        ids: course_ids
      }
    });
  },
};
