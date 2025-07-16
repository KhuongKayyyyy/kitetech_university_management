import { useEffect, useState } from "react";
import { FacultyModel } from "@/app/api/model/model";
import { departmentService } from "@/app/api/services/departmentService";

export const useDepartments = () => {
  const [departments, setDepartments] = useState<FacultyModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await departmentService.getDepartments();
        setDepartments(data);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return { departments, setDepartments, loading };
};
