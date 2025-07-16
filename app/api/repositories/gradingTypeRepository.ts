import { API_CONFIG } from "@/constants/api_config";
import axiosClient from "../client/axiosClient";
import { GradingTypeModel } from "../model/GradingTypeModel";

export const gradingTypeRepository = {
  getGradingTypes: () => axiosClient.get<GradingTypeModel[]>(API_CONFIG.GET_GRADING_TYPES),

  getGradingType: (id: string) => axiosClient.get(API_CONFIG.GET_GRADING_TYPE(id)),

  addGradingType: (gradingType: GradingTypeModel) => axiosClient.post(API_CONFIG.ADD_GRADING_TYPE, {
    gradeType: gradingType.gradeType, // QT1, QT2, GK, CK
    weight: gradingType.weight,
    description: gradingType.description,
    gradingFormulaId: gradingType.gradingFormulaId
  }),

  updateGradingType: (id: string, gradingType: GradingTypeModel) =>
    axiosClient.patch(API_CONFIG.UPDATE_GRADING_TYPE(id), {
      gradeType: gradingType.gradeType, // QT1, QT2, GK, CK
      weight: gradingType.weight,
      description: gradingType.description,
      gradingFormulaId: gradingType.gradingFormulaId
    }),

  deleteGradingType: (id: string) => axiosClient.delete(API_CONFIG.DELETE_GRADING_TYPE(id)),
};
