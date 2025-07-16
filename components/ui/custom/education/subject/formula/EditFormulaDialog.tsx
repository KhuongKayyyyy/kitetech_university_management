"use client";

import React, { useEffect, useState } from "react";

import { GradingFormulaModel } from "@/app/api/model/GradingFormulaModel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, Edit, Save, Trash2, X } from "lucide-react";

interface EditFormulaDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  formula: GradingFormulaModel;
  onEditFormula?: (formula: GradingFormulaModel) => Promise<void>;
  onDeleteFormula?: (formulaId: number) => Promise<void>;
}

export default function EditFormulaDialog({
  open,
  setOpen,
  formula,
  onEditFormula,
  onDeleteFormula,
}: EditFormulaDialogProps) {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    id: formula.id,
    name: formula.name,
    description: formula.description,
    gradeTypes: formula.gradeTypes.map((gt) => ({ ...gt, weight: Number(gt.weight) || 0 })),
  });

  useEffect(() => {
    setFormData({
      id: formula.id,
      name: formula.name,
      description: formula.description,
      gradeTypes: formula.gradeTypes.map((gt) => ({ ...gt, weight: Number(gt.weight) || 0 })),
    });
  }, [formula]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWeightChange = (gradeTypeId: number, weight: number) => {
    const numericWeight = Number(weight) || 0;
    setFormData((prev) => ({
      ...prev,
      gradeTypes: prev.gradeTypes.map((gt) =>
        gt.id === gradeTypeId ? { ...gt, weight: Math.max(0, Math.min(100, numericWeight)) } : gt,
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
    if (isFormValid() && onEditFormula) {
      setLoading(true);
      try {
        await onEditFormula(formData);
        setOpen(false);
      } catch (error) {
        console.error("Failed to update formula:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (onDeleteFormula) {
      setDeleteLoading(true);
      try {
        await onDeleteFormula(formula.id);
        setOpen(false);
        setShowDeleteConfirm(false);
      } catch (error) {
        console.error("Failed to delete formula:", error);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const totalWeight = getTotalWeight();

  // Define grade type labels for display
  const gradeTypeLabels = {
    QT1: "Quiz 1",
    QT2: "Quiz 2",
    GK: "Midterm",
    CK: "Final",
  } as const;

  return (
    <>
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
                    <div key={gradeType.id} className="space-y-3">
                      <Label
                        htmlFor={`grade-${gradeType.id}`}
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        <div className={`w-3 h-3 ${color.bg} rounded-full`}></div>
                        {gradeTypeLabels[gradeType.gradeType as keyof typeof gradeTypeLabels] || gradeType.gradeType}
                      </Label>
                      <div className="relative">
                        <Input
                          id={`grade-${gradeType.id}`}
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={gradeType.weight}
                          onChange={(e) => handleWeightChange(gradeType.id, Number(e.target.value))}
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
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 hover:bg-red-700 text-white"
                disabled={deleteLoading}
              >
                <Trash2 className="w-4 h-4" />
                Delete Formula
              </Button>

              <div className="flex gap-3">
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
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              Confirm Delete
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete the formula <strong>"{formula.name}"</strong>? This action cannot be
              undone.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm font-medium">⚠️ Warning:</p>
              <p className="text-red-700 text-sm mt-1">
                This will permanently delete the grading formula and all associated grade types.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="flex items-center gap-2 text-white"
            >
              <Trash2 className="w-4 h-4" />
              {deleteLoading ? "Deleting..." : "Delete Formula"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
