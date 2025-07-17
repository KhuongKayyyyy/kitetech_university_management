import { GradingFormulaModel } from "./GradingFormulaModel";

export interface SubjectModel {
  id: string;
  name: string;
  credits: number;
  description?: string;
  faculty_id: number;
  gradingFormulaId: number;
  gradingFormula?: GradingFormulaModel;
} 