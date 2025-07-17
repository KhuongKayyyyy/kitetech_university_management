import { MajorModel } from "./MajorModel";

export interface FacultyModel {
  id: number;
  name: string;
  contact_info?: string;
  dean?: string;
  icon?: string;
  majors?: MajorModel[];
} 