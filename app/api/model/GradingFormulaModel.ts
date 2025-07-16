import { GradingTypeModel } from "./GradingTypeModel";

export interface GradingFormulaModel {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  gradeTypes: GradingTypeModel[];
}


