"use client";

import { useState } from "react";

import { departmentData, majorData } from "@/app/api/fakedata";
import { Subject } from "@/app/api/model/model";
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
import { BookOpen, Building, Edit, GraduationCap } from "lucide-react";

export function SubjectDetailDialog({
  subject,
  open,
  onOpenChange,
}: {
  subject: Subject;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [editedSubject, setEditedSubject] = useState(subject);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedSubject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDepartmentChange = (value: string) => {
    const departmentId = Number(value);
    const newMajorList = majorData[departmentId] || [];
    setEditedSubject((prev) => ({
      ...prev,
      departmentId,
      majorId: (newMajorList[0]?.id || 0).toString(),
    }));
  };

  const handleMajorChange = (value: string) => {
    setEditedSubject((prev) => ({
      ...prev,
      majorId: value,
    }));
  };

  const handleSave = () => {
    if (!editedSubject.name.trim()) {
      return; // Basic validation
    }
    // Handle save logic here
    onOpenChange?.(false);
  };

  const selectedDepartment = departmentData.find((d) => d.id === editedSubject.departmentId);
  const availableMajors = majorData[editedSubject.departmentId] || [];

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

          {/* Department and Major Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Building className="w-4 h-4" />
                Department *
              </Label>
              <Select value={editedSubject.departmentId.toString()} onValueChange={handleDepartmentChange}>
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
              <Select value={editedSubject.majorId.toString()} onValueChange={handleMajorChange}>
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
                  {availableMajors.find((m) => m.id === Number(editedSubject.majorId))?.name || "Not selected"}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!editedSubject.name.trim()} className="min-w-[120px]">
            <Edit className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
