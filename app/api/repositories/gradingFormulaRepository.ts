import { API_CONFIG } from "@/constants/api_config";
import axiosClient from "../client/axiosClient";
import { GradingFormulaModel } from "../model/GradingFormulaModel";

export const gradingFormulaRepository = {
  getGradingFormulas: () => axiosClient.get<GradingFormulaModel[]>(API_CONFIG.GET_GRADING_FORMULAS),
  getGradingFormula: (id: string) => axiosClient.get(API_CONFIG.GET_GRADING_FORMULA(id)),

  addGradingFormula: (gradingFormula: GradingFormulaModel) =>
    axiosClient.post(API_CONFIG.ADD_GRADING_FORMULA, {
      name: gradingFormula.name,
      description: gradingFormula.description
    }),
  updateGradingFormula: (id: string, gradingFormula: GradingFormulaModel) =>
    axiosClient.patch(API_CONFIG.UPDATE_GRADING_FORMULA(id), {
      name: gradingFormula.name,
      description: gradingFormula.description
    }),

  deleteGradingFormula: (id: string) => axiosClient.delete(API_CONFIG.DELETE_GRADING_FORMULA(id)),
};
