"use client";

import { useState } from "react";

import { FacultyModel } from "@/app/api/model/model";
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

import { MajorInDepartTable } from "../major/MajorInDepartTable";

interface NewDepartmentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd?: (newDepartment: FacultyModel) => void;
}

export function NewDepartmentDialog({ open, setOpen, onAdd }: NewDepartmentDialogProps) {
  const [newDepartment, setNewDepartment] = useState<FacultyModel>({
    id: 0,
    name: "",
    contact_info: "",
    dean: "",
    majors: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewDepartment((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = () => {
    if (onAdd) onAdd(newDepartment);
    setOpen(false);
    setNewDepartment({
      id: 0,
      name: "",
      contact_info: "",
      majors: [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
          <DialogDescription>Enter the department's details and add any majors before saving.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={newDepartment.name} onChange={handleInputChange} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Code
            </Label>
            <Input id="code" value={newDepartment.code} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Contact Info
            </Label>
            <Input
              id="contact_info"
              value={newDepartment.contact_info}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dean" className="text-right">
              Dean
            </Label>
            <Input
              id="dean"
              value={newDepartment.dean || ""}
              onChange={handleInputChange}
              placeholder="Enter dean name"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
