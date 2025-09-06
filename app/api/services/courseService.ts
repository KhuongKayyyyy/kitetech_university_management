import { Course } from "../model/Course";
import { courseRepository } from "../repositories/courseRepository";

export const subjectClassService = {
  getSubjectClasses: async () => {
    const response = await courseRepository.getSubjectClasses();
    return response.data;
  },
  addSubjectClass: async (subjectClass: Course) => {
    const response = await courseRepository.addSubjectClass(subjectClass);
    return response.data;
  },
  updateSubjectClass: async (subjectClass: Course) => {
    const response = await courseRepository.updateSubjectClass(subjectClass);
    return response.data;
  },
  deleteSubjectClass: async (id: number) => {
    const response = await courseRepository.deleteSubjectClass(id);
    return response.data;
  },
  getSubjectClass: async (id: number) => {
    const response = await courseRepository.getSubjectClass(id);
    return response.data;
  },
  downloadSubjectClassTemplate: async () => {
    const response = await courseRepository.downloadSubjectClassTemplate();
    return response.data;
  },
  importSubjectClass: async (file: File) => {
    const response = await courseRepository.importSubjectClass(file);
    return response.data;
  },

  getCourseScoreByCourseId: async (course_id: number) => {
    const response = await courseRepository.getCourseScoreByCourseId(course_id);
    return response.data;
  },
  
  updateCourseScore: async (scoreId: number, scoreData: Partial<{ qt1Grade: string; qt2Grade: string; midtermGrade: string; finalGrade: string }>) => {
    const response = await courseRepository.updateCourseScore(scoreId, scoreData);
    return response.data;
  },

  getAvailableStudentsToAddToCourse: async (course_id: number) => {
    const response = await courseRepository.getAvailableStudentsToAddToCourse(course_id);
    return response.data;
  },

  addStudentsToCourse: async (course_id: number, studentUsernames: string[]) => {
    const response = await courseRepository.addStudentsToCourse(course_id, studentUsernames);
    return response.data;
  },

  downloadStudentsTemplate: async (course_id: number) => {
    const response = await courseRepository.downloadStudentsTemplate(course_id);
    return response.data;
  },

  importStudentsToCourse: async (file: File) => {
    const response = await courseRepository.importStudentsToCourse(file);
    return response.data;
  },
};

