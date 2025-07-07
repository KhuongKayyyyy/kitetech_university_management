"use client";

import { useState } from "react";

import { departmentData, subjects } from "@/app/api/fakedata";
import { Major } from "@/app/api/model/model";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getDepartmentById } from "@/lib/utils";
import { ArrowRight, BookOpen, Building2, Plus } from "lucide-react";

import DepartmentItem from "../department/DepartmentItem";
import { SubjectInMajorTable } from "../subject/SubjectInMajorDialog";

interface NewMajorDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd?: (newMajor: Major) => void;
}

export function NewMajorDialog({ open, setOpen, onAdd }: NewMajorDialogProps) {
  const [newMajor, setNewMajor] = useState<Major>({
    id: 0,
    name: "",
    description: "",
    departmentId: departmentData[0]?.id ?? 0,
  });

  const [newlySelectedDepartment, setNewlySelectedDepartment] = useState(() =>
    getDepartmentById(newMajor.departmentId),
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewMajor((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMajor((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  const handleDepartmentChange = (value: string) => {
    const newDepartmentId = parseInt(value, 10);
    const newDepartment = getDepartmentById(newDepartmentId);
    setNewMajor((prev) => ({
      ...prev,
      departmentId: newDepartmentId,
    }));
    setNewlySelectedDepartment(newDepartment);
  };

  const handleSave = () => {
    if (onAdd) onAdd(newMajor);
    setOpen(false);
    setNewMajor({
      id: 0,
      name: "",
      description: "",
      departmentId: departmentData[0]?.id ?? 0,
    });
  };

  const handleCancel = () => {
    setOpen(false);
    setNewMajor({
      id: 0,
      name: "",
      description: "",
      departmentId: departmentData[0]?.id ?? 0,
    });
    setNewlySelectedDepartment(getDepartmentById(departmentData[0]?.id ?? 0));
  };

  const selectedDepartment = getDepartmentById(newMajor.departmentId);
  const isFormValid = newMajor.name.trim() !== "" && newMajor.description?.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-5 w-5" />
            Create New Major
          </DialogTitle>
          <DialogDescription>
            Define the major's basic information, assign it to a department, and configure its subjects.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* Basic Information */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Major Name *
                  </Label>
                  <Input
                    id="name"
                    value={newMajor.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Computer Science"
                    className="hover:border-primary/50 focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium">
                    Department *
                  </Label>
                  <Select value={newMajor.departmentId.toString()} onValueChange={handleDepartmentChange}>
                    <SelectTrigger className="hover:border-primary/50 focus:border-primary transition-colors">
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentData.map((department) => (
                        <SelectItem key={department.id} value={department.id.toString()}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {department.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={newMajor.description}
                  onChange={handleDescriptionChange}
                  placeholder="Provide a detailed description of this major..."
                  className="min-h-[100px] hover:border-primary/50 focus:border-primary transition-colors resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Department Preview */}
          {(selectedDepartment || newlySelectedDepartment) && (
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Department Assignment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg">
                  {selectedDepartment && (
                    <div className="hover:scale-105 transition-transform">
                      <DepartmentItem department={selectedDepartment} />
                    </div>
                  )}
                  {newlySelectedDepartment && selectedDepartment?.id !== newlySelectedDepartment.id && (
                    <>
                      <ArrowRight className="h-5 w-5 text-muted-foreground animate-pulse" />
                      <div className="hover:scale-105 transition-transform">
                        <DepartmentItem department={newlySelectedDepartment} />
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Subjects Configuration */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Subjects Configuration
              </CardTitle>
              <DialogDescription>Add and manage subjects that belong to this major.</DialogDescription>
            </CardHeader>
            <CardContent>
              <SubjectInMajorTable major={newMajor} setMajor={setNewMajor} />
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleCancel} className="hover:bg-muted transition-colors">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid}
              className="hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Major
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
