export const API_CONFIG = {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  REGISTER: "/api/auth/register",
  GET_USER_INFO: "/api/auth/current-user",

  // Academic Year
  GET_ACADEMIC_YEARS: "/api/academic-years",
  GET_ACADEMIC_YEAR: (id: string) => `/api/academic-years/${id}`,
  ADD_ACADEMIC_YEAR: "/api/academic-years",
  UPDATE_ACADEMIC_YEAR: (id: string) => `/api/academic-years/${id}`,
  DELETE_ACADEMIC_YEAR: (id: string) => `/api/academic-years/${id}`,

  // Department
  GET_DEPARTMENTS: "/api/faculties",
  GET_DEPARTMENT: (id: string) => `/api/faculties/${id}`,
  ADD_DEPARTMENT: "/api/faculties",
  UPDATE_DEPARTMENT: (id: string) => `/api/faculties/${id}`,
  DELETE_DEPARTMENT: (id: string) => `/api/faculties/${id}`,

  // Major
  GET_MAJORS: "/api/majors",
  GET_MAJOR: (id: string) => `/api/majors/${id}`,
  ADD_MAJOR: "/api/majors",
  UPDATE_MAJOR: (id: string) => `/api/majors/${id}`,
  DELETE_MAJOR: (id: string) => `/api/majors/${id}`,
};
