import { SubjectType } from "@/constants/enum/SubjectType";

export interface CurriculumnSubjectModel {
  LectureHours: number;
  PracticeHours: number;
  EducationProgramID: string;
  MajorID: string;
  SubjectID: string;
  Semester: number;
  AcademicYear: number;
  ProgramSemester: number;
  IsRequired: boolean;
  SubjectType: SubjectType;
  AcademicYearID: number;
  SubjectName: string;
  SubjectName_EN: string;
  TotalCredits: number;
  LectureCredits: number;
  PracticeCredits: number;
  SelfStudyCredits: number;
  InitialStatus: number;
  SubjectDetailInfo: string;
  SubjectTooltip: string;
  PrerequisiteType: number;
  HasPrerequisite: boolean;
  TotalPrerequisiteTypes: number;
  CourseTypeID: number;
  TrainingMajorCode: string;
  CourseTypeColorBackground: string | null;
  CourseTypeColorFont: string | null;
  CourseTypeName: string;
  CourseTypeName_EN: string;
  SemesterName: string;
  IsSummerSemester: boolean;
  AUN_Info: string;
  CourseGroupID: string;
  Notes: string | null;
  AccumulatedCredits: number;
  GPAAccumulated: number;
  BachelorCredits: number;
  EngineerCredits: number;
  IsPartOfNonBachelorGroup: boolean;
  IsExcludedFromEngineerProgram: boolean;
  HasEngineerGroup: boolean;
  MappedCourseGroupID: string | null;
  ElectiveCredits: number;
  MappedCourseGroupName: string | null;
  MappedCourseGroupName_EN: string | null;
  IsMapped: number;
  ParentCourseGroupID: string | null;
  IsRequiredElective: number;
  PracticeHoursCount: number;
  LectureHoursCount: number;
  SelfStudyHoursCount: number;
  IsCountedForGPA: boolean;
  IsCountedForCredits: boolean;
  PrerequisiteSubjects: any[];
}

export const defaultCurriculumnSubject: CurriculumnSubjectModel = {
  LectureHours: 0,
  PracticeHours: 0,
  EducationProgramID: "",
  MajorID: "",
  SubjectID: "",
  Semester: 1,
  AcademicYear: new Date().getFullYear(),
  ProgramSemester: 1,
  IsRequired: false,
  SubjectType: SubjectType.CORE,
  AcademicYearID: new Date().getFullYear(),
  SubjectName: "",
  SubjectName_EN: "",
  TotalCredits: 0,
  LectureCredits: 0,
  PracticeCredits: 0,
  SelfStudyCredits: 0,
  InitialStatus: -1,
  SubjectDetailInfo: "",
  SubjectTooltip: "",
  PrerequisiteType: 0,
  HasPrerequisite: false,
  TotalPrerequisiteTypes: 0,
  CourseTypeID: 0,
  TrainingMajorCode: "",
  CourseTypeColorBackground: null,
  CourseTypeColorFont: null,
  CourseTypeName: "",
  CourseTypeName_EN: "",
  SemesterName: "",
  IsSummerSemester: false,
  AUN_Info: "",
  CourseGroupID: "",
  Notes: null,
  AccumulatedCredits: 0,
  GPAAccumulated: 0,
  BachelorCredits: 0,
  EngineerCredits: 0,
  IsPartOfNonBachelorGroup: false,
  IsExcludedFromEngineerProgram: false,
  HasEngineerGroup: false,
  MappedCourseGroupID: null,
  ElectiveCredits: 0,
  MappedCourseGroupName: null,
  MappedCourseGroupName_EN: null,
  IsMapped: 0,
  ParentCourseGroupID: null,
  IsRequiredElective: 0,
  PracticeHoursCount: 0,
  LectureHoursCount: 0,
  SelfStudyHoursCount: 0,
  IsCountedForGPA: true,
  IsCountedForCredits: true,
  PrerequisiteSubjects: [],
};
