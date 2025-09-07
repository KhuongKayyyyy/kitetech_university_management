export interface SemesterModel {
  id: number;
  academic_year_id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: 'Active' | 'Closed' | 'ExamPeriod';
  description?: string;
}