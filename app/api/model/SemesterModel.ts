export interface SemesterModel {
  id: number;
  academic_year_id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: 'Active' | 'Closed' | 'ExamPeriod';
  description?: string;
}

export const MOCK_SEMESTERS: SemesterModel[] = [
  {
    id: 1,
    academic_year_id: 5,
    name: "Semester 1 2024-2025",
    start_date: "2023-09-01",
    end_date: "2023-12-31",
    status: "Active",
    description: "Fall semester of academic year 2023-2024"
  },
  {
    id: 2, 
    academic_year_id: 5,
    name: "Semester 2 2024-2025",
    start_date: "2024-01-15",
    end_date: "2024-05-15",
    status: "Active",
    description: "Spring semester of academic year 2023-2024"
  },
  {
    id: 3,
    academic_year_id: 4,
    name: "Semester 1 2023-2024",
    start_date: "2022-09-01", 
    end_date: "2022-12-31",
    status: "Closed",
    description: "Fall semester of academic year 2022-2023"
  },
  {
    id: 4,
    academic_year_id: 4, 
    name: "Semester 2 2023-2024",
    start_date: "2023-01-15",
    end_date: "2023-05-15",
    status: "Closed",
    description: "Spring semester of academic year 2022-2023"
  }
];
