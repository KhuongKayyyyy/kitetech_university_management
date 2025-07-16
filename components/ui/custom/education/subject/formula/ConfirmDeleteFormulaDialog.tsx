import React from "react";

import { GradingFormulaModel } from "@/app/api/model/GradingFormulaModel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Calculator, Trash2 } from "lucide-react";

interface ConfirmDeleteFormulaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formulas: GradingFormulaModel[];
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function ConfirmDeleteFormulaDialog({
  open,
  onOpenChange,
  formulas,
  onConfirm,
  onCancel,
  isDeleting = false,
}: ConfirmDeleteFormulaDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  const getTotalWeight = (gradeTypes: GradingFormulaModel["gradeTypes"]) => {
    return gradeTypes.reduce((sum, gt) => sum + (Number(gt.weight) || 0), 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-left text-red-600">Delete Grading Formulas</DialogTitle>
              <DialogDescription className="text-left">
                Are you sure you want to delete the following grading formula{formulas.length > 1 ? "s" : ""}? This
                action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="my-4 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {formulas.map((formula) => {
              const totalWeight = getTotalWeight(formula.gradeTypes);
              const isValidWeight = totalWeight === 100;

              return (
                <div key={formula.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calculator className="h-4 w-4 text-primary" />
                        <h4 className="font-semibold text-gray-900">{formula.name}</h4>
                        <span className="text-xs text-gray-500 font-mono">#{formula.id}</span>
                      </div>
                      {formula.description && <p className="text-sm text-gray-600 mb-2">{formula.description}</p>}
                    </div>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        isValidWeight
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {totalWeight.toFixed(1)}%
                    </div>
                  </div>

                  {formula.gradeTypes && formula.gradeTypes.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-700 mb-2">Grade Types:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {formula.gradeTypes.map((gradeType, index) => {
                          const colors = [
                            "bg-blue-50 text-blue-700 border-blue-200",
                            "bg-green-50 text-green-700 border-green-200",
                            "bg-purple-50 text-purple-700 border-purple-200",
                            "bg-orange-50 text-orange-700 border-orange-200",
                          ];
                          const color = colors[index % colors.length];

                          return (
                            <div
                              key={gradeType.id}
                              className={`flex justify-between items-center px-3 py-2 rounded-md text-xs border ${color}`}
                            >
                              <span className="font-medium">{gradeType.gradeType}</span>
                              <span className="font-semibold">{gradeType.weight}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800 text-sm font-medium">⚠️ Warning:</p>
              <p className="text-red-700 text-sm mt-1">
                This will permanently delete {formulas.length} grading formula{formulas.length > 1 ? "s" : ""} and all
                associated grade types. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
            className="w-full sm:w-auto border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete {formulas.length} Formula{formulas.length > 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
