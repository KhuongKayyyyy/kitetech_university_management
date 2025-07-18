import { SubjectModel } from "./model";

export interface CurriculumnSubjectModel {
  SubjectID: string;
  SubjectName: string;
  SubjectName_EN: string;
  TotalCredits: number;
  MajorID: string;
  Semester: number;
  SemesterColumnId: number;
  ProgramSemester: number;
  IsRequired: boolean;
  AcademicYear: number;
  AcademicYearID: number;
  LectureCredits: number;
  PrerequisiteType: number;
  HasPrerequisite: boolean;
  TotalPrerequisiteTypes: number;
  SemesterName: string;
  PrerequisiteSubjects: SubjectModel[];
}

export const defaultCurriculumnSubject: CurriculumnSubjectModel = {
  SubjectID: "",
  SubjectName: "",
  SubjectName_EN: "",
  TotalCredits: 0,
  MajorID: "",
  Semester: 1,
  SemesterColumnId: 1,
  ProgramSemester: 1,
  IsRequired: false,
  AcademicYear: new Date().getFullYear(),
  AcademicYearID: new Date().getFullYear(),
  LectureCredits: 0,
  PrerequisiteType: 0,
  HasPrerequisite: false,
  TotalPrerequisiteTypes: 0,
  SemesterName: "",
  PrerequisiteSubjects: [],
};
