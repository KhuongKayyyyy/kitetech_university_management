import { useEffect, useState } from "react";
import { GradingFormulaModel } from "@/app/api/model/GradingFormulaModel";
import { gradingFormulaService } from "@/app/api/services/gradingFormulaService";

export const useGradingFormulas = () => {
  const [gradingFormulas, setGradingFormulas] = useState<GradingFormulaModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGradingFormulas = async () => {
      try {
        const data = await gradingFormulaService.getGradingFormulas();
        setGradingFormulas(data);
      } finally {
        setLoading(false);
      }
    };

    fetchGradingFormulas();
  }, []);

  return { gradingFormulas, setGradingFormulas, loading };
};
