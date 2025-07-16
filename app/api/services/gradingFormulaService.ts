import { GradingFormulaModel } from "../model/GradingFormulaModel";
import { gradingFormulaRepository } from "../repositories/gradingFormulaRepository";
import { gradingTypeService } from "./gradingTypeService";

export const gradingFormulaService = {
  getGradingFormulas: async () => {
    const response = await gradingFormulaRepository.getGradingFormulas();
    return response.data;
  },

  addGradingFormula: async (formula: GradingFormulaModel) => {
    // First, create the grading formula
    const formulaResponse = await gradingFormulaRepository.addGradingFormula(formula);
    const createdFormula = formulaResponse.data;

    // Then, create the grading types associated with this formula
    if (formula.gradeTypes && formula.gradeTypes.length > 0) {
      const gradeTypePromises = formula.gradeTypes.map(gradeType => 
        gradingTypeService.addGradingType({
          ...gradeType,
          gradingFormulaId: createdFormula.id
        })
      );
      
      await Promise.all(gradeTypePromises);
    }

    // Return the complete formula with grade types
    return {
      ...createdFormula,
      gradeTypes: formula.gradeTypes || []
    };
  },

  updateGradingFormula: async (formula: GradingFormulaModel) => {
    // First, update the grading formula
    const formulaResponse = await gradingFormulaRepository.updateGradingFormula(formula.id.toString(), formula);
    const updatedFormula = formulaResponse.data;

    // Then, update all the grading types associated with this formula
    if (formula.gradeTypes && formula.gradeTypes.length > 0) {
      const gradeTypePromises = formula.gradeTypes.map(gradeType => 
        gradingTypeService.updateGradingType(gradeType.id.toString(), {
          ...gradeType,
          gradingFormulaId: formula.id
        })
      );
      
      await Promise.all(gradeTypePromises);
    }

    // Return the complete updated formula with grade types
    return {
      ...updatedFormula,
      gradeTypes: formula.gradeTypes || []
    };
  },

  deleteGradingFormula: async (formulaId: number | string, gradingFormula?: GradingFormulaModel) => {
    // First, delete all grading types associated with this formula
    if (gradingFormula && gradingFormula.gradeTypes && gradingFormula.gradeTypes.length > 0) {
      const deleteGradeTypePromises = gradingFormula.gradeTypes.map(gradeType =>
        gradingTypeService.deleteGradingType(gradeType.id.toString())
      );
      
      await Promise.all(deleteGradeTypePromises);
    }

    // Then, delete the grading formula itself
    const response = await gradingFormulaRepository.deleteGradingFormula(formulaId.toString());
    return response.data;
  },
};
