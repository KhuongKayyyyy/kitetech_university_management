export interface GradingTypeModel {
  id: number;
  gradingFormulaId: number;
  gradeType: 'QT1' | 'QT2' | 'GK' | 'CK';
  weight: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type GradeTypeEnum = 'QT1' | 'QT2' | 'GK' | 'CK';

export interface CreateGradingTypeRequest {
  gradingFormulaId: number;
  gradeType: GradeTypeEnum;
  weight: number;
  description?: string;
}

export interface UpdateGradingTypeRequest {
  gradingFormulaId?: number;
  gradeType?: GradeTypeEnum;
  weight?: number;
  description?: string;
}
