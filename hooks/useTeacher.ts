import { useEffect, useState } from "react";
import { Teacher } from "@/app/api/model/TeacherModel";
import { teacherService } from "@/app/api/services/teacherService";

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await teacherService.getTeachers();
        setTeachers(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return { teachers, setTeachers, loading, error };
};
