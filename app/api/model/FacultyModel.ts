import { MajorModel } from "./MajorModel";

export interface FacultyModel {
  id: number;
  name: string;
  code?: string;
  contact_info?: string;
  dean?: string;
  icon?: string;
  majors?: MajorModel[];
} 