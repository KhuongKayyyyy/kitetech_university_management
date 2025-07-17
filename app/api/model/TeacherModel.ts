export interface Teacher {
  id: number;
  name: string;
  username?: string;
}

export interface TeacherDetailed {
  id: number;
  name: string;
  location: string;
  birthday: string;
  majorId: number;
  departmentId: number;
  isActivated: boolean;
  teacherEmail: string;
} 