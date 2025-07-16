"use client";

import { useState } from "react";

import { subjects } from "@/app/api/fakedata";
import { MajorModel } from "@/app/api/model/model";
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
import { useDepartments } from "@/hooks/useDeparment";
import { ArrowRight, Edit } from "lucide-react";

import DepartmentItem from "../department/DepartmentItem";

export function MajorDetailDialog({
  major: initialMajor,
  isIcon,
  open,
  onOpenChange,
  handleUpdateMajor,
}: {
  major: MajorModel;
  isIcon?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  handleUpdateMajor?: (major: MajorModel) => void;
}) {
  const [editedMajor, setEditedMajor] = useState(initialMajor);
  const { departments } = useDepartments();
  const initialDepartment = departments?.find((dept) => dept.id === initialMajor.faculty?.id);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditedMajor((prev: any) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDepartmentId = e.target.value;
    const newDepartmentIdNumber = parseInt(newDepartmentId, 10);
    const newDepartment = departments?.find((dept) => dept.id === newDepartmentIdNumber);

    if (newDepartment) {
      setEditedMajor((prev: any) => ({
        ...prev,
        faculty: newDepartment,
      }));
    }
  };

  // Get the current department from editedMajor state
  const currentDepartment = departments?.find((dept) => dept.id === editedMajor.faculty?.id);
  const hasChangedDepartment = initialDepartment?.id !== currentDepartment?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {isIcon ? (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="absolute top-2 right-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            aria-label="Edit"
          >
            <Edit size={15} />
          </Button>
        </DialogTrigger>
      ) : null}

      <DialogContent className="sm:max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Major</DialogTitle>
          <DialogDescription>Make changes to the major. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={editedMajor.name} className="col-span-3" onChange={handleInputChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Code
            </Label>
            <Input id="code" value={editedMajor.code} className="col-span-3" onChange={handleInputChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={editedMajor.description}
              className="col-span-3"
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <select
              id="department"
              value={editedMajor.faculty?.id || ""}
              className="col-span-3 border rounded px-2 py-1"
              onChange={handleDepartmentChange}
            >
              {departments?.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 justify-center">
            {initialDepartment && (
              <DepartmentItem
                department={initialDepartment}
                onDelete={() => {}}
                isSelected={false}
                onSelect={() => {}}
              />
            )}
            {hasChangedDepartment && currentDepartment && (
              <>
                <ArrowRight size={20} />
                <DepartmentItem
                  department={currentDepartment}
                  onDelete={() => {}}
                  isSelected={false}
                  onSelect={() => {}}
                />
              </>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => handleUpdateMajor?.(editedMajor)}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
