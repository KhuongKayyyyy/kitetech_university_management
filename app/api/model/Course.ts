import { SubjectModel } from "./SubjectModel";

export interface Schedule {
  id: number;
  sections: number;
  schedule: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  subject_id: number;
  subject_name: string;
  semester: string;
  description: string;
  schedules: Schedule[];
  start_date: string;
  end_date: string;
  location: string;
  enrolled: number;
  max_student: number;
  teacher_username: string;
}

export interface CourseMember {
  id: number;
  classroom_id: number;
  user_id: number;
  role: string;
  joined_at: string;
  is_active: boolean;
  user: {
    id: number;
    username: string;
    password: string;
    role: string;
    full_name: string;
    email: string;
    isActive: boolean;
    isDeleted: boolean;
    faculty_id: number;
    created_at: string;
    updated_at: string;
  };
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
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  schedules: Schedule[];
  subject: SubjectModel;
  members: CourseMember[];
}


export const MOCK_AVAILABLE_SUBJECTS: Course[] = [
  {
    id: 1,
    subject_id: 1,
    subject_name: "Introduction to Programming",
    semester: "HK1 2025-2026",
    description: "Fundamentals of programming using C language.",
    schedules: [
      {
        id: 1,
        sections: 2,
        schedule: "Monday",
        created_at: "2025-09-06T11:09:14.752Z",
        updated_at: "2025-09-06T11:09:14.752Z"
      },
      {
        id: 2,
        sections: 4,
        schedule: "Wednesday",
        created_at: "2025-09-06T11:09:14.752Z",
        updated_at: "2025-09-06T11:09:14.752Z"
      }
    ],
    start_date: "2025-09-06",
    end_date: "2025-12-30",
    location: "C101",
    enrolled: 19,
    max_student: 30
  },
  {
    id: 2,
    subject_id: 2,
    subject_name: "Advanced Mathematics",
    semester: "HK1 2025-2026",
    description: "Advanced mathematics for computer science.",
    schedules: [
      {
        id: 5,
        sections: 3,
        schedule: "Tuesday",
        created_at: "2025-09-06T11:09:14.752Z",
        updated_at: "2025-09-06T11:09:14.752Z"
      },
      {
        id: 6,
        sections: 2,
        schedule: "Thursday",
        created_at: "2025-09-06T11:09:14.752Z",
        updated_at: "2025-09-06T11:09:14.752Z"
      }
    ],
    start_date: "2025-09-06",
    end_date: "2025-12-30",
    location: "B205",
    enrolled: 28,
    max_student: 30
  },
  {
    id: 3,
    subject_id: 3,
    subject_name: "Data Structures and Algorithms",
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
    max_student: 30
  },
  {
    id: 4,
    subject_id: 4,
    subject_name: "Database Systems",
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
    max_student: 30
  },
  {
    id: 5,
    subject_id: 5,
    subject_name: "Object-Oriented Programming",
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
    max_student: 50
  },
  {
    id: 6,
    subject_id: 6,
    subject_name: "Computer Networks",
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
    max_student: 30
  },
  {
    id: 7,
    subject_id: 7,
    subject_name: "Software Engineering",
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
    max_student: 30
  },
  {
    id: 8,
    subject_id: 8,
    subject_name: "Web Development",
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
    max_student: 50
  },
  {
    id: 9,
    subject_id: 9,
    subject_name: "Mobile Development",
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
    max_student: 30
  },
  {
    id: 10,
    subject_id: 10,
    subject_name: "Artificial Intelligence",
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
    max_student: 30
  }
];
