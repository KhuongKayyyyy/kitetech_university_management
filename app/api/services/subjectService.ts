import { subjectRepository } from "../repositories/subjectRepository";
import { SubjectModel } from "../model/model";
import { toast } from "sonner";

export const subjectService = {
  getSubjects: async (): Promise<SubjectModel[]> => {
    const data = await subjectRepository.getSubjects();
    let dataArray = data;
    
    if (data && data.data && Array.isArray(data.data)) {
      dataArray = data.data;
    }
    
    if (!Array.isArray(dataArray)) {
      console.error("Expected array but got:", typeof dataArray, dataArray);
      throw new Error(`Expected array of subjects, got ${typeof dataArray}`);
    }
    
    return dataArray;
  },


  getSubject: async (id: string): Promise<SubjectModel> => {
    const data = await subjectRepository.getSubject(id);
    return data;
  },

  addSubject: async (subjectData: Omit<SubjectModel, "id">): Promise<SubjectModel> => {
    try {
      console.log("Adding subject with data:", subjectData);
      const response = await subjectRepository.addSubject(subjectData as any);
      console.log("Subject added successfully, response:", response);
      return response.data;
    } catch (error: any) {
      handleServiceError(error, "Failed to add subject");
      throw error;
    }
  },

  updateSubject: async (id: string, subject: SubjectModel): Promise<SubjectModel> => {
    try {
      const response = await subjectRepository.updateSubject(id, subject);
      return response;
    } catch (error: any) {
      handleServiceError(error, "Failed to update subject");
      throw error;
    }
  },

  deleteSubject: async (id: string): Promise<void> => {
    try {
      await subjectRepository.deleteSubject(id);
    } catch (error: any) {
      handleServiceError(error, "Failed to delete subject");
      throw error;
    }
  },
};

function handleServiceError(error: any, fallbackMessage: string) {
  toast.error(error.response?.data?.message || fallbackMessage);
  throw error;
}
