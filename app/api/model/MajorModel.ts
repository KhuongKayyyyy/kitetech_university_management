export interface MajorModel {
  id: number;
  name: string;
  code?: string;
  description?: string;
  faculty?: import("./FacultyModel").FacultyModel;
} 