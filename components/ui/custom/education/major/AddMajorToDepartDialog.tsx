"use client";

import React, { useState } from "react";

import { FacultyModel, MajorModel } from "@/app/api/model/model";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, Search } from "lucide-react";

interface AddMajorToDepartPopoverProps {
  department: FacultyModel;
  availableMajors: MajorModel[];
  onAddMajors: (majors: MajorModel[]) => void;
}

export default function AddMajorToDepartPopover({
  department,
  availableMajors,
  onAddMajors,
}: AddMajorToDepartPopoverProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMajors, setSelectedMajors] = useState<MajorModel[]>([]);

  // Filter majors based on search term and exclude already added majors
  const filteredMajors = availableMajors.filter((major) => {
    const matchesSearch = major.name.toLowerCase().includes(searchTerm.toLowerCase());
    const notAlreadyInDepartment = !department.majors.some((deptMajor) => deptMajor.id === major.id);
    return matchesSearch && notAlreadyInDepartment;
  });

  const handleMajorToggle = (major: MajorModel) => {
    setSelectedMajors((prev) => {
      const isSelected = prev.some((m) => m.id === major.id);
      if (isSelected) {
        return prev.filter((m) => m.id !== major.id);
      } else {
        return [...prev, major];
      }
    });
  };

  const handleAddSelected = () => {
    if (selectedMajors.length > 0) {
      onAddMajors(selectedMajors);
      setSelectedMajors([]);
      setSearchTerm("");
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setSelectedMajors([]);
    setSearchTerm("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Major
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Majors to {department.name}</DialogTitle>
          <DialogDescription>
            Search and select majors to add to this department. {filteredMajors.length} available
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search majors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
              autoComplete="off"
            />
          </div>

          <ScrollArea className="h-[300px] w-full">
            <div className="space-y-2">
              {filteredMajors.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {searchTerm ? "No majors found matching your search." : "No available majors to add."}
                </p>
              ) : (
                filteredMajors.map((major) => (
                  <div
                    key={major.id}
                    className="flex items-start space-x-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                    onClick={() => handleMajorToggle(major)}
                  >
                    <Checkbox
                      checked={selectedMajors.some((m) => m.id === major.id)}
                      onCheckedChange={() => handleMajorToggle(major)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none">{major.name}</p>
                      {major.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{major.description}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {selectedMajors.length > 0 && (
            <>
              <Separator />
              <div className="text-xs text-muted-foreground">
                {selectedMajors.length} major{selectedMajors.length !== 1 ? "s" : ""} selected
              </div>
            </>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleAddSelected} disabled={selectedMajors.length === 0}>
            Add Selected ({selectedMajors.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
