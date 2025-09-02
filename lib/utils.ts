import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { majorService } from "@/app/api/services/majorService";
import { MajorModel } from "@/app/api/model/model";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Cache for major data to avoid repeated API calls
let majorsCache: MajorModel[] | null = null;

async function getMajorsData(): Promise<MajorModel[]> {
  if (majorsCache) {
    return majorsCache;
  }
  try {
    majorsCache = await majorService.getMajors();
    return majorsCache;
  } catch (error) {
    console.error("Failed to fetch majors:", error);
    return [];
  }
}

export async function getMajorNameById(majorId: string): Promise<string | undefined> {
  const majors = await getMajorsData();
  const major = majors.find((m) => m.id === parseInt(majorId));
  return major?.name;
}

export async function getMajorById(id: number): Promise<MajorModel | undefined> {
  const majors = await getMajorsData();
  return majors.find((m) => m.id === id);
}

// Synchronous version for cases where major data is already available
export function getMajorNameByIdSync(majorId: string, majors: MajorModel[]): string | undefined {
  const major = majors.find((m) => m.id === parseInt(majorId));
  return major?.name;
}

// Clear cache function for when data needs to be refreshed
export function clearMajorsCache(): void {
  majorsCache = null;
}
