"use client";

import { useEffect, useState } from "react";

import { FacultyModel } from "@/app/api/model/model";
import { departmentService } from "@/app/api/services/departmentService";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, Trash2, X } from "lucide-react";

import { MajorInDepartTable } from "../major/MajorInDepartTable";

export function DepartmentDialog({
  department,
  isIcon,
  open,
  onOpenChange,
  handleSave,
  handleDelete,
}: {
  department: FacultyModel;
  isIcon?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  handleSave?: (department: FacultyModel) => void;
  handleDelete?: () => void;
}) {
  // Ensure majors is initialized to avoid undefined access
  const [editedDepartment, setEditedDepartment] = useState<FacultyModel>({
    ...department,
    majors: department.majors ?? [],
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch department data when dialog opens
  useEffect(() => {
    const fetchDepartmentData = async () => {
      if (open && department.id) {
        setIsLoading(true);
        try {
          const departmentData = await departmentService.getDepartmentById(department.id);
          setEditedDepartment({
            ...departmentData,
            majors: departmentData.majors ?? [],
          });
        } catch (error) {
          console.error("Failed to fetch department data:", error);
          // Fallback to initial department data
          setEditedDepartment({
            ...department,
            majors: department.majors ?? [],
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDepartmentData();
  }, [open, department]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setEditedDepartment((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCancel = () => {
    setEditedDepartment({
      ...department,
      majors: department.majors ?? [],
    });
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {isIcon ? (
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 shadow-sm border"
            aria-label="Edit Department"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
      ) : null}

      <DialogContent className="sm:max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-foreground">Edit Department</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Make changes to the department information and manage its majors. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6 py-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Department Name</Label>
                <Skeleton className="h-11 w-full" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Contact Information</Label>
                <Skeleton className="h-[100px] w-full" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Dean</Label>
                <Skeleton className="h-11 w-full" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Code</Label>
                <Skeleton className="h-11 w-full" />
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="space-y-4">
                <Skeleton className="h-7 w-48" />
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Department Name
                </Label>
                <Input
                  id="name"
                  value={editedDepartment.name}
                  onChange={handleInputChange}
                  placeholder="Enter department name..."
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_info" className="text-sm font-medium text-foreground">
                  Contact Information
                </Label>
                <Textarea
                  id="contact_info"
                  value={editedDepartment.contact_info}
                  onChange={handleInputChange}
                  placeholder="Enter contact information..."
                  className="min-h-[100px] resize-none"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dean" className="text-sm font-medium text-foreground">
                  Dean
                </Label>
                <Input
                  id="dean"
                  value={editedDepartment.dean || ""}
                  onChange={handleInputChange}
                  placeholder="Enter dean name..."
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dean" className="text-sm font-medium text-foreground">
                  Code
                </Label>
                <Input
                  id="code"
                  value={editedDepartment.code || ""}
                  onChange={handleInputChange}
                  placeholder="Enter code..."
                  className="h-11"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Department Majors</h3>

                <MajorInDepartTable
                  department={{
                    ...editedDepartment,
                    majors: editedDepartment.majors ?? [],
                  }}
                  setDepartment={setEditedDepartment}
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-3 pt-6 border-t">
          {isLoading ? (
            <>
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-28" />
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  console.log("Delete department:", editedDepartment.id);
                  handleDelete?.();
                }}
                className="flex items-center gap-2 text-white"
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() => handleSave?.(editedDepartment)}
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <Save className="h-4 w-4" />
                Save changes
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
