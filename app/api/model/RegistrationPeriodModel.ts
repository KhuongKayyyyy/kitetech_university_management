import { RegisPeriodStatus } from "@/constants/enum/RegisPeriodStatus";

export interface RegistrationPeriod {
  id: number;
  semesterId: number;
  startDate: string;
  endDate: string;
  status: RegisPeriodStatus;
  description?: string;
}


// Mock data for testing and development
export const mockRegistrationPeriods: RegistrationPeriod[] = [
  {
    id: 1,
    semesterId: 1,
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    status: RegisPeriodStatus.Open,
    description: "Spring 2024 Registration Period"
  },
  {
    id: 2,
    semesterId: 2,
    startDate: "2024-06-01",
    endDate: "2024-07-01",
    status: RegisPeriodStatus.Closed,
    description: "Summer 2024 Registration Period"
  },
  {
    id: 3,
    semesterId: 3,
    startDate: "2024-08-15",
    endDate: "2024-09-15",
    status: RegisPeriodStatus.Open,
    description: "Fall 2024 Registration Period"
  },
  {
    id: 4,
    semesterId: 4,
    startDate: "2023-11-01",
    endDate: "2023-12-01",
    status: RegisPeriodStatus.Closed,
    description: "Fall 2023 Registration Period"
  },
  {
    id: 5,
    semesterId: 5,
    startDate: "2023-08-01",
    endDate: "2023-09-01",
    status: RegisPeriodStatus.Cancelled,
    description: "Summer 2023 Registration Period"
  }
];
