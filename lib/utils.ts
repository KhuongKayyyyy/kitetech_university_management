import {  departmentData, majorData } from "@/app/api/fakedata";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// for fake data
export function getMajorNameById(majorId: string): string | undefined {
  for (const dept of departmentData) {
    const major = dept.majors.find((m) => m.id === parseInt(majorId));
    if (major) return major.name;
  }
  return undefined;
}

export function getDepartmentNameById(
  departmentId: number
): string | undefined {
  const department = departmentData.find((dept) => dept.id === departmentId);
  return department?.name;
}


export function getDepartmentById(departmentId: number) {
  return departmentData.find((dept) => dept.id === departmentId);
}
export const getMajorById = (id: number) => {
  for (const dept of departmentData) {
    const major = dept.majors.find((m) => m.id === id);
    if (major) return major;
  }
  return undefined;
};
