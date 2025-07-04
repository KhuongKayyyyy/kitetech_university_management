import React, { useState } from "react";

import { curriculumData, majorData } from "@/app/api/fakedata";
import { Class } from "@/app/api/model/ClassModel";
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

interface AddClassDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddClass?: (classData: Omit<Class, "id">) => void;
}

export default function AddClassDialog({ open, setOpen, onAddClass }: AddClassDialogProps) {
  const [formData, setFormData] = useState({
    majorId: "",
    academicYearId: "",
    curriculumId: "",
    classCode: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.majorId || !formData.academicYearId || !formData.curriculumId || !formData.classCode) {
      return;
    }

    const newClass: Omit<Class, "id"> = {
      majorId: parseInt(formData.majorId),
      academicYearId: parseInt(formData.academicYearId),
      curriculumId: parseInt(formData.curriculumId),
      classCode: formData.classCode,
      description: formData.description || undefined,
    };

    onAddClass?.(newClass);
    setOpen(false);
    setFormData({
      majorId: "",
      academicYearId: "",
      curriculumId: "",
      classCode: "",
      description: "",
    });
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
              <Label htmlFor="classCode" className="text-right">
                Class Code *
              </Label>
              <Input
                id="classCode"
                value={formData.classCode}
                onChange={(e) => handleInputChange("classCode", e.target.value)}
                placeholder="e.g. CS2024A"
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="majorId" className="text-right">
                Major ID *
              </Label>
              <Select value={formData.majorId} onValueChange={(value) => handleInputChange("majorId", value)} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select major" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Computer Science</SelectItem>
                  <SelectItem value="2">Electrical Engineering</SelectItem>
                  <SelectItem value="3">Mechanical Engineering</SelectItem>
                  <SelectItem value="4">Biology</SelectItem>
                  <SelectItem value="5">Chemistry</SelectItem>
                  <SelectItem value="6">Physics</SelectItem>
                  <SelectItem value="7">Mathematics</SelectItem>
                  <SelectItem value="8">Economics</SelectItem>
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
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">2021-2022</SelectItem>
                  <SelectItem value="2">2022-2023</SelectItem>
                  <SelectItem value="3">2023-2024</SelectItem>
                  <SelectItem value="4">2024-2025</SelectItem>
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
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Class</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
