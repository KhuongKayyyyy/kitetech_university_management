import { SubjectModel, Teacher, Student } from "./model";
import { TimeSheetModel } from "./TimeSheet";


export interface StudentScoreModel {
  id?: string;
  studentId?: string;
  student?: Student;
  subjectClassId?: string;
  scores?: {
    assignments?: number[];
    quizzes?: number[];
    midtermExam?: number;
    finalExam?: number;
    participation?: number;
    projects?: number[];
  };
  totalScore?: number;
  letterGrade?: string; // A, B+, B, C+, C, D+, D, F
  gpa?: number; // 4.0 scale
  remarks?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubjectClassModel {
  id?: string;
  name?: string;
  subject?: SubjectModel;
  teacher?: Teacher;
  semester?: string; // e.g., "Fall 2024", "Spring 2025"
  academicYear?: string; // e.g., "2024-2025"
  schedule?: TimeSheetModel[];
  maxStudents?: number;
  enrolledStudents?: Student[];
  studentScores?: StudentScoreModel[];
  description?: string;
  syllabus?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}



export const MOCK_SUBJECT_CLASSES: SubjectClassModel[] = [
  {
    id: "1",
    name: "Advanced Mathematics - Section A",
    subject: {
      id: "1",
      name: "Advanced Mathematics",
      credits: 3,
      description: "Advanced mathematical concepts and problem solving",
      faculty_id: 1,
      gradingFormulaId: 1
    },
    teacher: {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu",
    },
    semester: "Fall 2024",
    academicYear: "2024-2025",
    schedule: [
      { id: 1, date: "monday", sheet: "Sheet 1", time_of_sheet: "9h30 - 12h" },
      { id: 2, date: "wednesday", sheet: "Sheet 2", time_of_sheet: "9h30 - 12h" },
      { id: 3, date: "friday", sheet: "Sheet 3", time_of_sheet: "9h30 - 12h" }
    ],
    maxStudents: 30,
    enrolledStudents: [],
    studentScores: [],
    description: "This course covers advanced mathematical concepts including calculus, linear algebra, and differential equations.",
    syllabus: "Week 1-4: Calculus Review, Week 5-8: Linear Algebra, Week 9-12: Differential Equations, Week 13-16: Applications",
    isActive: true,
    createdAt: new Date("2024-08-15"),
    updatedAt: new Date("2024-11-15")
  },
  {
    id: "2",
    name: "Computer Science Fundamentals - Section B",
    subject: {
      id: "2",
      name: "Computer Science Fundamentals",
      credits: 4,
      description: "Introduction to programming and computer science concepts",
      faculty_id: 2,
      gradingFormulaId: 1
    },
    teacher: {
      id: 2,
      name: "Prof. Michael Chen",
      email: "michael.chen@university.edu",
    },
    semester: "Fall 2024",
    academicYear: "2024-2025",
    schedule: [
      { id: 4, date: "tuesday", sheet: "Sheet 1", time_of_sheet: "13h - 15h30" },
      { id: 5, date: "thursday", sheet: "Sheet 2", time_of_sheet: "13h - 15h30" }
    ],
    maxStudents: 25,
    enrolledStudents: [],
    studentScores: [],
    description: "An introduction to programming concepts, algorithms, and data structures using Python.",
    syllabus: "Week 1-3: Python Basics, Week 4-6: Data Structures, Week 7-10: Algorithms, Week 11-14: Object-Oriented Programming, Week 15-16: Final Project",
    isActive: true,
    createdAt: new Date("2024-08-20"),
    updatedAt: new Date("2024-11-20")
  },
  {
    id: "3",
    name: "English Literature - Section C",
    subject: {
      id: "3",
      name: "English Literature",
      credits: 3,
      description: "Study of classic and contemporary English literature",
      faculty_id: 3,
      gradingFormulaId: 1
    },
    teacher: {
      id: 3,
      name: "Dr. Emily Watson",
      email: "emily.watson@university.edu",
    },
    semester: "Spring 2025",
    academicYear: "2024-2025",
    schedule: [
      { id: 6, date: "monday", sheet: "Sheet 3", time_of_sheet: "13h - 15h30" },
      { id: 7, date: "wednesday", sheet: "Sheet 4", time_of_sheet: "15h30 - 18h" }
    ],
    maxStudents: 20,
    enrolledStudents: [],
    studentScores: [],
    description: "Exploration of major works in English literature from Shakespeare to contemporary authors.",
    syllabus: "Week 1-4: Shakespeare, Week 5-8: Romantic Poetry, Week 9-12: Victorian Literature, Week 13-16: Modern Literature",
    isActive: true,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-12-01")
  },
  {
    id: "4",
    name: "Physics Laboratory - Section A",
    subject: {
      id: "4",
      name: "Physics Laboratory",
      credits: 2,
      description: "Hands-on physics experiments and data analysis",
      faculty_id: 4,
      gradingFormulaId: 1
    },
    teacher: {
      id: 4,
      name: "Dr. Robert Martinez",
      email: "robert.martinez@university.edu",
    },
    semester: "Fall 2024",
    academicYear: "2024-2025",
    schedule: [
      { id: 8, date: "friday", sheet: "Sheet 1", time_of_sheet: "13h - 15h30" }
    ],
    maxStudents: 15,
    enrolledStudents: [],
    studentScores: [],
    description: "Laboratory course focusing on experimental physics and scientific methodology.",
    syllabus: "Week 1-2: Measurement and Error Analysis, Week 3-6: Mechanics Experiments, Week 7-10: Electricity and Magnetism, Week 11-16: Optics and Modern Physics",
    isActive: true,
    createdAt: new Date("2024-08-25"),
    updatedAt: new Date("2024-11-25")
  },
  {
    id: "5",
    name: "Business Economics - Section D",
    subject: {
      id: "5",
      name: "Business Economics",
      credits: 3,
      description: "Economic principles applied to business decision making",
      faculty_id: 5,
      gradingFormulaId: 1
    },
    teacher: {
      id: 5,
      name: "Prof. Lisa Thompson",
      email: "lisa.thompson@university.edu",
    },
    semester: "Spring 2025",
    academicYear: "2024-2025",
    schedule: [
      { id: 9, date: "tuesday", sheet: "Sheet 2", time_of_sheet: "9h30 - 12h" },
      { id: 10, date: "thursday", sheet: "Sheet 4", time_of_sheet: "15h30 - 18h" }
    ],
    maxStudents: 35,
    enrolledStudents: [],
    studentScores: [],
    description: "Application of economic theory to business problems and decision-making processes.",
    syllabus: "Week 1-4: Microeconomic Principles, Week 5-8: Market Structures, Week 9-12: Macroeconomic Environment, Week 13-16: Business Strategy and Economics",
    isActive: true,
    createdAt: new Date("2024-09-10"),
    updatedAt: new Date("2024-12-10")
  },
  {
    id: "6",
    name: "Art History - Section A",
    subject: {
      id: "6",
      name: "Art History",
      credits: 3,
      description: "Survey of Western art from ancient to contemporary periods",
      faculty_id: 6,
      gradingFormulaId: 1
    },
    teacher: {
      id: 6,
      name: "Dr. Maria Rodriguez",
      email: "maria.rodriguez@university.edu",
    },
    semester: "Fall 2024",
    academicYear: "2024-2025",
    schedule: [
      { id: 11, date: "monday", sheet: "Sheet 2", time_of_sheet: "9h30 - 12h" },
      { id: 12, date: "friday", sheet: "Sheet 2", time_of_sheet: "9h30 - 12h" }
    ],
    maxStudents: 40,
    enrolledStudents: [],
    studentScores: [],
    description: "Comprehensive survey of Western art history focusing on major movements and artists.",
    syllabus: "Week 1-3: Ancient Art, Week 4-6: Medieval Art, Week 7-9: Renaissance, Week 10-12: Baroque and Neoclassical, Week 13-16: Modern and Contemporary",
    isActive: true,
    createdAt: new Date("2024-08-18"),
    updatedAt: new Date("2024-11-18")
  },
  {
    id: "7",
    name: "Chemistry Lab - Section B",
    subject: {
      id: "7",
      name: "Chemistry Lab",
      credits: 2,
      description: "Laboratory experiments in general chemistry",
      faculty_id: 7,
      gradingFormulaId: 1
    },
    teacher: {
      id: 7,
      name: "Dr. James Wilson",
      email: "james.wilson@university.edu",
    },
    semester: "Spring 2025",
    academicYear: "2024-2025",
    schedule: [
      { id: 13, date: "wednesday", sheet: "Sheet 1", time_of_sheet: "7h - 9h30" }
    ],
    maxStudents: 16,
    enrolledStudents: [],
    studentScores: [],
    description: "Laboratory course accompanying general chemistry lecture with hands-on experiments.",
    syllabus: "Week 1-2: Lab Safety and Techniques, Week 3-6: Stoichiometry Experiments, Week 7-10: Acid-Base Chemistry, Week 11-16: Organic Synthesis",
    isActive: false,
    createdAt: new Date("2024-09-05"),
    updatedAt: new Date("2024-12-05")
  },
  {
    id: "8",
    name: "Statistics for Social Sciences - Section C",
    subject: {
      id: "8",
      name: "Statistics for Social Sciences",
      credits: 3,
      description: "Statistical methods applied to social science research",
      faculty_id: 8,
      gradingFormulaId: 1
    },
    teacher: {
      id: 8,
      name: "Prof. Angela Davis",
      email: "angela.davis@university.edu",
    },
    semester: "Fall 2024",
    academicYear: "2024-2025",
    schedule: [
      { id: 14, date: "tuesday", sheet: "Sheet 3", time_of_sheet: "13h - 15h30" },
      { id: 15, date: "thursday", sheet: "Sheet 1", time_of_sheet: "7h - 9h30" }
    ],
    maxStudents: 28,
    enrolledStudents: [],
    studentScores: [],
    description: "Introduction to statistical concepts and methods relevant to social science research.",
    syllabus: "Week 1-4: Descriptive Statistics, Week 5-8: Probability and Distributions, Week 9-12: Hypothesis Testing, Week 13-16: Regression Analysis",
    isActive: true,
    createdAt: new Date("2024-08-22"),
    updatedAt: new Date("2024-11-22")
  },
  {
    id: "9",
    name: "World History - Section B",
    subject: {
      id: "9",
      name: "World History",
      credits: 3,
      description: "Survey of world civilizations from ancient to modern times",
      faculty_id: 9,
      gradingFormulaId: 1
    },
    teacher: {
      id: 9,
      name: "Dr. David Kim",
      email: "david.kim@university.edu",
    },
    semester: "Spring 2025",
    academicYear: "2024-2025",
    schedule: [
      { id: 16, date: "monday", sheet: "Sheet 4", time_of_sheet: "15h30 - 18h" },
      { id: 17, date: "wednesday", sheet: "Sheet 3", time_of_sheet: "13h - 15h30" },
      { id: 18, date: "friday", sheet: "Sheet 4", time_of_sheet: "15h30 - 18h" }
    ],
    maxStudents: 45,
    enrolledStudents: [],
    studentScores: [],
    description: "Comprehensive overview of major world civilizations and their interactions throughout history.",
    syllabus: "Week 1-4: Ancient Civilizations, Week 5-8: Classical Period, Week 9-12: Medieval World, Week 13-16: Modern Era",
    isActive: true,
    createdAt: new Date("2024-09-03"),
    updatedAt: new Date("2024-12-03")
  },
  {
    id: "10",
    name: "Introduction to Psychology - Section A",
    subject: {
      id: "10",
      name: "Introduction to Psychology",
      credits: 3,
      description: "Basic principles and theories of human behavior and mental processes",
      faculty_id: 10,
      gradingFormulaId: 1
    },
    teacher: {
      id: 10,
      name: "Dr. Rachel Green",
      email: "rachel.green@university.edu",
    },
    semester: "Fall 2024",
    academicYear: "2024-2025",
    schedule: [
      { id: 19, date: "tuesday", sheet: "Sheet 4", time_of_sheet: "15h30 - 18h" },
      { id: 20, date: "thursday", sheet: "Sheet 3", time_of_sheet: "13h - 15h30" }
    ],
    maxStudents: 50,
    enrolledStudents: [],
    studentScores: [],
    description: "Introduction to the scientific study of behavior and mental processes.",
    syllabus: "Week 1-4: History and Methods, Week 5-8: Biological Psychology, Week 9-12: Learning and Memory, Week 13-16: Social Psychology",
    isActive: true,
    createdAt: new Date("2024-08-12"),
    updatedAt: new Date("2024-11-12")
  }
];
