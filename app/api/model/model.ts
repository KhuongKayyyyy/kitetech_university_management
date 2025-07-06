export interface Teacher {
  id: number;
  name: string;
  username?: string;
}

export interface Subject {
  id: string;
  subjectId: string;
  name: string;
  description?: string;
  majorId: string;
  departmentId: number;
  credits: number;
}

export interface Major {
  id: number;
  name: string;
  description?: string;
  departmentId: number;
}
export interface Department {
  id: number;
  name: string;
  description?: string;
  majors: Major[];
  icon: string;
}

export interface Teacher {
  id: number;
  name: string;
  location: string;
  birthday: string;
  majorId: number;
  departmentId: number;
  isActivated: boolean;
  teacherEmail: string;
}

export interface Student {
  id: number;
  name: string;
  username?: string;
  classId: number;
  majorId: number;
  departmentId: number;
  location: string;
  birthday: string;
  isActivated: boolean;
  studentEmail: string;
  studentId: string;
}

