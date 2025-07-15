
import { API_CONFIG } from "@/constants/api_config";
import axiosClient from "../client/axiosClient";
import { DepartmentModel } from "../model/model";


export const departmentRepository = {
  getDepartments: () =>
    axiosClient.get(API_CONFIG.GET_DEPARTMENTS),

  addDepartment: (department: DepartmentModel) => {
    const body = {
      "name": department.name,
      "dean": department.dean,
      "contact_info": department.contact_info
    };
    return axiosClient.post(API_CONFIG.ADD_DEPARTMENT, body);
  },

  updateDepartment: (department: DepartmentModel) => {
    const body = {
      "name": department.name,
      "dean": department.dean,
      "contact_info": department.contact_info
    };
    return axiosClient.patch(API_CONFIG.UPDATE_DEPARTMENT(department.id.toString()), body);
  },

  deleteDepartment: (id: number) => {
    return axiosClient.delete(API_CONFIG.DELETE_DEPARTMENT(id.toString()));
  },
};