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
    
    getCourseScoreByCourseId: (course_id: number) =>
      axiosClient.get(API_CONFIG.GET_COURSE_SCORE_BY_COURSE_ID(course_id.toString())),
    
    updateCourseScore: (scoreId: number, scoreData: Partial<{ qt1Grade: string; qt2Grade: string; midtermGrade: string; finalGrade: string }>) => {
      const body = {
        qt1Grade: scoreData.qt1Grade,
        qt2Grade: scoreData.qt2Grade,
        midtermGrade: scoreData.midtermGrade,
        finalGrade: scoreData.finalGrade,
      };
      return axiosClient.put(`/api/classrooms/scores/${scoreId}`, body);
    },

    getAvailableStudentsToAddToCourse: (course_id: number) =>
      axiosClient.get(API_CONFIG.GET_AVAILABLE_STUDENTS_TO_ADD_TO_COURSE(course_id.toString())),

    addStudentsToCourse: (course_id: number, studentUsernames: string[]) => {
      const body = {
        "usernames": studentUsernames,
        "role": "Student"
      };
      return axiosClient.post(API_CONFIG.ADD_STUDENTS_TO_COURSE(course_id.toString()), body);
    },

    downloadStudentsTemplate: (course_id: number) => axiosClient.get(API_CONFIG.DOWNLOAD_STUDENTS_TO_COURSE_TEMPLATE(course_id.toString())),
    importStudentsToCourse: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return axiosClient.post(API_CONFIG.IMPORT_STUDENTS_TO_COURSE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },

  };