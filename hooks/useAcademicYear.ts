import { AcademicYearModel } from "@/app/api/model/AcademicYearModel";
import { academicYearService } from "@/app/api/services/academicYearService";
import { useEffect, useState } from "react";


export const useAcademicYears = () => {
  const [academicYears, setAcademicYears] = useState<AcademicYearModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const data = await academicYearService.getAcademicYears();
        setAcademicYears(data);
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicYears();
  }, []);

  return { academicYears, setAcademicYears, loading };
};
