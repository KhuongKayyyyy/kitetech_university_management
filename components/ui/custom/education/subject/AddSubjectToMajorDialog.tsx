"use client";

import React, { useState } from "react";

import { MajorModel, SubjectModel } from "@/app/api/model/model";
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

interface AddSubjectToMajorDialogProps {
  major: MajorModel;
  availableSubjects: SubjectModel[];
  onAddSubjects: (subjects: SubjectModel[]) => void;
}

export default function AddSubjectToMajorDialog({
  major,
  availableSubjects,
  onAddSubjects,
}: AddSubjectToMajorDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectModel[]>([]);

  //   // Filter subjects based on search term and exclude already added subjects
  //   const filteredSubjects = availableSubjects.filter((subject) => {
  //     const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase());
  //     const notAlreadyInMajor = !major.subjects.some((majorSubject) => majorSubject.id === subject.id);
  //     return matchesSearch && notAlreadyInMajor;
  //   });

  const handleSubjectToggle = (subject: SubjectModel) => {
    setSelectedSubjects((prev) => {
      const isSelected = prev.some((s) => s.id === subject.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== subject.id);
      } else {
        return [...prev, subject];
      }
    });
  };

  const handleAddSelected = () => {
    if (selectedSubjects.length > 0) {
      onAddSubjects(selectedSubjects);
      setSelectedSubjects([]);
      setSearchTerm("");
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setSelectedSubjects([]);
    setSearchTerm("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Subjects to {major.name}</DialogTitle>
          <DialogDescription>
            Search and select subjects to add to this major. {availableSubjects.length} available
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
              autoComplete="off"
            />
          </div>

          <ScrollArea className="h-[300px] w-full">
            <div className="space-y-2">
              {availableSubjects.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {searchTerm ? "No subjects found matching your search." : "No available subjects to add."}
                </p>
              ) : (
                availableSubjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-start space-x-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                    onClick={() => handleSubjectToggle(subject)}
                  >
                    <Checkbox
                      checked={selectedSubjects.some((s) => s.id === subject.id)}
                      onCheckedChange={() => handleSubjectToggle(subject)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none">{subject.name}</p>
                      {subject.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{subject.description}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {selectedSubjects.length > 0 && (
            <>
              <Separator />
              <div className="text-xs text-muted-foreground">
                {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? "s" : ""} selected
              </div>
            </>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleAddSelected} disabled={selectedSubjects.length === 0}>
            Add Selected ({selectedSubjects.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
