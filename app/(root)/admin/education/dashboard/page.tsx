import React from "react";

import { MOCK_ACADEMIC_YEARS } from "@/app/api/model/AcademicYearModel";
import AcademicYearItem from "@/components/ui/custom/education/academic_year/AcademicYearItem";

export default function page() {
  const academicYears = MOCK_ACADEMIC_YEARS;
  return (
    <div>
      <h1>Academic Years</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {academicYears.map((academicYear) => (
          <AcademicYearItem key={academicYear.id} academicYear={academicYear} />
        ))}
      </div>
    </div>
  );
}
