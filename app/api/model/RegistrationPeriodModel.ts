import { RegisPeriodStatus } from "@/constants/enum/RegisPeriodStatus";

export interface Major {
  id: number;
  name: string;
  code: string;
  description: string;
  faculty_id: number;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: number;
  class_code: string;
  description: string;
  academic_year: number;
  major_id: number;
  created_at: string;
  updated_at: string;
  major: Major;
}

export interface CourseRegistrationClass {
  id: number;
  course_registration_id: number;
  class_id: number;
  created_at: string;
  updated_at: string;
  class: Class;
}

export interface Subject {
  id: number;
  name: string;
  credits: number;
  description: string;
  gradingFormulaId: number;
  faculty_id: number;
  created_at: string;
  updated_at: string;
}

export interface CourseRegistrationSchedule {
  id: number;
  course_registration_subject_id: number;
  sections: number;
  schedule: string;
  created_at: string;
  updated_at: string;
}

export interface StudentCourseRegistration {
  id: number;
  user_id: number;
  course_registration_subject_id: number;
  status: string;
  registered_at: string;
  notes: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface RegisteredStudent {
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
}

export interface CourseRegistrationSubject {
  id: number;
  course_registration_id: number;
  subject_id: number;
  start_date: string;
  end_date: string;
  max_student: number;
  description: string;
  location: string;
  semester_id: number;
  created_at: string;
  updated_at: string;
  subject: Subject;
  courseRegistrationSchedules: CourseRegistrationSchedule[];
  studentCourseRegistrations: StudentCourseRegistration[];
}

export interface Semester {
  id: number;
  academic_year_id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface RegistrationPeriod {
  id: number;
  semester_id: number;
  start_date: string;
  end_date: string;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
  semester: Semester;
  courseRegistrationClasses: CourseRegistrationClass[];
  courseRegistrationSubjects: CourseRegistrationSubject[];
}

// Mock data for testing and development
export const mockRegistrationPeriods: RegistrationPeriod[] = [
  {
    id: 1,
    semester_id: 16,
    start_date: "2025-09-06",
    end_date: "2025-09-15",
    status: "Open",
    description: "Course Registration HK1 2025-2026 v1",
    created_at: "2025-09-06T10:17:30.042Z",
    updated_at: "2025-09-06T10:24:20.000Z",
    semester: {
      id: 16,
      academic_year_id: 3,
      name: "HK1 2025-2026",
      start_date: "2025-09-01",
      end_date: "2026-01-15",
      status: "Active",
      description: "First semester of academic year 2025–2026",
      created_at: "2025-08-28T08:31:03.922Z",
      updated_at: "2025-08-28T08:31:03.922Z"
    },
    courseRegistrationClasses: [
      {
        id: 1,
        course_registration_id: 1,
        class_id: 31,
        created_at: "2025-09-06T10:29:13.566Z",
        updated_at: "2025-09-06T10:29:13.566Z",
        class: {
          id: 31,
          class_code: "23010101",
          description: "Class of 2023, Computer Science Group 1",
          academic_year: 2023,
          major_id: 1,
          created_at: "2025-08-24T13:49:31.171Z",
          updated_at: "2025-08-24T13:49:31.171Z",
          major: {
            id: 1,
            name: "Software Engineering",
            code: "SE",
            description: "Major in software development, testing, and project management.",
            faculty_id: 1,
            created_at: "2025-08-24T09:27:33.264Z",
            updated_at: "2025-08-24T09:27:33.264Z"
          }
        }
      },
      {
        id: 3,
        course_registration_id: 1,
        class_id: 33,
        created_at: "2025-09-06T10:29:13.566Z",
        updated_at: "2025-09-06T10:29:13.566Z",
        class: {
          id: 33,
          class_code: "23010201",
          description: "Class of 2023, Information Technology Group 1",
          academic_year: 2023,
          major_id: 2,
          created_at: "2025-08-24T13:49:31.171Z",
          updated_at: "2025-08-24T13:49:31.171Z",
          major: {
            id: 2,
            name: "Artificial Intelligence",
            code: "AI",
            description: "Major in AI, machine learning, and data science.",
            faculty_id: 1,
            created_at: "2025-08-24T09:27:33.264Z",
            updated_at: "2025-08-24T09:27:33.264Z"
          }
        }
      },
      {
        id: 4,
        course_registration_id: 1,
        class_id: 34,
        created_at: "2025-09-06T10:29:13.566Z",
        updated_at: "2025-09-06T10:29:13.566Z",
        class: {
          id: 34,
          class_code: "23010301",
          description: "Class of 2023, Software Engineering Group 1",
          academic_year: 2023,
          major_id: 3,
          created_at: "2025-08-24T13:49:31.171Z",
          updated_at: "2025-08-24T13:49:31.171Z",
          major: {
            id: 3,
            name: "Information Security",
            code: "IS",
            description: "Focus on cybersecurity, encryption, and network protection.",
            faculty_id: 1,
            created_at: "2025-08-24T09:27:33.264Z",
            updated_at: "2025-08-24T09:27:33.264Z"
          }
        }
      }
    ],
    courseRegistrationSubjects: [
      {
        id: 2,
        course_registration_id: 1,
        subject_id: 1,
        start_date: "2025-09-06",
        end_date: "2025-12-30",
        max_student: 30,
        description: "Fundamentals of programming using C language.",
        location: "C101",
        semester_id: 16,
        created_at: "2025-09-06T11:09:14.708Z",
        updated_at: "2025-09-06T11:09:14.708Z",
        subject: {
          id: 1,
          name: "Introduction to Programming",
          credits: 3,
          description: "Fundamentals of programming using C language.",
          gradingFormulaId: 1,
          faculty_id: 1,
          created_at: "2025-08-24T09:40:21.967Z",
          updated_at: "2025-08-24T09:40:21.967Z"
        },
        courseRegistrationSchedules: [
          {
            id: 7,
            course_registration_subject_id: 2,
            sections: 2,
            schedule: "Monday",
            created_at: "2025-09-06T11:09:14.752Z",
            updated_at: "2025-09-06T11:09:14.752Z"
          },
          {
            id: 8,
            course_registration_subject_id: 2,
            sections: 4,
            schedule: "Wednesday",
            created_at: "2025-09-06T11:09:14.752Z",
            updated_at: "2025-09-06T11:09:14.752Z"
          }
        ],
        studentCourseRegistrations: [
          {
            id: 9,
            user_id: 54,
            course_registration_subject_id: 2,
            status: "Approved",
            registered_at: "2025-09-07T10:59:07.000Z",
            notes: null,
            rejection_reason: null,
            created_at: "2025-09-07T03:59:12.964Z",
            updated_at: "2025-09-07T03:59:12.964Z"
          }
        ]
      },
      {
        id: 3,
        course_registration_id: 1,
        subject_id: 2,
        start_date: "2025-09-06",
        end_date: "2025-12-30",
        max_student: 30,
        description: "Introduction to programming.",
        location: "C101",
        semester_id: 16,
        created_at: "2025-09-06T13:47:48.742Z",
        updated_at: "2025-09-06T13:47:48.742Z",
        subject: {
          id: 2,
          name: "Data Structures and Algorithms",
          credits: 4,
          description: "Study of data organization and algorithm design.",
          gradingFormulaId: 1,
          faculty_id: 1,
          created_at: "2025-08-24T09:40:21.967Z",
          updated_at: "2025-08-24T09:40:21.967Z"
        },
        courseRegistrationSchedules: [
          {
            id: 9,
            course_registration_subject_id: 3,
            sections: 2,
            schedule: "Monday",
            created_at: "2025-09-06T13:47:48.746Z",
            updated_at: "2025-09-06T13:47:48.746Z"
          },
          {
            id: 10,
            course_registration_subject_id: 3,
            sections: 4,
            schedule: "Wednesday",
            created_at: "2025-09-06T13:47:48.746Z",
            updated_at: "2025-09-06T13:47:48.746Z"
          }
        ],
        studentCourseRegistrations: [
          {
            id: 6,
            user_id: 53,
            course_registration_subject_id: 3,
            status: "Approved",
            registered_at: "2025-09-07T10:45:39.000Z",
            notes: null,
            rejection_reason: null,
            created_at: "2025-09-07T03:45:44.330Z",
            updated_at: "2025-09-07T03:45:44.330Z"
          },
          {
            id: 8,
            user_id: 54,
            course_registration_subject_id: 3,
            status: "Approved",
            registered_at: "2025-09-07T10:59:07.000Z",
            notes: null,
            rejection_reason: null,
            created_at: "2025-09-07T03:59:12.964Z",
            updated_at: "2025-09-07T03:59:12.964Z"
          }
        ]
      }
    ]
  }
];
