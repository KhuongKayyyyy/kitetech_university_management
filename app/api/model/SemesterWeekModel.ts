export interface SemesterWeekModel {
  id?: number;
  semester_id?: number;
  week_number?: number;
  start_date?: string;
  end_date?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}


export const MOCK_SEMESTER_WEEKS: SemesterWeekModel[] = [
  {
    id: 1,
    semester_id: 1,
    week_number: 1,
    start_date: "2024-02-05",
    end_date: "2024-02-11",
    description: "Week 1 - Course Introduction and Orientation",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
  },
  {
    id: 2,
    semester_id: 1,
    week_number: 2,
    start_date: "2024-02-12",
    end_date: "2024-02-18",
    description: "Week 2 - Fundamental Concepts",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
  },
  {
    id: 3,
    semester_id: 1,
    week_number: 3,
    start_date: "2024-02-19",
    end_date: "2024-02-25",
    description: "Week 3 - Core Theory and Practice",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
  },
  {
    id: 4,
    semester_id: 1,
    week_number: 4,
    start_date: "2024-02-26",
    end_date: "2024-03-03",
    description: "Week 4 - Advanced Topics",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
  },
  {
    id: 5,
    semester_id: 1,
    week_number: 5,
    start_date: "2024-03-04",
    end_date: "2024-03-10",
    description: "Week 5 - Practical Applications",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
  },
  {
    id: 6,
    semester_id: 1,
    week_number: 6,
    start_date: "2024-03-11",
    end_date: "2024-03-17",
    description: "Week 6 - Case Studies and Analysis",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
  },
  {
    id: 7,
    semester_id: 1,
    week_number: 7,
    start_date: "2024-03-18",
    end_date: "2024-03-24",
    description: "Week 7 - Mid-term Preparation",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
  },
  {
    id: 8,
    semester_id: 1,
    week_number: 8,
    start_date: "2024-03-25",
    end_date: "2024-03-31",
    description: "Week 8 - Mid-term Examinations",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
  },
  {
    id: 9,
    semester_id: 2,
    week_number: 1,
    start_date: "2024-08-26",
    end_date: "2024-09-01",
    description: "Week 1 - Semester Kickoff",
    created_at: "2024-08-01T08:00:00Z",
    updated_at: "2024-08-01T08:00:00Z",
  },
  {
    id: 10,
    semester_id: 2,
    week_number: 2,
    start_date: "2024-09-02",
    end_date: "2024-09-08",
    description: "Week 2 - Building Foundations",
    created_at: "2024-08-01T08:00:00Z",
    updated_at: "2024-08-01T08:00:00Z",
  },
  {
    id: 11,
    semester_id: 2,
    week_number: 3,
    start_date: "2024-09-09",
    end_date: "2024-09-15",
    description: "Week 3 - Deep Dive into Concepts",
    created_at: "2024-08-01T08:00:00Z",
    updated_at: "2024-08-01T08:00:00Z",
  },
  {
    id: 12,
    semester_id: 2,
    week_number: 4,
    start_date: "2024-09-16",
    end_date: "2024-09-22",
    description: "Week 4 - Research Methods",
    created_at: "2024-08-01T08:00:00Z",
    updated_at: "2024-08-01T08:00:00Z",
  },
  {
    id: 13,
    semester_id: 3,
    week_number: 1,
    start_date: "2024-01-08",
    end_date: "2024-01-14",
    description: "Week 1 - New Year Intensive",
    created_at: "2023-12-15T08:00:00Z",
    updated_at: "2023-12-15T08:00:00Z",
  },
  {
    id: 14,
    semester_id: 3,
    week_number: 2,
    start_date: "2024-01-15",
    end_date: "2024-01-21",
    description: "Week 2 - Accelerated Learning",
    created_at: "2023-12-15T08:00:00Z",
    updated_at: "2023-12-15T08:00:00Z",
  },
  {
    id: 15,
    semester_id: 3,
    week_number: 3,
    start_date: "2024-01-22",
    end_date: "2024-01-28",
    description: "Week 3 - Project Development",
    created_at: "2023-12-15T08:00:00Z",
    updated_at: "2023-12-15T08:00:00Z",
  },
];
