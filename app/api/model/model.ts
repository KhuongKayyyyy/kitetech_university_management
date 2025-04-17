export interface Teacher {
  id: number;
  name: string;
  username?: string;
}

export interface Subject {
  id: number;
  subjectId: number;
  name: string;
  description?: string;
  majorId: number;
  departmentId: number;
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

export interface Class {
  id: number;
  name: string;
  majorId: number;
  students: Student[];
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
