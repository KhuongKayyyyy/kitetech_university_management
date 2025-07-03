import React from "react";

import { SubjectType } from "@/constants/enum/SubjectType";
import { CheckCircle2 } from "lucide-react";

interface Board {
  id: string;
  name: string;
  type: SubjectType;
  columnOrder: string[];
  semesterColumn: { [key: string]: { id: string; title: string; subjectIds: string[] } };
}

interface Step {
  id: number;
  name: string;
  type: string;
}

interface CurriculumSummaryProps {
  steps: Step[];
  boards: Board[];
}

export default function CurriculumSummary({ steps, boards }: CurriculumSummaryProps) {
  return (
    <div className="mt-8 p-4 bg-muted/20 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">Curriculum Summary</h3>
      {steps.map((step) => (
        <div key={step.id} className="mb-4">
          <h4 className="font-medium mb-2">{step.name}</h4>
          <div className="text-sm text-muted-foreground">
            {boards.find((board) => board.type === step.type) ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>Added</span>
              </div>
            ) : (
              <span>Not added yet</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
