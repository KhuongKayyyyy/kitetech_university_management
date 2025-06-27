"use client";

import { useState } from "react";

import { Department } from "@/app/api/model/model";
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
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, X } from "lucide-react";

import { MajorInDepartTable } from "../major/MajorInDepartTable";

export function DepartmentDialog({
  department,
  isIcon,
  open,
  onOpenChange,
}: {
  department: Department;
  isIcon?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [editedDepartment, setEditedDepartment] = useState(department);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setEditedDepartment((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    onOpenChange?.(false);
  };

  const handleCancel = () => {
    setEditedDepartment(department);
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
              <Label htmlFor="description" className="text-sm font-medium text-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                value={editedDepartment.description}
                onChange={handleInputChange}
                placeholder="Enter department description..."
                className="min-h-[100px] resize-none"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon" className="text-sm font-medium text-foreground">
                Icon
              </Label>
              <Input
                id="icon"
                value={editedDepartment.icon}
                onChange={handleInputChange}
                placeholder="Enter icon name or URL..."
                className="h-11"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Department Majors</h3>
              <MajorInDepartTable department={editedDepartment} />
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={handleCancel} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
