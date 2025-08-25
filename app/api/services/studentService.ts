import { Student } from "../model/StudentModel";
import { studentRepository } from "../repositories/studentRepository";
import { toast } from "sonner";

export const studentService = {
  getStudents: async () => {
    try {
      const response = await studentRepository.getStudents();    
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to fetch students");
      throw error;
    }
  },

  getStudentById: async (id: number) => {
    try {
      const response = await studentRepository.getStudent(id);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to fetch student");
      throw error;
    }
  },

  addStudent: async (studentData: Student) => {
    try {
      const response = await studentRepository.addStudent(studentData);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to add student");
      throw error;
    }
  },

  updateStudent: async (studentData: Student) => {
    try {
      const response = await studentRepository.updateStudent(studentData);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to update student");
      throw error;
    }
  },

  deleteStudent: async (id: number) => {
    try {
      await studentRepository.deleteStudent(id);
      return;
    } catch (error: any) {
      handleServiceError(error, "Failed to delete student");
      throw error;
    }
  },
};

function handleServiceError(error: any, fallbackMessage: string) {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;

  // Example: 409 Conflict
  if (status === 409) {
    toast.error(message ?? "Conflict occurred");
  } else {
    toast.error(message ?? fallbackMessage);
  }

  console.error("Service Error:", error);
}
