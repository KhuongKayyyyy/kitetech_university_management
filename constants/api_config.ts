export const API_CONFIG = {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  REGISTER: "/api/auth/register",
  GET_USER_INFO: "/api/auth/current-user",

  // User
  GET_USERS: "/api/user",
  GET_USER: (id: string) => `/api/user/${id}`,
  ADD_USER: "/api/user",
  UPDATE_USER: (id: string) => `/api/user/${id}`,
  DELETE_USER: (id: string) => `/api/user/${id}`,

  // Academic Year
  GET_ACADEMIC_YEARS: "/api/academic-years",
  GET_ACADEMIC_YEAR: (id: string) => `/api/academic-years/${id}`,
  ADD_ACADEMIC_YEAR: "/api/academic-years",
  UPDATE_ACADEMIC_YEAR: (id: string) => `/api/academic-years/${id}`,
  DELETE_ACADEMIC_YEAR: (id: string) => `/api/academic-years/${id}`,

  // Semester
  GET_SEMESTERS: "/api/semesters",
  GET_SEMESTER: (id: string) => `/api/semesters/${id}`,
  ADD_SEMESTER: "/api/semesters",
  UPDATE_SEMESTER: (id: string) => `/api/semesters/${id}`,
  DELETE_SEMESTER: (id: string) => `/api/semesters/${id}`,
  GET_BY_ACADEMIC_YEAR_ID: (academic_year_id: string) => `/api/semesters/academic-year/${academic_year_id}`,

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

  // Class
  GET_CLASSES: "/api/classes",
  GET_CLASS: (id: string) => `/api/classes/${id}`,
  ADD_CLASS: "/api/classes",
  UPDATE_CLASS: (id: string) => `/api/classes/${id}`,
  DELETE_CLASS: (id: string) => `/api/classes/${id}`,

  //Student
  GET_STUDENTS: "/api/students",
  GET_STUDENT: (id: string) => `/api/students/${id}`,
  ADD_STUDENT: "/api/students",
  UPDATE_STUDENT: (id: string) => `/api/students/${id}`,
  DELETE_STUDENT: (id: string) => `/api/students/${id}`,


  // Teacher
  GET_TEACHERS: "/api/teachers",
  GET_TEACHER: (id: string) => `/api/teachers/${id}`,
  ADD_TEACHER: "/api/teachers",
  UPDATE_TEACHER: (id: string) => `/api/teachers/${id}`,
  DELETE_TEACHER: (id: string) => `/api/teachers/${id}`,
};
