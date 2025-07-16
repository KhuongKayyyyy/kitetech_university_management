"use client";

import { useState } from "react";

import { SubjectModel } from "@/app/api/model/model";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDepartments } from "@/hooks/useDeparment";
import { useGradingFormulas } from "@/hooks/useGradingFormula";
import { BookOpen, Building, Calculator, Edit, Hash } from "lucide-react";

export function SubjectDetailDialog({
  subject,
  open,
  onOpenChange,
  onSubmit,
}: {
  subject: SubjectModel;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (updatedSubject: SubjectModel) => Promise<void>;
}) {
  const { departments } = useDepartments();
  const { gradingFormulas } = useGradingFormulas();

  const [editedSubject, setEditedSubject] = useState({
    name: subject.name || "",
    description: subject.description || "",
    credits: subject.credits || 3,
    faculty_id: subject.faculty_id || departments[0]?.id || 0,
    gradingFormulaId: subject.gradingFormulaId,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedSubject((prev) => ({
      ...prev,
      [name]: name === "credits" ? Number(value) || 0 : value,
    }));
  };

  const handleDepartmentChange = (value: string) => {
    const departmentId = Number(value);
    setEditedSubject((prev) => ({
      ...prev,
      faculty_id: departmentId,
    }));
  };

  const handleFormulaChange = (value: string) => {
    setEditedSubject((prev) => ({
      ...prev,
      gradingFormulaId: value === "none" ? 0 : Number(value),
    }));
  };

  // Validation function to check if all required fields are completed
  const isFormValid = () => {
    return (
      editedSubject.name.trim() !== "" &&
      editedSubject.credits > 0 &&
      editedSubject.faculty_id !== 0 &&
      departments.some((dept) => dept.id === editedSubject.faculty_id)
    );
  };

  const handleSave = async () => {
    if (!isFormValid()) {
      return; // Prevent submission if form is not valid
    }

    setIsSubmitting(true);
    try {
      const updatedSubject: SubjectModel = {
        ...subject,
        name: editedSubject.name.trim(),
        description: editedSubject.description.trim() || undefined,
        credits: editedSubject.credits,
        faculty_id: editedSubject.faculty_id,
        gradingFormulaId: editedSubject.gradingFormulaId || 1, // Default to formula ID 1 if none selected
      };

      await onSubmit?.(updatedSubject);
      onOpenChange?.(false);
    } catch (error) {
      console.error("Error updating subject:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDepartment = departments.find((d) => d.id === editedSubject.faculty_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Edit className="w-5 h-5 text-primary" />
            Edit Subject
          </DialogTitle>
          <DialogDescription className="text-base">
            Modify the subject information. Save your changes when done.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Subject Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Subject Name *
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter subject name..."
              value={editedSubject.name}
              onChange={handleInputChange}
              className="w-full"
              required
            />
          </div>

          {/* Credits */}
          <div className="space-y-2">
            <Label htmlFor="credits" className="text-sm font-medium flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Credits *
            </Label>
            <Input
              id="credits"
              name="credits"
              type="number"
              min="1"
              max="10"
              placeholder="Enter credits (1-10)..."
              value={editedSubject.credits}
              onChange={handleInputChange}
              className="w-full"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter subject description..."
              value={editedSubject.description}
              onChange={handleInputChange}
              className="w-full min-h-[80px] resize-none"
              rows={3}
            />
          </div>

          {/* Department Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Building className="w-4 h-4" />
              Department *
            </Label>
            <Select value={editedSubject.faculty_id.toString()} onValueChange={handleDepartmentChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Formula Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Grading Formula (Optional)
            </Label>
            <TooltipProvider>
              <Select value={editedSubject.gradingFormulaId?.toString() || "none"} onValueChange={handleFormulaChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select grading formula" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No formula selected</SelectItem>
                  {gradingFormulas.map((formula) => (
                    <Tooltip key={formula.id}>
                      <TooltipTrigger asChild>
                        <SelectItem value={formula.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{formula.name}</span>
                            <span className="text-xs text-muted-foreground truncate">{formula.description}</span>
                          </div>
                        </SelectItem>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs p-0 border-0 shadow-lg">
                        <div className="bg-white rounded-lg border shadow-xl p-4 space-y-3">
                          <div className="space-y-2 border-b pb-3">
                            <h4 className="font-semibold text-base text-gray-900">{formula.name}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{formula.description}</p>
                          </div>
                          {formula.gradeTypes && formula.gradeTypes.length > 0 && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <p className="text-sm font-medium text-gray-800">Grade Components</p>
                              </div>
                              <div className="space-y-2">
                                {formula.gradeTypes.map((gradeType, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between py-1.5 px-2 bg-gray-50 rounded-md"
                                  >
                                    <span className="text-sm text-gray-700 font-medium">{gradeType.gradeType}</span>
                                    <div className="flex items-center gap-1">
                                      <span className="text-sm font-semibold text-blue-600">{gradeType.weight}%</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="pt-2 border-t">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>Total Weight</span>
                                  <span className="font-medium">
                                    {formula.gradeTypes.reduce((sum, gt) => sum + gt.weight, 0)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </SelectContent>
              </Select>
            </TooltipProvider>
            <p className="text-xs text-gray-500">
              Choose a grading formula to automatically apply assessment weights to this subject.
            </p>
          </div>

          {/* Subject ID (Read-only) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Subject ID</Label>
            <Input value={subject.id || ""} disabled className="w-full bg-gray-50" />
          </div>

          {/* Selected Information Summary */}
          {selectedDepartment && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Summary:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Subject:</span> {editedSubject.name || "Untitled Subject"}
                </p>
                <p>
                  <span className="font-medium">Credits:</span> {editedSubject.credits}
                </p>
                <p>
                  <span className="font-medium">Department:</span> {selectedDepartment.name}
                </p>
                {editedSubject.gradingFormulaId && (
                  <p>
                    <span className="font-medium">Formula:</span>{" "}
                    {gradingFormulas.find((f) => f.id === editedSubject.gradingFormulaId)?.name || "Not found"}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange?.(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid() || isSubmitting} className="min-w-[120px]">
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
