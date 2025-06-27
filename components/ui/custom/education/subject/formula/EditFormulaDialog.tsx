"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, Edit, Save, X } from "lucide-react";

interface EditFormulaDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;

  formula: {
    id: number;
    name: string;
    description: string;
    formula: string;
    participation: number;
    midtermTest: number;
    midtermReport: number;
    final: number;
  };
  onEditFormula?: (formula: {
    id: number;
    name: string;
    description: string;
    formula: string;
    participation: number;
    midtermTest: number;
    midtermReport: number;
    final: number;
  }) => void;
}

export default function EditFormulaDialog({ open, setOpen, formula, onEditFormula }: EditFormulaDialogProps) {
  const [formData, setFormData] = useState({
    id: formula.id,
    name: formula.name,
    description: formula.description,
    formula: formula.formula,
    participation: formula.participation,
    midtermTest: formula.midtermTest,
    midtermReport: formula.midtermReport,
    final: formula.final,
  });

  useEffect(() => {
    setFormData({
      id: formula.id,
      name: formula.name,
      description: formula.description,
      formula: formula.formula,
      participation: formula.participation,
      midtermTest: formula.midtermTest,
      midtermReport: formula.midtermReport,
      final: formula.final,
    });
  }, [formula]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWeightChange = (field: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, Math.min(100, value)),
    }));
  };

  const getTotalWeight = () => {
    return formData.participation + formData.midtermTest + formData.midtermReport + formData.final;
  };

  const isFormValid = () => {
    return formData.name.trim() !== "" && formData.description.trim() !== "" && getTotalWeight() === 100;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid() && onEditFormula) {
      onEditFormula(formData);
      setOpen(false);
    }
  };

  const totalWeight = getTotalWeight();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calculator className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-gray-900">Edit Grading Formula</div>
              <div className="text-sm text-gray-500 font-normal mt-1">
                Modify the assessment weights and formula details
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                Formula Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter formula name"
                className="focus:ring-2 focus:ring-blue-500 border-gray-300"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter formula description"
                rows={3}
                className="focus:ring-2 focus:ring-blue-500 border-gray-300 resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="formula" className="text-sm font-semibold text-gray-700">
                Formula Expression
              </Label>
              <Input
                id="formula"
                value={formData.formula}
                onChange={(e) => handleInputChange("formula", e.target.value)}
                placeholder="e.g., (P * 0.1) + (MT * 0.3) + (MR * 0.2) + (F * 0.4)"
                className="focus:ring-2 focus:ring-blue-500 border-gray-300 font-mono text-sm"
              />
            </div>
          </div>

          {/* Assessment Weights */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold text-gray-800">Assessment Weights</Label>
              <div
                className={`
                px-4 py-2 rounded-full text-sm font-bold
                ${
                  totalWeight === 100
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }
              `}
              >
                Total: {totalWeight}%
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="participation" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Participation
                </Label>
                <div className="relative">
                  <Input
                    id="participation"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.participation}
                    onChange={(e) => handleWeightChange("participation", Number(e.target.value))}
                    className="text-center text-lg font-semibold pr-8 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="midtermTest" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Midterm Test
                </Label>
                <div className="relative">
                  <Input
                    id="midtermTest"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.midtermTest}
                    onChange={(e) => handleWeightChange("midtermTest", Number(e.target.value))}
                    className="text-center text-lg font-semibold pr-8 focus:ring-2 focus:ring-green-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="midtermReport" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  Midterm Report
                </Label>
                <div className="relative">
                  <Input
                    id="midtermReport"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.midtermReport}
                    onChange={(e) => handleWeightChange("midtermReport", Number(e.target.value))}
                    className="text-center text-lg font-semibold pr-8 focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="final" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  Final Exam
                </Label>
                <div className="relative">
                  <Input
                    id="final"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.final}
                    onChange={(e) => handleWeightChange("final", Number(e.target.value))}
                    className="text-center text-lg font-semibold pr-8 focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                </div>
              </div>
            </div>

            {totalWeight !== 100 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <div className="text-red-800 font-semibold text-sm">Weight Validation Error</div>
                  <div className="text-red-700 text-sm mt-1">
                    The total weight must equal exactly 100%. Currently: {totalWeight}%
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 hover:bg-gray-50"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid()}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
