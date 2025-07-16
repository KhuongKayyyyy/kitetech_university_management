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
            <Select
              value={newDepartment.dean}
              onValueChange={(value) => setNewDepartment((prev) => ({ ...prev, dean: value }))}
            >
              <SelectTrigger className="col-span-3">
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

          {/* Same major table component used in detail dialog */}
          <MajorInDepartTable department={newDepartment} setDepartment={setNewDepartment} />
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
