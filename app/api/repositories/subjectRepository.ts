import { API_CONFIG } from "@/constants/api_config";
import axios from "axios";
import { SubjectModel } from "../model/model";

export const subjectRepository = {
  getSubjects: async () => {
    const response = await axios.get(API_CONFIG.GET_SUBJECTS);
    return response.data;
  },

  getSubject: async (id: string) => {
    const response = await axios.get(API_CONFIG.GET_SUBJECT(id));
    return response.data;
  },

  addSubject: (subject: SubjectModel) =>
    axios.post(API_CONFIG.ADD_SUBJECT, {
      name: subject.name,
      credits: subject.credits,
      description: subject.description,
      gradingFormulaId: subject.gradingFormulaId,
      faculty_id: subject.faculty_id,
    }),

  updateSubject: async (id: string, subject: SubjectModel) => {
    const response = await axios.patch(API_CONFIG.UPDATE_SUBJECT(id), {
      name: subject.name,
      credits: subject.credits,
      description: subject.description,
      faculty_id: subject.faculty_id,
      gradingFormulaId: subject.gradingFormulaId,
    });
    return response.data;
  },

  deleteSubject: async (id: string) => {
    const response = await axios.delete(API_CONFIG.DELETE_SUBJECT(id));
    return response.data;
  },

  downloadSubjectTemplate: () => axios.get(API_CONFIG.DOWNLOAD_SUBJECT_TEMPLATE),
  importSubject: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(API_CONFIG.IMPORT_SUBJECT, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  
};
