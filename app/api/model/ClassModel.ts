import { MajorModel } from "./MajorModel";

export interface ClassModel {
  id?: number;
  major_id?: number;
  academic_year?: number;
  curriculumId?: number;
  class_code?: string;
  description?: string;
  major?: MajorModel;
}


export const mockClasses: ClassModel[] = [
  { id: 1, major_id: 1, academic_year: 1, curriculumId: 1, class_code: "CS2021A", description: "Computer Science Class A - 2021 intake" },
  { id: 2, major_id: 1, academic_year: 1, curriculumId: 1, class_code: "CS2021B", description: "Computer Science Class B - 2021 intake" },
  { id: 3, major_id: 1, academic_year: 2, curriculumId: 2, class_code: "CS2022A", description: "Computer Science Class A - 2022 intake" },
  { id: 4, major_id: 1, academic_year: 2, curriculumId: 2, class_code: "CS2022B", description: "Computer Science Class B - 2022 intake" },
  { id: 5, major_id: 1, academic_year: 3, curriculumId: 3, class_code: "CS2023A", description: "Computer Science Class A - 2023 intake" },
  { id: 6, major_id: 1, academic_year: 3, curriculumId: 3, class_code: "CS2023B", description: "Computer Science Class B - 2023 intake" },
  { id: 7, major_id: 1, academic_year: 4, curriculumId: 4, class_code: "CS2024A", description: "Computer Science Class A - 2024 intake" },
  { id: 8, major_id: 1, academic_year: 4, curriculumId: 4, class_code: "CS2024B", description: "Computer Science Class B - 2024 intake" },
  { id: 9, major_id: 2, academic_year: 1, curriculumId: 5, class_code: "EE2021A", description: "Electrical Engineering Class A - 2021 intake" },
  { id: 10, major_id: 2, academic_year: 1, curriculumId: 5, class_code: "EE2021B", description: "Electrical Engineering Class B - 2021 intake" },
  { id: 11, major_id: 2, academic_year: 2, curriculumId: 6, class_code: "EE2022A", description: "Electrical Engineering Class A - 2022 intake" },
  { id: 12, major_id: 2, academic_year: 2, curriculumId: 6, class_code: "EE2022B", description: "Electrical Engineering Class B - 2022 intake" },
  { id: 13, major_id: 2, academic_year: 3, curriculumId: 7, class_code: "EE2023A", description: "Electrical Engineering Class A - 2023 intake" },
  { id: 14, major_id: 2, academic_year: 3, curriculumId: 7, class_code: "EE2023B", description: "Electrical Engineering Class B - 2023 intake" },
  { id: 15, major_id: 3, academic_year: 1, curriculumId: 8, class_code: "ME2021A", description: "Mechanical Engineering Class A - 2021 intake" },
  { id: 16, major_id: 3, academic_year: 1, curriculumId: 8, class_code: "ME2021B", description: "Mechanical Engineering Class B - 2021 intake" },
  { id: 17, major_id: 3, academic_year: 2, curriculumId: 9, class_code: "ME2022A", description: "Mechanical Engineering Class A - 2022 intake" },
  { id: 18, major_id: 3, academic_year: 2, curriculumId: 9, class_code: "ME2022B", description: "Mechanical Engineering Class B - 2022 intake" },
  { id: 19, major_id: 3, academic_year: 3, curriculumId: 10, class_code: "ME2023A", description: "Mechanical Engineering Class A - 2023 intake" },
  { id: 20, major_id: 3, academic_year: 3, curriculumId: 10, class_code: "ME2023B", description: "Mechanical Engineering Class B - 2023 intake" },
  { id: 21, major_id: 4, academic_year: 1, curriculumId: 11, class_code: "BIO2021A", description: "Biology Class A - 2021 intake" },
  { id: 22, major_id: 4, academic_year: 1, curriculumId: 11, class_code: "BIO2021B", description: "Biology Class B - 2021 intake" },
  { id: 23, major_id: 4, academic_year: 2, curriculumId: 12, class_code: "BIO2022A", description: "Biology Class A - 2022 intake" },
  { id: 24, major_id: 4, academic_year: 2, curriculumId: 12, class_code: "BIO2022B", description: "Biology Class B - 2022 intake" },
  { id: 25, major_id: 4, academic_year: 3, curriculumId: 13, class_code: "BIO2023A", description: "Biology Class A - 2023 intake" },
  { id: 26, major_id: 5, academic_year: 1, curriculumId: 14, class_code: "CHEM2021A", description: "Chemistry Class A - 2021 intake" },
  { id: 27, major_id: 5, academic_year: 1, curriculumId: 14, class_code: "CHEM2021B", description: "Chemistry Class B - 2021 intake" },
  { id: 28, major_id: 5, academic_year: 2, curriculumId: 15, class_code: "CHEM2022A", description: "Chemistry Class A - 2022 intake" },
  { id: 29, major_id: 5, academic_year: 3, curriculumId: 16, class_code: "CHEM2023A", description: "Chemistry Class A - 2023 intake" },
  { id: 30, major_id: 6, academic_year: 1, curriculumId: 17, class_code: "PHYS2021A", description: "Physics Class A - 2021 intake" },
  { id: 31, major_id: 6, academic_year: 2, curriculumId: 18, class_code: "PHYS2022A", description: "Physics Class A - 2022 intake" },
  { id: 32, major_id: 6, academic_year: 2, curriculumId: 18, class_code: "PHYS2022B", description: "Physics Class B - 2022 intake" },
  { id: 33, major_id: 6, academic_year: 3, curriculumId: 19, class_code: "PHYS2023A", description: "Physics Class A - 2023 intake" },
  { id: 34, major_id: 7, academic_year: 1, curriculumId: 20, class_code: "MATH2021A", description: "Mathematics Class A - 2021 intake" },
  { id: 35, major_id: 7, academic_year: 2, curriculumId: 21, class_code: "MATH2022A", description: "Mathematics Class A - 2022 intake" },
  { id: 36, major_id: 7, academic_year: 3, curriculumId: 22, class_code: "MATH2023A", description: "Mathematics Class A - 2023 intake" },
  { id: 37, major_id: 8, academic_year: 1, curriculumId: 23, class_code: "ECO2021A", description: "Economics Class A - 2021 intake" },
  { id: 38, major_id: 8, academic_year: 2, curriculumId: 24, class_code: "ECO2022A", description: "Economics Class A - 2022 intake" },
  { id: 39, major_id: 8, academic_year: 3, curriculumId: 25, class_code: "ECO2023A", description: "Economics Class A - 2023 intake" },
  { id: 40, major_id: 1, academic_year: 4, curriculumId: 4, class_code: "CS2024C", description: "Computer Science Class C - 2024 intake" }
];
