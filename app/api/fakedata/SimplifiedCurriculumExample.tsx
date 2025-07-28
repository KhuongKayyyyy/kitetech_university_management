// Example showing the conversion from Complex to Simplified Curriculum format
import { convertToSimplified, SimplifiedCurriculumnSubjectModel } from "../model/CurriculumnSubjectModel";
import { FakeBoards, FakeCurriculumSubjects } from "./FakeCurriculumV2Data";

// Example: Converting the fake data to simplified format
export const SimplifiedExample = convertToSimplified(FakeCurriculumSubjects, FakeBoards);

// Sample of what the simplified output looks like
export const SimplifiedSampleOutput: { [key: string]: SimplifiedCurriculumnSubjectModel } = {
  "subject-101-1704067200001-xyz789abc": {
    SubjectID: "101",
    Semester: "semester-1-board-core-1704067200000-0",
    IsRequired: true,
    MinCredit: 4,
    SubjectNumber: 1,
    HasPrerequisite: false,
    PrerequisiteSubjects: [],
  },
  "subject-201-1704067200005-abc123def": {
    SubjectID: "201",
    Semester: "semester-2-board-core-1704067200000-0",
    IsRequired: true,
    MinCredit: 4,
    SubjectNumber: 1,
    HasPrerequisite: true,
    PrerequisiteSubjects: ["subject-101-1704067200001-xyz789abc"], // References curriculum subject ID, not base subject ID
  },
  "subject-501-1704067200017-def456ghi": {
    SubjectID: "501",
    Semester: "semester-5-board-core-1704067200000-0",
    IsRequired: true,
    MinCredit: 4,
    SubjectNumber: 1,
    HasPrerequisite: true,
    PrerequisiteSubjects: [
      "subject-301-1704067200009-ghi789jkl", // Data Structures and Algorithms
      "subject-304-1704067200012-jkl012mno", // Statistics and Probability
    ],
  },
};

// Comparison showing the data structure differences
export const ComparisonExample = {
  // BEFORE: Complex format (current storage)
  complex: {
    "subject-101-1704067200001-abc123def": {
      SubjectID: "101",
      SubjectName: "Calculus I",
      SubjectName_EN: "Calculus I",
      TotalCredits: 4,
      MajorID: "1",
      Semester: 1,
      SemesterColumnId: 1,
      ProgramSemester: 1,
      IsRequired: true,
      AcademicYear: 2024,
      AcademicYearID: 2024,
      LectureCredits: 4,
      PrerequisiteType: 0,
      HasPrerequisite: false,
      TotalPrerequisiteTypes: 0,
      SemesterName: "Semester 1",
      PrerequisiteSubjects: [], // Array of SubjectModel objects
    },
  },

  // AFTER: Simplified format (export/storage)
  simplified: {
    "subject-101-1704067200001-abc123def": {
      SubjectID: "101",
      Semester: "semester-1-board-core-1704067200000-0", // Column ID reference
      IsRequired: true,
      MinCredit: 4,
      SubjectNumber: 1, // Position in semester
      HasPrerequisite: false,
      PrerequisiteSubjects: [], // Array of curriculum subject IDs (strings)
    },
  },
};

// Usage example for testing the conversion function
export const testConversion = () => {
  console.log("=== TESTING CURRICULUM CONVERSION ===");

  // Convert using the actual function
  const converted = convertToSimplified(FakeCurriculumSubjects, FakeBoards);

  console.log("Original subjects count:", Object.keys(FakeCurriculumSubjects).length);
  console.log("Converted subjects count:", Object.keys(converted).length);

  // Show a sample conversion
  const sampleSubject = Object.entries(converted)[0];
  console.log("Sample converted subject:", sampleSubject);

  // Check prerequisite mapping
  const subjectsWithPrereqs = Object.entries(converted).filter(
    ([_, subject]) => subject.PrerequisiteSubjects.length > 0,
  );
  console.log("Subjects with prerequisites:", subjectsWithPrereqs.length);

  return converted;
};
