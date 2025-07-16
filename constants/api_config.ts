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

  // Grading Formula
  GET_GRADING_FORMULAS: "/api/grading-formulas",
  GET_GRADING_FORMULA: (id: string) => `/api/grading-formulas/${id}`,
  ADD_GRADING_FORMULA: "/api/grading-formulas",
  UPDATE_GRADING_FORMULA: (id: string) => `/api/grading-formulas/${id}`,
  DELETE_GRADING_FORMULA: (id: string) => `/api/grading-formulas/${id}`,

  // Grading Type
  GET_GRADING_TYPES: "/api/grade-types",
  GET_GRADING_TYPE: (id: string) => `/api/grade-types/${id}`,
  ADD_GRADING_TYPE: "/api/grade-types",
  UPDATE_GRADING_TYPE: (id: string) => `/api/grade-types/${id}`,
  DELETE_GRADING_TYPE: (id: string) => `/api/grade-types/${id}`,

  // Subject
  GET_SUBJECTS: "/api/subjects",
  GET_SUBJECT: (id: string) => `/api/subjects/${id}`,
  ADD_SUBJECT: "/api/subjects",
  UPDATE_SUBJECT: (id: string) => `/api/subjects/${id}`,
  DELETE_SUBJECT: (id: string) => `/api/subjects/${id}`,
};
