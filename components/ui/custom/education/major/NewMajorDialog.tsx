"use client";

import { useEffect, useMemo, useState } from "react";

import { MajorModel } from "@/app/api/model/model";
import { majorService } from "@/app/api/services/majorService";
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
import { useDepartments } from "@/hooks/useDeparment";
import { ArrowRight, BookOpen, Building2, Plus } from "lucide-react";
import { toast, Toaster } from "sonner";

import DepartmentItem from "../department/DepartmentItem";

interface NewMajorDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd?: (newMajor: MajorModel) => void;
}

export function NewMajorDialog({ open, setOpen, onAdd }: NewMajorDialogProps) {
  const { departments, setDepartments, loading } = useDepartments();
  const [newMajor, setNewMajor] = useState<MajorModel>({
    id: 0,
    name: "Test Major Name",
    description:
      "This is a test description for the major. It provides a detailed overview of what this major entails.",
    code: "TST",
    faculty: undefined,
  });

  useEffect(() => {
    if (departments.length > 0 && !newMajor.faculty) {
      setNewMajor((prev) => ({
        ...prev,
        faculty: departments[0],
      }));
    }
  }, [departments, newMajor.faculty]);

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
    const selectedDepartmentId = parseInt(value, 10);
    const selectedDepartment = departments.find((dept) => dept.id === selectedDepartmentId);

    if (selectedDepartment) {
      setNewMajor((prev) => ({
        ...prev,
        faculty: selectedDepartment,
      }));
    }
  };

  const handleSave = async () => {
    if (!newMajor.faculty?.id) {
      toast.error("Please select a department for the major.");
      return;
    }
    if (onAdd) {
      onAdd(newMajor);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    setNewMajor({
      id: 0,
      name: "Test Major Name",
      description:
        "This is a test description for the major. It provides a detailed overview of what this major entails.",
      code: "TST",
      faculty: departments.length > 0 ? departments[0] : undefined,
    });
  };

  // Memoize selectedDepartment to ensure it updates when newMajor.faculty changes
  const selectedDepartment = useMemo(() => {
    return newMajor.faculty;
  }, [newMajor.faculty]);

  const isFormValid =
    newMajor.name.trim() !== "" &&
    newMajor.description?.trim() !== "" &&
    newMajor.code?.trim() !== "" &&
    newMajor.faculty?.id;

  return (
    <>
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
                    <Label htmlFor="code" className="text-sm font-medium">
                      Major Code *
                    </Label>
                    <Input
                      id="code"
                      value={newMajor.code}
                      onChange={handleInputChange}
                      placeholder="e.g., CS"
                      className="hover:border-primary/50 focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium">
                    Department *
                  </Label>
                  <Select value={newMajor.faculty?.id?.toString() || ""} onValueChange={handleDepartmentChange}>
                    <SelectTrigger>
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
            {selectedDepartment && (
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Department Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="hover:scale-105 transition-transform" key={selectedDepartment.id}>
                      <DepartmentItem
                        department={selectedDepartment}
                        onDelete={() => {}}
                        isSelected={false}
                        onSelect={() => {}}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <Separator />
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
      <Toaster />
    </>
  );
}
