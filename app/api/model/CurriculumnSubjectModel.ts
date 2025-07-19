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

// New simplified structure for storage/export
export interface SimplifiedCurriculumnSubjectModel {
  SubjectID: string;
  Semester: string; // References semester column ID 
  IsRequired: boolean;
  MinCredit: number;
  SubjectNumber: number; // Order in semester
  HasPrerequisite: boolean;
  PrerequisiteSubjects: string[]; // Array of curriculum subject IDs
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

// Conversion functions
export const convertToSimplified = (
  curriculumSubjects: { [key: string]: CurriculumnSubjectModel },
  boards: any[]
): { [key: string]: SimplifiedCurriculumnSubjectModel } => {
  const simplified: { [key: string]: SimplifiedCurriculumnSubjectModel } = {};
  const oldToNewIdMapping: { [key: string]: string } = {};
  
  // First pass: Create new IDs and basic subject data
  Object.entries(curriculumSubjects).forEach(([oldMappingId, subject]) => {
    // Find the semester column ID for this subject
    let semesterColumnId = "";
    let subjectNumber = 1;
    
    for (const board of boards) {
      for (const [colId, column] of Object.entries(board.semesterColumn)) {
        const columnTyped = column as any;
        if (columnTyped.subjectIds.includes(oldMappingId)) {
          semesterColumnId = colId;
          // Calculate subject number based on position in column
          subjectNumber = columnTyped.subjectIds.indexOf(oldMappingId) + 1;
          break;
        }
      }
      if (semesterColumnId) break;
    }
    
    // Generate new simplified ID
    const newId = `subject-${subject.SubjectID}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    oldToNewIdMapping[oldMappingId] = newId;
    
    simplified[newId] = {
      SubjectID: subject.SubjectID,
      Semester: semesterColumnId,
      IsRequired: subject.IsRequired,
      MinCredit: subject.TotalCredits,
      SubjectNumber: subjectNumber,
      HasPrerequisite: subject.HasPrerequisite,
      PrerequisiteSubjects: [], // Will be filled in second pass
    };
  });
  
  // Second pass: Map prerequisite subjects using new IDs
  Object.entries(curriculumSubjects).forEach(([oldMappingId, subject]) => {
    const newId = oldToNewIdMapping[oldMappingId];
    if (!newId) return;
    
    // Convert prerequisite SubjectModel[] to curriculum subject IDs
    const prerequisiteIds: string[] = [];
    subject.PrerequisiteSubjects.forEach(prereqSubject => {
      // Find which curriculum subject mapping ID has this SubjectID
      const prereqMappingId = Object.keys(curriculumSubjects).find(mappingId => 
        curriculumSubjects[mappingId].SubjectID.toString() === prereqSubject.id.toString()
      );
      
      console.log(`Looking for prerequisite: SubjectID ${prereqSubject.id}, found mapping: ${prereqMappingId}`);
      
      if (prereqMappingId && oldToNewIdMapping[prereqMappingId]) {
        prerequisiteIds.push(oldToNewIdMapping[prereqMappingId]);
        console.log(`Mapped prerequisite ${prereqSubject.id} to new ID: ${oldToNewIdMapping[prereqMappingId]}`);
      } else {
        console.log(`Could not find mapping for prerequisite ${prereqSubject.id}`);
      }
    });
    
    simplified[newId].PrerequisiteSubjects = prerequisiteIds;
    console.log(`Subject ${subject.SubjectID} (${newId}) has prerequisites: [${prerequisiteIds.join(', ')}]`);
  });
  
  return simplified;
};
