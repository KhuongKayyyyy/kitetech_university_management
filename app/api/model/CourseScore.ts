export interface CourseScore {
  id: number;
  classroomId: number;
  userId: number;
  qt1Grade: string;
  qt2Grade: string;
  midtermGrade: string;
  finalGrade: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    full_name: string;
    email: string;
  };
}

export interface StudentScore {
  id: string;
  name: string;
  email: string;
  avatar: string;
  scores: {
    assignments: number[];
    quizzes: number[];
    midtermExam: number;
    finalExam: number;
    participation: number;
    projects: number[];
  };
  totalScore: number;
  letterGrade: string;
  gpa: number;
}
