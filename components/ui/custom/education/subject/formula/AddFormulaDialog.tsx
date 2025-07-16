"use client";

import React, { useState } from "react";

import { GradingFormulaModel } from "@/app/api/model/GradingFormulaModel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, Plus, Save, X } from "lucide-react";

interface AddFormulaDialogProps {
  trigger?: React.ReactNode;
  onAddFormula?: (formula: GradingFormulaModel) => Promise<void>;
}

export default function AddFormulaDialog({ trigger, onAddFormula }: AddFormulaDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    gradeTypes: [
      { gradeType: "QT1", weight: 0 },
      { gradeType: "QT2", weight: 0 },
      { gradeType: "GK", weight: 0 },
      { gradeType: "CK", weight: 0 },
    ],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWeightChange = (gradeType: string, weight: number) => {
    const numericWeight = Number(weight) || 0;
    setFormData((prev) => ({
      ...prev,
      gradeTypes: prev.gradeTypes.map((gt) =>
        gt.gradeType === gradeType ? { ...gt, weight: Math.max(0, Math.min(100, numericWeight)) } : gt,
      ),
    }));
  };

  const getTotalWeight = () => {
    return formData.gradeTypes.reduce((sum, gt) => {
      const weight = Number(gt.weight) || 0;
      return sum + weight;
    }, 0);
  };

  const isFormValid = () => {
    return formData.name.trim() !== "" && formData.description.trim() !== "" && getTotalWeight() === 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid() && onAddFormula) {
      setLoading(true);
      try {
        const newFormula: GradingFormulaModel = {
          id: 0, // Will be assigned by backend
          name: formData.name,
          description: formData.description,
          gradeTypes: formData.gradeTypes.map((gt, index) => ({
            id: index + 1, // Temporary ID
            gradingFormulaId: 0, // Will be assigned by backend
            gradeType: gt.gradeType as "QT1" | "QT2" | "GK" | "CK",
            weight: gt.weight,
          })),
        };

        await onAddFormula(newFormula);

        setFormData({
          name: "",
          description: "",
          gradeTypes: [
            { gradeType: "QT1", weight: 0 },
            { gradeType: "QT2", weight: 0 },
            { gradeType: "GK", weight: 0 },
            { gradeType: "CK", weight: 0 },
          ],
        });
        setOpen(false);
      } catch (error) {
        console.error("Failed to add formula:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const totalWeight = getTotalWeight();

  // Define grade type labels
  const gradeTypeLabels = {
    QT1: "Quiz 1",
    QT2: "Quiz 2",
    GK: "Midterm",
    CK: "Final",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Formula
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calculator className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-gray-900">Add New Grading Formula</div>
              <div className="text-sm text-gray-500 font-normal mt-1">
                Create a new assessment formula with weight distribution
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
                Total: {totalWeight.toFixed(2)}%
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {formData.gradeTypes.map((gradeType, index) => {
                const colors = [
                  { bg: "bg-blue-500", ring: "focus:ring-blue-500" },
                  { bg: "bg-green-500", ring: "focus:ring-green-500" },
                  { bg: "bg-purple-500", ring: "focus:ring-purple-500" },
                  { bg: "bg-orange-500", ring: "focus:ring-orange-500" },
                ];
                const color = colors[index % colors.length];

                return (
                  <div key={gradeType.gradeType} className="space-y-3">
                    <Label
                      htmlFor={`grade-${gradeType.gradeType}`}
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <div className={`w-3 h-3 ${color.bg} rounded-full`}></div>
                      {gradeTypeLabels[gradeType.gradeType as keyof typeof gradeTypeLabels] || gradeType.gradeType}
                    </Label>
                    <div className="relative">
                      <Input
                        id={`grade-${gradeType.gradeType}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={gradeType.weight}
                        onChange={(e) => handleWeightChange(gradeType.gradeType, Number(e.target.value))}
                        className={`text-center text-lg font-semibold pr-8 focus:ring-2 ${color.ring}`}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        %
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalWeight !== 100 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <div className="text-red-800 font-semibold text-sm">Weight Validation Error</div>
                  <div className="text-red-700 text-sm mt-1">
                    The total weight must equal exactly 100%. Currently: {totalWeight.toFixed(2)}%
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
              disabled={!isFormValid() || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {loading ? "Adding..." : "Add Formula"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
