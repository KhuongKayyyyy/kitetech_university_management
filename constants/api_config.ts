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
  DOWNLOAD_DEPARTMENT_TEMPLATE: "/api/faculties/excel/template",
  IMPORT_DEPARTMENT: "/api/faculties/excel/import",
  

  // Major
  GET_MAJORS: "/api/majors",
  GET_MAJOR: (id: string) => `/api/majors/${id}`,
  ADD_MAJOR: "/api/majors",
  UPDATE_MAJOR: (id: string) => `/api/majors/${id}`,
  DELETE_MAJOR: (id: string) => `/api/majors/${id}`,
  DOWNLOAD_MAJOR_TEMPLATE: "/api/majors/excel/template",
  IMPORT_MAJOR: "/api/majors/excel/import",

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
  DOWNLOAD_SUBJECT_TEMPLATE: "/api/subjects/excel/template",
  IMPORT_SUBJECT: "/api/subjects/excel/import",

  // Class
  GET_CLASSES: "/api/classes",
  GET_CLASS: (id: string) => `/api/classes/${id}`,
  ADD_CLASS: "/api/classes",
  UPDATE_CLASS: (id: string) => `/api/classes/${id}`,
  DELETE_CLASS: (id: string) => `/api/classes/${id}`,
  DOWNLOAD_CLASS_TEMPLATE: "/api/classes/excel/template",
  IMPORT_CLASS: "/api/classes/excel/import",

  //Student
  GET_STUDENTS: "/api/students",
  GET_STUDENT: (id: string) => `/api/students/${id}`,
  ADD_STUDENT: "/api/students",
  UPDATE_STUDENT: (id: string) => `/api/students/${id}`,
  DELETE_STUDENT: (id: string) => `/api/students/${id}`,
  DOWNLOAD_STUDENT_TEMPLATE: "/api/students/excel/template",
  IMPORT_STUDENT: "/api/students/excel/import",
  GET_STUDENT_BY_CLASS_ID: (class_id: string) => `/api/students/class/${class_id}`,


  // Teacher
  GET_TEACHERS: "/api/teachers",
  GET_TEACHER: (id: string) => `/api/teachers/${id}`,
  ADD_TEACHER: "/api/teachers",
  UPDATE_TEACHER: (id: string) => `/api/teachers/${id}`,
  DELETE_TEACHER: (id: string) => `/api/teachers/${id}`,
  DOWNLOAD_TEACHER_TEMPLATE: "/api/teachers/excel/template",
  IMPORT_TEACHER: "/api/teachers/excel/import",


  // Course - this is for class in semester:
  GET_COURSES: "/api/classrooms",
  GET_COURSE: (id: string) => `/api/classrooms/${id}/admin`,
  GET_COURSE_SCORE_BY_COURSE_ID: (course_id: string) => `/api/classrooms/${course_id}/grades`,
  ADD_COURSE: "/api/classrooms",
  UPDATE_COURSE: (id: string) => `/api/classrooms/${id}`,
  DELETE_COURSE: (id: string) => `/api/classrooms/${id}`,
  DOWNLOAD_COURSE_TEMPLATE: "/api/classrooms/excel/template",
  IMPORT_COURSE: "/api/classrooms/excel/import",
  GET_AVAILABLE_STUDENTS_TO_ADD_TO_COURSE: (course_id: string) => `/api/classrooms/${course_id}/available-users?role=STUDENT`,
  ADD_STUDENTS_TO_COURSE: (course_id: string) => `/api/classrooms/${course_id}/members`,
  DOWNLOAD_STUDENTS_TO_COURSE_TEMPLATE: (course_id: string) => `/api/classrooms/${course_id}/students/excel/template`,
  IMPORT_STUDENTS_TO_COURSE: "/api/classrooms/excel/import",

  // course registration
  GET_COURSE_REGISTRATIONS: "/api/course-registration-management",
  GET_COURSE_REGISTRATION: (id: string) => `/api/course-registration-management/${id}`,
  ADD_COURSE_REGISTRATION: "/api/course-registration-management",
  UPDATE_COURSE_REGISTRATION: (id: string) => `/api/course-registration-management/${id}`,
  DELETE_COURSE_REGISTRATION: (id: string) => `/api/course-registration-management/${id}`,
  DOWNLOAD_COURSE_REGISTRATION_TEMPLATE: "/api/course-registration-management/excel/template",
  IMPORT_COURSE_REGISTRATION: "/api/course-registration-management/excel/import",
  ADD_AVAILABLE_CLASS: (course_registration_id: string) => `/api/course-registration-management/${course_registration_id}/classes`,
  REMOVE_AVAILABLE_CLASS: (course_registration_id: string) => `/api/course-registration-management/${course_registration_id}/classes`,
  ADD_AVAILABLE_COURSE: (course_registration_id: string) => `/api/course-registration-management/${course_registration_id}/subjects`,  
  REMOVE_AVAILABLE_COURSE: (course_registration_id: string) => `/api/course-registration-management/${course_registration_id}/subjects`,
};
