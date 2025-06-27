"use client";

import { useState } from "react";

import { departmentData, formulaSubjects, majors } from "@/app/api/fakedata";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Building, Calculator, GraduationCap } from "lucide-react";

export function AddSubjectDialog({
  open,
  setOpen,
  onSubmit,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (newSubject: {
    name: string;
    description: string;
    departmentId: number;
    majorId: number;
    formulaId?: number;
  }) => void;
}) {
  const [subject, setSubject] = useState({
    name: "",
    description: "",
    departmentId: departmentData[0]?.id || 0,
    majorId: majors[departmentData[0]?.id]?.[0]?.id || 0,
    formulaId: undefined as number | undefined,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSubject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDepartmentChange = (value: string) => {
    const departmentId = Number(value);
    const newMajorList = majors[departmentId] || [];
    setSubject((prev) => ({
      ...prev,
      departmentId,
      majorId: newMajorList[0]?.id || 0,
    }));
  };

  const handleMajorChange = (value: string) => {
    setSubject((prev) => ({
      ...prev,
      majorId: Number(value),
    }));
  };

  const handleFormulaChange = (value: string) => {
    setSubject((prev) => ({
      ...prev,
      formulaId: value === "none" ? undefined : Number(value),
    }));
  };

  const handleSave = () => {
    if (!subject.name.trim()) {
      return; // Basic validation
    }
    onSubmit(subject);
    setSubject({
      name: "",
      description: "",
      departmentId: departmentData[0]?.id || 0,
      majorId: majors[departmentData[0]?.id]?.[0]?.id || 0,
      formulaId: undefined,
    });
    setOpen(false);
  };

  const selectedDepartment = departmentData.find((d) => d.id === subject.departmentId);
  const availableMajors = majors[subject.departmentId] || [];

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

          {/* Department and Major Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Building className="w-4 h-4" />
                Department *
              </Label>
              <Select value={subject.departmentId.toString()} onValueChange={handleDepartmentChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departmentData.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Major *
              </Label>
              <Select value={subject.majorId.toString()} onValueChange={handleMajorChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select major" />
                </SelectTrigger>
                <SelectContent>
                  {availableMajors.map((major) => (
                    <SelectItem key={major.id} value={major.id.toString()}>
                      {major.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Formula Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Grading Formula (Optional)
            </Label>
            <Select value={subject.formulaId?.toString() || "none"} onValueChange={handleFormulaChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select grading formula" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No formula selected</SelectItem>
                {formulaSubjects.map((formula) => (
                  <SelectItem key={formula.id} value={formula.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{formula.name}</span>
                      <span className="text-xs text-gray-500">
                        Final: {formula.final}% • Midterm Test: {formula.midtermTest}% • Midterm Report:{" "}
                        {formula.midtermReport}% • Participation: {formula.participation}%
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  <span className="font-medium">Department:</span> {selectedDepartment.name}
                </p>
                <p>
                  <span className="font-medium">Major:</span>{" "}
                  {availableMajors.find((m) => m.id === subject.majorId)?.name || "Not selected"}
                </p>
                {subject.formulaId && (
                  <p>
                    <span className="font-medium">Formula:</span>{" "}
                    {formulaSubjects.find((f) => f.id === subject.formulaId)?.name || "Not found"}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!subject.name.trim()} className="min-w-[120px]">
            <BookOpen className="w-4 h-4 mr-2" />
            Save Subject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
