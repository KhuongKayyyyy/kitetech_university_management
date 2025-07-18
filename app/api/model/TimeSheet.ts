export interface TimeSheetModel {
    id: number;
    date: string;
    sheet: string;
    time_of_sheet: string;
  }

  export const MOCK_TIME_SHEETS: TimeSheetModel[] = [
    // Monday
    { id: 1, date: "monday", sheet: "Sheet 1", time_of_sheet: "7h - 9h30" },
    { id: 2, date: "monday", sheet: "Sheet 2", time_of_sheet: "9h30 - 12h" },
    { id: 3, date: "monday", sheet: "Sheet 3", time_of_sheet: "13h - 15h30" },
    { id: 4, date: "monday", sheet: "Sheet 4", time_of_sheet: "15h30 - 18h" },
    
    // Tuesday
    { id: 5, date: "tuesday", sheet: "Sheet 1", time_of_sheet: "7h - 9h30" },
    { id: 6, date: "tuesday", sheet: "Sheet 2", time_of_sheet: "9h30 - 12h" },
    { id: 7, date: "tuesday", sheet: "Sheet 3", time_of_sheet: "13h - 15h30" },
    { id: 8, date: "tuesday", sheet: "Sheet 4", time_of_sheet: "15h30 - 18h" },
    
    // Wednesday
    { id: 9, date: "wednesday", sheet: "Sheet 1", time_of_sheet: "7h - 9h30" },
    { id: 10, date: "wednesday", sheet: "Sheet 2", time_of_sheet: "9h30 - 12h" },
    { id: 11, date: "wednesday", sheet: "Sheet 3", time_of_sheet: "13h - 15h30" },
    { id: 12, date: "wednesday", sheet: "Sheet 4", time_of_sheet: "15h30 - 18h" },
    
    // Thursday
    { id: 13, date: "thursday", sheet: "Sheet 1", time_of_sheet: "7h - 9h30" },
    { id: 14, date: "thursday", sheet: "Sheet 2", time_of_sheet: "9h30 - 12h" },
    { id: 15, date: "thursday", sheet: "Sheet 3", time_of_sheet: "13h - 15h30" },
    { id: 16, date: "thursday", sheet: "Sheet 4", time_of_sheet: "15h30 - 18h" },
    
    // Friday
    { id: 17, date: "friday", sheet: "Sheet 1", time_of_sheet: "7h - 9h30" },
    { id: 18, date: "friday", sheet: "Sheet 2", time_of_sheet: "9h30 - 12h" },
    { id: 19, date: "friday", sheet: "Sheet 3", time_of_sheet: "13h - 15h30" },
    { id: 20, date: "friday", sheet: "Sheet 4", time_of_sheet: "15h30 - 18h" },
    
    // Saturday
    { id: 21, date: "saturday", sheet: "Sheet 1", time_of_sheet: "7h - 9h30" },
    { id: 22, date: "saturday", sheet: "Sheet 2", time_of_sheet: "9h30 - 12h" },
    { id: 23, date: "saturday", sheet: "Sheet 3", time_of_sheet: "13h - 15h30" },
    { id: 24, date: "saturday", sheet: "Sheet 4", time_of_sheet: "15h30 - 18h" },
    
    // Sunday
    { id: 25, date: "sunday", sheet: "Sheet 1", time_of_sheet: "7h - 9h30" },
    { id: 26, date: "sunday", sheet: "Sheet 2", time_of_sheet: "9h30 - 12h" },
    { id: 27, date: "sunday", sheet: "Sheet 3", time_of_sheet: "13h - 15h30" },
    { id: 28, date: "sunday", sheet: "Sheet 4", time_of_sheet: "15h30 - 18h" },
  ];