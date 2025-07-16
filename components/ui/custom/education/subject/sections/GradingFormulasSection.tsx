"use client";

import React, { useState } from "react";

import { GradingFormulaModel } from "@/app/api/model/GradingFormulaModel";
import { gradingFormulaService } from "@/app/api/services/gradingFormulaService";
import { Button } from "@/components/ui/button";
import AddFormulaDialog from "@/components/ui/custom/education/subject/formula/AddFormulaDialog";
import FormulaItem from "@/components/ui/custom/education/subject/formula/FormulaItem";
import FormulaTable from "@/components/ui/custom/education/subject/formula/FormulaTable";
import { useGradingFormulas } from "@/hooks/useGradingFormula";
import { Calculator, Grid, List } from "lucide-react";
import { toast } from "sonner";

export default function GradingFormulasSection() {
  const { gradingFormulas, setGradingFormulas, loading } = useGradingFormulas();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const handleAddFormula = async (formula: GradingFormulaModel) => {
    try {
      const createdFormula = await gradingFormulaService.addGradingFormula(formula);
      setGradingFormulas([...gradingFormulas, createdFormula]);
      toast.success("Grading formula created successfully!");
    } catch (error) {
      console.error("Failed to add grading formula:", error);
      toast.error("Failed to create grading formula. Please try again.");
    }
  };

  const handleUpdateFormula = async (updatedFormula: GradingFormulaModel) => {
    try {
      const result = await gradingFormulaService.updateGradingFormula(updatedFormula);
      setGradingFormulas((prevFormulas) =>
        prevFormulas.map((formula) => (formula.id === updatedFormula.id ? result : formula)),
      );
      toast.success("Grading formula updated successfully!");
    } catch (error) {
      console.error("Failed to update grading formula:", error);
      toast.error("Failed to update grading formula. Please try again.");
    }
  };

  const handleDeleteFormula = async (formulaId: number) => {
    try {
      // Find the formula to get its complete data including gradeTypes
      const formulaToDelete = gradingFormulas.find((formula) => formula.id === formulaId);

      await gradingFormulaService.deleteGradingFormula(formulaId, formulaToDelete);
      setGradingFormulas((prevFormulas) => prevFormulas.filter((formula) => formula.id !== formulaId));
      toast.success("Grading formula deleted successfully!");
    } catch (error) {
      console.error("Failed to delete grading formula:", error);
      toast.error("Failed to delete grading formula. Please try again.");
      throw error; // Re-throw to allow proper error handling in the table
    }
  };

  const handleEditFormulaFromTable = (formula: GradingFormulaModel) => {
    // For table view, we can trigger the edit by opening a dialog
    // This would require implementing an edit dialog state management
    console.log("Edit formula from table:", formula);
    // You could implement a separate edit dialog state here
  };

  if (loading) {
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
          <div className="w-[140px] h-10 bg-gray-200 rounded-md animate-pulse"></div>
        </div>

        {/* Loading Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="ml-4">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

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

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg p-1">
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="h-8 px-3"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="h-8 px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Add Formula Button - only show in cards view since table has its own */}
          {viewMode === "cards" && <AddFormulaDialog onAddFormula={handleAddFormula} />}
        </div>
      </div>

      {/* Content Display */}
      {gradingFormulas.length === 0 ? (
        <div className="text-center py-12">
          <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No formulas found</h3>
          <p className="text-gray-600">Create your first grading formula to get started.</p>
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <FormulaTable
            formulas={gradingFormulas}
            onEditFormula={handleEditFormulaFromTable}
            onDeleteFormula={handleDeleteFormula}
            onAddFormula={handleAddFormula}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gradingFormulas.map((formula) => (
            <FormulaItem
              key={formula.id}
              formula={formula}
              onUpdateFormula={handleUpdateFormula}
              onDeleteFormula={handleDeleteFormula}
            />
          ))}
        </div>
      )}
    </>
  );
}
