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
import { BookOpen, Building, Calculator, Hash } from "lucide-react";

export function AddSubjectDialog({
  open,
  setOpen,
  onSubmit,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (newSubject: Omit<SubjectModel, "id">) => Promise<void>;
}) {
  const { departments } = useDepartments();
  const { gradingFormulas } = useGradingFormulas();

  const [subject, setSubject] = useState({
    name: "",
    description: "",
    credits: 3,
    faculty_id: departments[0]?.id || 0,
    gradingFormulaId: undefined as number | undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubject((prev) => ({
      ...prev,
      [name]: name === "credits" ? Number(value) || 0 : value,
    }));
  };

  const handleDepartmentChange = (value: string) => {
    const departmentId = Number(value);
    setSubject((prev) => ({
      ...prev,
      faculty_id: departmentId,
    }));
  };

  const handleFormulaChange = (value: string) => {
    setSubject((prev) => ({
      ...prev,
      gradingFormulaId: value === "none" ? undefined : Number(value),
    }));
  };

  // Validation function to check if all required fields are completed
  const isFormValid = () => {
    return (
      subject.name.trim() !== "" &&
      subject.credits > 0 &&
      subject.faculty_id !== 0 &&
      departments.some((dept) => dept.id === subject.faculty_id)
    );
  };

  const handleSave = async () => {
    if (!isFormValid()) {
      return; // Prevent submission if form is not valid
    }

    setIsSubmitting(true);
    try {
      const subjectData: Omit<SubjectModel, "id"> = {
        name: subject.name.trim(),
        description: subject.description.trim() || undefined,
        credits: subject.credits,
        faculty_id: subject.faculty_id,
        gradingFormulaId: subject.gradingFormulaId || 1, // Default to formula ID 1 if none selected
      };

      await onSubmit(subjectData);

      // Reset form
      setSubject({
        name: "",
        description: "",
        credits: 3,
        faculty_id: departments[0]?.id || 0,
        gradingFormulaId: undefined,
      });
      setOpen(false);
    } catch (error) {
      console.error("Error adding subject:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDepartment = departments.find((d) => d.id === subject.faculty_id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="w-5 h-5 text-primary" />
            Add New Subject
          </DialogTitle>
          <DialogDescription className="text-base">
            Create a new subject by filling in the required information below.
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
              value={subject.name}
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
              value={subject.credits}
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
              value={subject.description}
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
            <Select value={subject.faculty_id.toString()} onValueChange={handleDepartmentChange}>
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
              <Select value={subject.gradingFormulaId?.toString() || "none"} onValueChange={handleFormulaChange}>
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

          {/* Selected Information Summary */}
          {selectedDepartment && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Summary:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Subject:</span> {subject.name || "Untitled Subject"}
                </p>
                <p>
                  <span className="font-medium">Credits:</span> {subject.credits}
                </p>
                <p>
                  <span className="font-medium">Department:</span> {selectedDepartment.name}
                </p>
                {subject.gradingFormulaId && (
                  <p>
                    <span className="font-medium">Formula:</span>{" "}
                    {gradingFormulas.find((f) => f.id === subject.gradingFormulaId)?.name || "Not found"}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid() || isSubmitting} className="min-w-[120px]">
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Adding...
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 mr-2" />
                Add Subject
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
