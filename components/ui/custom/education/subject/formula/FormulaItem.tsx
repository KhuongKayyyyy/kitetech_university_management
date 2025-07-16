import React, { useState } from "react";

import { GradingFormulaModel } from "@/app/api/model/GradingFormulaModel";

import EditFormulaDialog from "./EditFormulaDialog";

interface FormulaItemProps {
  formula: GradingFormulaModel;
  onUpdateFormula?: (updatedFormula: GradingFormulaModel) => Promise<void>;
  onDeleteFormula?: (formulaId: number) => Promise<void>;
}

export default function FormulaItem({ formula, onUpdateFormula, onDeleteFormula }: FormulaItemProps) {
  const [open, setOpen] = useState(false);

  // Create a mapping of gradeTypes to their weights for easier access
  const gradeTypeWeights = formula.gradeTypes.reduce(
    (acc, gradeType) => {
      acc[gradeType.gradeType] = gradeType.weight;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Define grade type labels
  const gradeTypeLabels = {
    QT1: "Quiz 1",
    QT2: "Quiz 2",
    GK: "Midterm",
    CK: "Final",
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-blue-300 hover:-translate-y-1 group cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
            {formula.name}
          </h3>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
            #{formula.id}
          </span>
        </div>

        <p className="text-gray-600 mb-6 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
          {formula.description}
        </p>

        <div className="grid grid-cols-2 gap-4">
          {formula.gradeTypes.map((gradeType, index) => {
            const colors = [
              {
                bg: "from-blue-50 to-blue-100",
                hoverBg: "group-hover:from-blue-100 group-hover:to-blue-200",
                text: "text-blue-700",
                subText: "text-blue-600",
              },
              {
                bg: "from-green-50 to-green-100",
                hoverBg: "group-hover:from-green-100 group-hover:to-green-200",
                text: "text-green-700",
                subText: "text-green-600",
              },
              {
                bg: "from-purple-50 to-purple-100",
                hoverBg: "group-hover:from-purple-100 group-hover:to-purple-200",
                text: "text-purple-700",
                subText: "text-purple-600",
              },
              {
                bg: "from-orange-50 to-orange-100",
                hoverBg: "group-hover:from-orange-100 group-hover:to-orange-200",
                text: "text-orange-700",
                subText: "text-orange-600",
              },
            ];

            const color = colors[index % colors.length];

            return (
              <div
                key={gradeType.id}
                className={`bg-gradient-to-br ${color.bg} rounded-lg p-4 text-center ${color.hoverBg} transition-all duration-300 transform group-hover:scale-105`}
              >
                <div className={`text-2xl font-bold ${color.text}`}>{gradeType.weight}%</div>
                <div className={`text-sm ${color.subText} font-medium mt-1`}>
                  {gradeTypeLabels[gradeType.gradeType] || gradeType.gradeType}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EditFormulaDialog
        open={open}
        setOpen={setOpen}
        formula={formula}
        onEditFormula={onUpdateFormula}
        onDeleteFormula={onDeleteFormula}
      />
    </>
  );
}
