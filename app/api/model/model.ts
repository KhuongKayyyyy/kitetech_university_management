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
  subjects?: Subject[];
}
export interface DepartmentModel {
  id: number;
  name: string;
  contact_info?: string;
  dean?: string;
  majors?: Major[];
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

