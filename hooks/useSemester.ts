import { useEffect, useState } from "react";
import { SemesterModel } from "@/app/api/model/SemesterModel";
import { semesterService } from "@/app/api/services/semesterService";

export const useSemesters = () => {
  const [semesters, setSemesters] = useState<SemesterModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const data = await semesterService.getSemesters();
        setSemesters(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSemesters();
  }, []);

  return { semesters, setSemesters, loading, error };
};

export const useSemestersByAcademicYear = (academicYearId: string) => {
  const [semesters, setSemesters] = useState<SemesterModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSemestersByAcademicYear = async () => {
      try {
        const data = await semesterService.getByAcademicYearId(academicYearId);
        setSemesters(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSemestersByAcademicYear();
  }, [academicYearId]);

  return { semesters, setSemesters, loading, error };
};
