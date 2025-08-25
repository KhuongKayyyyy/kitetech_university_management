"use client";

import React, { useState } from "react";

import { curriculumData, majorData } from "@/app/api/fakedata";
import { ClassModel } from "@/app/api/model/ClassModel";
import { classService } from "@/app/api/services/classService";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAcademicYears } from "@/hooks/useAcademicYear";
import { useMajors } from "@/hooks/useMajor";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddClassDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddClass?: (classData: ClassModel) => void;
}

export default function AddClassDialog({ open, setOpen, onAddClass }: AddClassDialogProps) {
  const { academicYears } = useAcademicYears();
  const { majors } = useMajors();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    majorId: "",
    academicYearId: "",
    curriculumId: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.majorId || !formData.academicYearId || !formData.curriculumId) {
      return;
    }

    const newClass: Omit<ClassModel, "id"> = {
      major_id: parseInt(formData.majorId),
      academic_year: parseInt(formData.academicYearId),
      curriculumId: parseInt(formData.curriculumId),
      description: formData.description || undefined,
    };

    try {
      setLoading(true);
      const addedClass = await classService.addClass(newClass as ClassModel);
      onAddClass?.(addedClass);
      toast.success("Class added successfully!");
      setOpen(false);
      setFormData({
        majorId: "",
        academicYearId: "",
        curriculumId: "",
        description: "",
      });
    } catch (error) {
      console.error("Error adding class:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>
            Create a new class with the required information. Fill in all the required fields.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="majorId" className="text-right">
                Major ID *
              </Label>
              <Select
                value={formData.majorId}
                onValueChange={(value) => handleInputChange("majorId", value)}
                required
                disabled={loading}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select major" />
                </SelectTrigger>
                <SelectContent>
                  {majors.map((major) => (
                    <SelectItem key={major.id} value={major.id?.toString() || ""}>
                      {major.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="academicYearId" className="text-right">
                Academic Year *
              </Label>
              <Select
                value={formData.academicYearId}
                onValueChange={(value) => handleInputChange("academicYearId", value)}
                required
                disabled={loading}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((academicYear) => (
                    <SelectItem key={academicYear.id} value={academicYear.year?.toString() || ""}>
                      {academicYear.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="curriculumId" className="text-right">
                Curriculum *
              </Label>
              <Select
                value={formData.curriculumId}
                onValueChange={(value) => handleInputChange("curriculumId", value)}
                required
                disabled={loading}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select curriculum" />
                </SelectTrigger>
                <SelectContent>
                  {curriculumData.map((curriculum) => (
                    <SelectItem key={curriculum.id} value={curriculum.id.toString()}>
                      {curriculum.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Class description (optional)"
                className="col-span-3"
                rows={3}
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding Class...
                </>
              ) : (
                "Add Class"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
