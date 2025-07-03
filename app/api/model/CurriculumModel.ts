export interface CurriculumModel {
  id: number;
  name: string;
  academicYear: string;
  department: string;
  major: string;
  totalCredits?: number;
  totalCourses?: number;
}
