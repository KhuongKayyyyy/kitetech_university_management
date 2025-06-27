import React, { useState } from "react";

import { Formula } from "@/app/api/model/FormulaModel";

import EditFormulaDialog from "./EditFormulaDialog";

interface FormulaItemProps {
  formula: Formula;
}

export default function FormulaItem({ formula }: FormulaItemProps) {
  const [open, setOpen] = useState(false);

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
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 transform group-hover:scale-105">
            <div className="text-2xl font-bold text-blue-700">{formula.participation}%</div>
            <div className="text-sm text-blue-600 font-medium mt-1">Participation</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center group-hover:from-green-100 group-hover:to-green-200 transition-all duration-300 transform group-hover:scale-105">
            <div className="text-2xl font-bold text-green-700">{formula.midtermTest}%</div>
            <div className="text-sm text-green-600 font-medium mt-1">Midterm Test</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center group-hover:from-purple-100 group-hover:to-purple-200 transition-all duration-300 transform group-hover:scale-105">
            <div className="text-2xl font-bold text-purple-700">{formula.midtermReport}%</div>
            <div className="text-sm text-purple-600 font-medium mt-1">Midterm Report</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 text-center group-hover:from-orange-100 group-hover:to-orange-200 transition-all duration-300 transform group-hover:scale-105">
            <div className="text-2xl font-bold text-orange-700">{formula.final}%</div>
            <div className="text-sm text-orange-600 font-medium mt-1">Final Exam</div>
          </div>
        </div>
      </div>

      <EditFormulaDialog open={open} setOpen={setOpen} formula={formula} onEditFormula={() => {}} />
    </>
  );
}
