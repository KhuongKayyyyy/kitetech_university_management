"use client";

import { useState } from "react";

import { DepartmentModel } from "@/app/api/model/model";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { MajorInDepartTable } from "../major/MajorInDepartTable";

export function DepartmentDialog({
  department,
  isIcon,
  open,
  onOpenChange,
  handleSave,
  handleDelete,
}: {
  department: DepartmentModel;
  isIcon?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  handleSave?: (department: DepartmentModel) => void;
  handleDelete?: () => void;
}) {
  // Ensure majors is initialized to avoid undefined access
  const [editedDepartment, setEditedDepartment] = useState<DepartmentModel>({
    ...department,
    majors: department.majors ?? [],
  });

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
              <Select
                value={editedDepartment.dean}
                onValueChange={(value) => setEditedDepartment((prev) => ({ ...prev, dean: value }))}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a dean" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-smith">Dr. John Smith</SelectItem>
                  <SelectItem value="mary-johnson">Dr. Mary Johnson</SelectItem>
                  <SelectItem value="robert-wilson">Dr. Robert Wilson</SelectItem>
                  <SelectItem value="susan-brown">Dr. Susan Brown</SelectItem>
                  <SelectItem value="michael-davis">Dr. Michael Davis</SelectItem>
                  <SelectItem value="jennifer-garcia">Dr. Jennifer Garcia</SelectItem>
                  <SelectItem value="david-miller">Dr. David Miller</SelectItem>
                  <SelectItem value="lisa-anderson">Dr. Lisa Anderson</SelectItem>
                </SelectContent>
              </Select>
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

        <DialogFooter className="flex gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              console.log("Delete department:", editedDepartment.id);
              handleDelete?.();
            }}
            className="flex items-center gap-2 text-white"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" onClick={() => handleSave?.(editedDepartment)} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
