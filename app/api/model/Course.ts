import { SubjectModel } from "./SubjectModel";

export interface Schedule {
  sections: number;
  schedule: string;
}

export interface Course {
  subject_id: number;
  semester: string;
  description: string;
  schedules: Schedule[];
  start_date: string;
  end_date: string;
  location: string;
  enrolled: number;
  teacher_username: string;
}

export interface CourseDetailModel {
  id: number;
  name: string;
  description: string;
  credits: number;
  location: string;
  enrolled: number;
  is_active: boolean;
  semester: string;
  type: string;
  instructor: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  subject: SubjectModel;
  schedules?: Schedule[];
}


export const MOCK_AVAILABLE_SUBJECTS: Course[] = [
  {
    subject_id: 1,
    semester: "HK1 2025-2026",
    description: "Fundamentals of programming using C language.",
    schedules: [
      {
        sections: 2,
        schedule: "Monday"
      },
      {
        sections: 4,
        schedule: "Wednesday"
      }
    ],
    start_date: "2025-09-06",
    end_date: "2025-12-30",
    location: "C101",
    enrolled: 19,
    teacher_username: "tran_thi_ngoc"
  },
  {
    subject_id: 2,
    semester: "HK1 2025-2026",
    description: "Advanced mathematics for computer science.",
    schedules: [
      {
        sections: 3,
        schedule: "Tuesday"
      },
      {
        sections: 2,
        schedule: "Thursday"
      }
    ],
    start_date: "2025-09-06",
    end_date: "2025-12-30",
    location: "B205",
    enrolled: 28,
    teacher_username: "nguyen_van_duc"
  },
  {
    subject_id: 3,
    semester: "HK1 2025-2026",
    description: "Introduction to data structures and algorithms.",
    schedules: [
      {
        sections: 4,
        schedule: "Wednesday"
      },
      {
        sections: 3,
        schedule: "Friday"
      }
    ],
    start_date: "2025-09-06",
    end_date: "2025-12-30",
    location: "A301",
    enrolled: 30,
    teacher_username: "le_thi_mai"
  },
  {
    subject_id: 4,
    semester: "HK1 2025-2026",
    description: "Database management systems fundamentals.",
    schedules: [
      {
        sections: 2,
        schedule: "Thursday"
      },
      {
        sections: 3,
        schedule: "Saturday"
      }
    ],
    start_date: "2025-09-06",
    end_date: "2025-12-30",
    location: "D102",
    enrolled: 18,
    teacher_username: "pham_minh_tam"
  },
  {
    subject_id: 5,
    semester: "HK1 2025-2026",
    description: "Object-oriented programming with Java.",
    schedules: [
      {
        sections: 3,
        schedule: "Friday"
      },
      {
        sections: 2,
        schedule: "Monday"
      }
    ],
    start_date: "2025-09-06",
    end_date: "2025-12-30",
    location: "C203",
    enrolled: 42,
    teacher_username: "vo_thi_lan"
  },
  {
    subject_id: 6,
    semester: "HK1 2025-2026",
    description: "Computer networks and communications.",
    schedules: [
      {
        sections: 2,
        schedule: "Monday"
      },
      {
        sections: 3,
        schedule: "Wednesday"
      }
    ],
    start_date: "2025-09-06",
    end_date: "2025-12-30",
    location: "B104",
    enrolled: 15,
    teacher_username: "hoang_van_son"
  },
  {
    subject_id: 7,
    semester: "HK1 2025-2026",
    description: "Software engineering principles and practices.",
    schedules: [
      {
        sections: 4,
        schedule: "Tuesday"
      },
      {
        sections: 2,
        schedule: "Thursday"
      }
    ],
    start_date: "2025-09-06",
    end_date: "2025-12-30",
    location: "A105",
    enrolled: 25,
    teacher_username: "dao_thi_hong"
  },
  {
    subject_id: 8,
    semester: "HK1 2025-2026",
    description: "Web development with modern frameworks.",
    schedules: [
      {
        sections: 3,
        schedule: "Wednesday"
      },
      {
        sections: 4,
        schedule: "Friday"
      }
    ],
    start_date: "2025-09-06",
    end_date: "2025-12-30",
    location: "C304",
    enrolled: 48,
    teacher_username: "bui_minh_khoa"
  },
  {
    subject_id: 9,
    semester: "HK1 2025-2026",
    description: "Mobile application development.",
    schedules: [
      {
        sections: 2,
        schedule: "Thursday"
      },
      {
        sections: 3,
        schedule: "Saturday"
      }
    ],
    start_date: "2025-09-06",
    end_date: "2025-12-30",
    location: "D201",
    enrolled: 19,
    teacher_username: "ly_thi_thu"
  },
  {
    subject_id: 10,
    semester: "HK1 2025-2026",
    description: "Artificial intelligence and machine learning.",
    schedules: [
      {
        sections: 4,
        schedule: "Friday"
      },
      {
        sections: 2,
        schedule: "Monday"
      }
    ],
    start_date: "2025-09-06",
    end_date: "2025-12-30",
    location: "A402",
    enrolled: 27,
    teacher_username: "ngo_van_hai"
  }
];
