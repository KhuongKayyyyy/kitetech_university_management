// Export all fake data
import { FakeCurriculumInfo, FakeCurriculumSubjects, FakeAvailableSubjects } from "./FakeCurriculumV2Data";

// Original curriculum data (V1)
export { FakeCurriclumnData } from "./FakeCurriclumnData";

// New Curriculum V2 data
export {
  FakeCurriculumInfo,
  FakeBoardTypes,
  FakeBoards,
  FakeCurriculumSubjects,
  FakeCompleteCurriculumState,
  FakeAvailableSubjects,
} from "./FakeCurriculumV2Data";

// Simplified format examples
export {
  SimplifiedExample,
  SimplifiedSampleOutput,
  ComparisonExample,
  testConversion,
} from "./SimplifiedCurriculumExample";

// Legacy export for backward compatibility
// Convert FakeCurriculumInfo to the expected CurriculumModel format
export const curriculumData = [
  {
    id: 1,
    name: FakeCurriculumInfo.name,
    academicYear: FakeCurriculumInfo.academicYear,
    departmentId: FakeCurriculumInfo.facultyId.toString(),
    majorId: FakeCurriculumInfo.majorId.toString(),
    totalCredits: FakeCurriculumInfo.totalCredits,
    totalCourses: Object.keys(FakeCurriculumSubjects).length
  }
];

// Legacy subjects export for CurriSubjectItem component
// Convert FakeAvailableSubjects to match expected structure with subjectId
export const subjects = FakeAvailableSubjects.map(subject => ({
  ...subject,
  subjectId: subject.id
})); 