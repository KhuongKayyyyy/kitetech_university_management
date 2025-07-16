import { GradingFormulaModel } from "./GradingFormulaModel";

export interface Teacher {
  id: number;
  name: string;
  username?: string;
}
export interface SubjectModel {
  id: string;
  name: string;
  credits: number;
  description?: string;
  faculty_id: number;
  gradingFormulaId: number;
  gradingFormula?: GradingFormulaModel;
}

export interface MajorModel {
  id: number;
  name: string;
  code?: string;
  description?: string;
  faculty?: FacultyModel;
}
export interface FacultyModel {
  id: number;
  name: string;
  contact_info?: string;
  dean?: string;
  icon?: string;
  majors?: MajorModel[];
}

export interface Teacher {
  id: number;
  name: string;
  location: string;
  birthday: string;
  majorId: number;
  departmentId: number;
  isActivated: boolean;
  teacherEmail: string;
}

export interface Student {
  id: number;
  name: string;
  username?: string;
  classId: number;
  majorId: number;
  departmentId: number;
  location: string;
  birthday: string;
  isActivated: boolean;
  studentEmail: string;
  studentId: string;
}

