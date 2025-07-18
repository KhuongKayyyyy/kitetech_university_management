export interface CurriculumnType {
  id: number;
  name?: string;
  type?: string;
}


export const mockCurriculumnTypes: CurriculumnType[] = [
  {
    id: 1,
    name: "General Education",
    type: "core"
  },
  {
    id: 2,
    name: "Core Requirements",
    type: "core"
  },
  {
    id: 3,
    name: "Major Requirements",
    type: "major"
  },
  {
    id: 4,
    name: "Electives",
    type: "elective"
  },
  {
    id: 5,
    name: "Capstone Project",
    type: "capstone"
  },
  {
    id: 6,
    name: "Internship",
    type: "internship"
  },
  {
    id: 7,
    name: "Language Requirements",
    type: "language"
  },
  {
    id: 8,
    name: "Laboratory",
    type: "laboratory"
  }
];
