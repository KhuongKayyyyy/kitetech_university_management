export interface CurriculumModel {
  id: number;
  name: string;
  academicYear: string;
  departmentId: string;
  majorId: string;
  totalCredits?: number;
  totalCourses?: number;
}
