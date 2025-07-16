import { GradingTypeModel } from "../model/GradingTypeModel";
import { gradingTypeRepository } from "../repositories/gradingTypeRepository";

export const gradingTypeService = {
  getGradingTypes: async () => {
    const response = await gradingTypeRepository.getGradingTypes();
    return response.data;
  },
  
  getGradingType: async (id: string) => {
    const response = await gradingTypeRepository.getGradingType(id);
    return response.data;
  },
  
  addGradingType: async (gradingType: GradingTypeModel) => {
    const response = await gradingTypeRepository.addGradingType(gradingType);
    return response.data;
  },

  updateGradingType: async (id: string, gradingType: GradingTypeModel) => {
    const response = await gradingTypeRepository.updateGradingType(id, gradingType);
    return response.data;
  },

  deleteGradingType: async (id: string) => {
    const response = await gradingTypeRepository.deleteGradingType(id);
    return response.data;
  },
  
};
