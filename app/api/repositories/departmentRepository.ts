
import { API_CONFIG } from "@/constants/api_config";
import axiosClient from "../client/axiosClient";
import { FacultyModel } from "../model/model";


export const departmentRepository = {
  getDepartments: () =>
    axiosClient.get(API_CONFIG.GET_DEPARTMENTS),

  getDepartmentById: (id: number) => {
    return axiosClient.get(API_CONFIG.GET_DEPARTMENT(id.toString()));
  },

  addDepartment: (department: FacultyModel) => {
    const body = {
      "name": department.name,
      "dean": department.dean,
      "contact_info": department.contact_info,
      "code": department.code
    };
    return axiosClient.post(API_CONFIG.ADD_DEPARTMENT, body);
  },

  updateDepartment: (department: FacultyModel) => {
    const body = {
      "name": department.name,
      "dean": department.dean,
      "contact_info": department.contact_info,
      "code": department.code
    };
    return axiosClient.patch(API_CONFIG.UPDATE_DEPARTMENT(department.id.toString()), body);
  },

  deleteDepartment: (id: number) => {
    return axiosClient.delete(API_CONFIG.DELETE_DEPARTMENT(id.toString()));
  },

  downloadDepartmentTemplate: () => {
    return axiosClient.get(API_CONFIG.DOWNLOAD_DEPARTMENT_TEMPLATE);
  },

  importDepartment: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post(API_CONFIG.IMPORT_DEPARTMENT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};