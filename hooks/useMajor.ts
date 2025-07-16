import { useEffect, useState } from "react";
import { MajorModel } from "@/app/api/model/model";
import { majorService } from "@/app/api/services/majorService";

export const useMajors = () => {
  const [majors, setMajors] = useState<MajorModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const data = await majorService.getMajors();
        setMajors(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMajors();
  }, []);

  return { majors, setMajors, loading, error };
};
