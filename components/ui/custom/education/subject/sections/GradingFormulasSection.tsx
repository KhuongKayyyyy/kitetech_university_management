"use client";

import React from "react";

import { formulaSubjects } from "@/app/api/fakedata";
import AddFormulaDialog from "@/components/ui/custom/education/subject/formula/AddFormulaDialog";
import FormulaItem from "@/components/ui/custom/education/subject/formula/FormulaItem";
import { Calculator } from "lucide-react";

export default function GradingFormulasSection() {
  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Calculator className="w-6 h-6 text-primary" />
            Grading Formulas
          </h2>
          <p className="text-gray-600 mt-1">Manage assessment weight distributions for different subjects</p>
        </div>
        <AddFormulaDialog />
      </div>

      {/* Content Display */}
      {formulaSubjects.length === 0 ? (
        <div className="text-center py-12">
          <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No formulas found</h3>
          <p className="text-gray-600">Create your first grading formula to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {formulaSubjects.map((formula) => (
            <FormulaItem key={formula.id} formula={formula} />
          ))}
        </div>
      )}
    </>
  );
}
