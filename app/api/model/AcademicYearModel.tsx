export interface AcademicYearModel {
  id: number;
  year: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const MOCK_ACADEMIC_YEARS: AcademicYearModel[] = [
  {
    id: 5,
    year: "2023-2024",
    start_date: "2023-09-01",
    end_date: "2024-06-30",
    status: "active",
    created_at: "2023-08-15T08:00:00Z",
    updated_at: "2023-08-15T08:00:00Z",
  },
  {
    id: 4,
    year: "2022-2023",
    start_date: "2022-09-01",
    end_date: "2023-06-30",
    status: "completed",
    created_at: "2022-08-15T08:00:00Z",
    updated_at: "2022-08-15T08:00:00Z",
  },
  {
    id: 3,
    year: "2021-2022",
    start_date: "2021-09-01",
    end_date: "2022-06-30",
    status: "completed",
    created_at: "2021-08-15T08:00:00Z",
    updated_at: "2021-08-15T08:00:00Z",
  },
  {
    id: 2,
    year: "2020-2021",
    start_date: "2020-09-01",
    end_date: "2021-06-30",
    status: "completed",
    created_at: "2020-08-15T08:00:00Z",
    updated_at: "2020-08-15T08:00:00Z",
  },
  {
    id: 1,
    year: "2019-2020",
    start_date: "2019-09-01",
    end_date: "2020-06-30",
    status: "completed",
    created_at: "2019-08-15T08:00:00Z",
    updated_at: "2019-08-15T08:00:00Z",
  },
];
