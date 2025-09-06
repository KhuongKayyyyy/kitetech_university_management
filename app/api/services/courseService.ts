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
};

