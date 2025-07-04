export interface Class {
  id: number;
  majorId: number;
  academicYearId: number;
  curriculumId: number;
  classCode: string;
  description?: string;
}


export const mockClasses: Class[] = [
  { id: 1, majorId: 1, academicYearId: 1, curriculumId: 1, classCode: "CS2021A", description: "Computer Science Class A - 2021 intake" },
  { id: 2, majorId: 1, academicYearId: 1, curriculumId: 1, classCode: "CS2021B", description: "Computer Science Class B - 2021 intake" },
  { id: 3, majorId: 1, academicYearId: 2, curriculumId: 2, classCode: "CS2022A", description: "Computer Science Class A - 2022 intake" },
  { id: 4, majorId: 1, academicYearId: 2, curriculumId: 2, classCode: "CS2022B", description: "Computer Science Class B - 2022 intake" },
  { id: 5, majorId: 1, academicYearId: 3, curriculumId: 3, classCode: "CS2023A", description: "Computer Science Class A - 2023 intake" },
  { id: 6, majorId: 1, academicYearId: 3, curriculumId: 3, classCode: "CS2023B", description: "Computer Science Class B - 2023 intake" },
  { id: 7, majorId: 1, academicYearId: 4, curriculumId: 4, classCode: "CS2024A", description: "Computer Science Class A - 2024 intake" },
  { id: 8, majorId: 1, academicYearId: 4, curriculumId: 4, classCode: "CS2024B", description: "Computer Science Class B - 2024 intake" },
  { id: 9, majorId: 2, academicYearId: 1, curriculumId: 5, classCode: "EE2021A", description: "Electrical Engineering Class A - 2021 intake" },
  { id: 10, majorId: 2, academicYearId: 1, curriculumId: 5, classCode: "EE2021B", description: "Electrical Engineering Class B - 2021 intake" },
  { id: 11, majorId: 2, academicYearId: 2, curriculumId: 6, classCode: "EE2022A", description: "Electrical Engineering Class A - 2022 intake" },
  { id: 12, majorId: 2, academicYearId: 2, curriculumId: 6, classCode: "EE2022B", description: "Electrical Engineering Class B - 2022 intake" },
  { id: 13, majorId: 2, academicYearId: 3, curriculumId: 7, classCode: "EE2023A", description: "Electrical Engineering Class A - 2023 intake" },
  { id: 14, majorId: 2, academicYearId: 3, curriculumId: 7, classCode: "EE2023B", description: "Electrical Engineering Class B - 2023 intake" },
  { id: 15, majorId: 3, academicYearId: 1, curriculumId: 8, classCode: "ME2021A", description: "Mechanical Engineering Class A - 2021 intake" },
  { id: 16, majorId: 3, academicYearId: 1, curriculumId: 8, classCode: "ME2021B", description: "Mechanical Engineering Class B - 2021 intake" },
  { id: 17, majorId: 3, academicYearId: 2, curriculumId: 9, classCode: "ME2022A", description: "Mechanical Engineering Class A - 2022 intake" },
  { id: 18, majorId: 3, academicYearId: 2, curriculumId: 9, classCode: "ME2022B", description: "Mechanical Engineering Class B - 2022 intake" },
  { id: 19, majorId: 3, academicYearId: 3, curriculumId: 10, classCode: "ME2023A", description: "Mechanical Engineering Class A - 2023 intake" },
  { id: 20, majorId: 3, academicYearId: 3, curriculumId: 10, classCode: "ME2023B", description: "Mechanical Engineering Class B - 2023 intake" },
  { id: 21, majorId: 4, academicYearId: 1, curriculumId: 11, classCode: "BIO2021A", description: "Biology Class A - 2021 intake" },
  { id: 22, majorId: 4, academicYearId: 1, curriculumId: 11, classCode: "BIO2021B", description: "Biology Class B - 2021 intake" },
  { id: 23, majorId: 4, academicYearId: 2, curriculumId: 12, classCode: "BIO2022A", description: "Biology Class A - 2022 intake" },
  { id: 24, majorId: 4, academicYearId: 2, curriculumId: 12, classCode: "BIO2022B", description: "Biology Class B - 2022 intake" },
  { id: 25, majorId: 4, academicYearId: 3, curriculumId: 13, classCode: "BIO2023A", description: "Biology Class A - 2023 intake" },
  { id: 26, majorId: 5, academicYearId: 1, curriculumId: 14, classCode: "CHEM2021A", description: "Chemistry Class A - 2021 intake" },
  { id: 27, majorId: 5, academicYearId: 1, curriculumId: 14, classCode: "CHEM2021B", description: "Chemistry Class B - 2021 intake" },
  { id: 28, majorId: 5, academicYearId: 2, curriculumId: 15, classCode: "CHEM2022A", description: "Chemistry Class A - 2022 intake" },
  { id: 29, majorId: 5, academicYearId: 3, curriculumId: 16, classCode: "CHEM2023A", description: "Chemistry Class A - 2023 intake" },
  { id: 30, majorId: 6, academicYearId: 1, curriculumId: 17, classCode: "PHYS2021A", description: "Physics Class A - 2021 intake" },
  { id: 31, majorId: 6, academicYearId: 2, curriculumId: 18, classCode: "PHYS2022A", description: "Physics Class A - 2022 intake" },
  { id: 32, majorId: 6, academicYearId: 2, curriculumId: 18, classCode: "PHYS2022B", description: "Physics Class B - 2022 intake" },
  { id: 33, majorId: 6, academicYearId: 3, curriculumId: 19, classCode: "PHYS2023A", description: "Physics Class A - 2023 intake" },
  { id: 34, majorId: 7, academicYearId: 1, curriculumId: 20, classCode: "MATH2021A", description: "Mathematics Class A - 2021 intake" },
  { id: 35, majorId: 7, academicYearId: 2, curriculumId: 21, classCode: "MATH2022A", description: "Mathematics Class A - 2022 intake" },
  { id: 36, majorId: 7, academicYearId: 3, curriculumId: 22, classCode: "MATH2023A", description: "Mathematics Class A - 2023 intake" },
  { id: 37, majorId: 8, academicYearId: 1, curriculumId: 23, classCode: "ECO2021A", description: "Economics Class A - 2021 intake" },
  { id: 38, majorId: 8, academicYearId: 2, curriculumId: 24, classCode: "ECO2022A", description: "Economics Class A - 2022 intake" },
  { id: 39, majorId: 8, academicYearId: 3, curriculumId: 25, classCode: "ECO2023A", description: "Economics Class A - 2023 intake" },
  { id: 40, majorId: 1, academicYearId: 4, curriculumId: 4, classCode: "CS2024C", description: "Computer Science Class C - 2024 intake" }
];
