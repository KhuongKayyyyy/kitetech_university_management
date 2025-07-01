"use client";

import React from "react";

import { CurriculumnSubject } from "@/app/api/model/CurriculumnSubject";
import { Subject } from "@/app/api/model/model";
import { Button } from "@/components/ui/button";
import { CommandDialog, CommandGroup, CommandInput, CommandItem, CommandSeparator } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { BookOpen, Check, Plus, Trash, X } from "lucide-react";

interface AddSubjectPrerequisiteProps {
  currentSubject: CurriculumnSubject;
  subjects?: Subject[];
  selectedPrerequisites?: Subject[];
  onAddPrerequisite?: (subject: Subject) => void;
  onRemovePrerequisite?: (subjectId: string) => void;
}

export default function AddSubjectPrerequisite({
  currentSubject,
  subjects = [],
  selectedPrerequisites = [],
  onAddPrerequisite,
  onRemovePrerequisite,
}: AddSubjectPrerequisiteProps) {
  const [open, setOpen] = React.useState(false);
  const [hoveredSubject, setHoveredSubject] = React.useState<Subject | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSubjects, setSelectedSubjects] = React.useState<Subject[]>([]);

  // Filter out the current subject and apply search/prerequisite filters
  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.subjectId.toString().toLowerCase().includes(searchQuery.toLowerCase());
    const notAlreadyPrerequisite = !selectedPrerequisites.some((prereq) => prereq.subjectId === subject.subjectId);
    const notCurrentSubject = subject.subjectId !== currentSubject.SubjectID;
    return matchesSearch && notAlreadyPrerequisite && notCurrentSubject;
  });

  const handleSubjectToggle = (subject: Subject) => {
    const isAlreadyPrerequisite = selectedPrerequisites.some((s) => s.subjectId === subject.subjectId);
    if (isAlreadyPrerequisite) {
      return;
    }

    setSelectedSubjects((prev) => {
      const isSelected = prev.some((s) => s.subjectId === subject.subjectId);
      if (isSelected) {
        return prev.filter((s) => s.subjectId !== subject.subjectId);
      } else {
        return [...prev, subject];
      }
    });
  };

  const isSubjectSelected = (subject: Subject) => {
    return selectedSubjects.some((s) => s.subjectId === subject.subjectId);
  };

  const isSubjectAlreadyPrerequisite = (subject: Subject) => {
    return selectedPrerequisites.some((s) => s.subjectId === subject.subjectId);
  };

  const handleRemoveSubject = (subject: Subject) => {
    setSelectedSubjects((prev) => prev.filter((s) => s.subjectId !== subject.subjectId));
  };

  const handleAddSubjects = () => {
    selectedSubjects.forEach((subject) => {
      onAddPrerequisite?.(subject);
    });
    setSelectedSubjects([]);
    setOpen(false);
  };

  const handleRemovePrerequisite = (subjectId: string) => {
    onRemovePrerequisite?.(subjectId);
    setSelectedSubjects((prev) => prev.filter((s) => s.subjectId !== subjectId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" className="h-8 border-dashed" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Prerequisite
        </Button>
      </div>

      {selectedPrerequisites.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-gray-500">Selected Prerequisites:</div>
          <div className="flex flex-wrap gap-2">
            {selectedPrerequisites.map((prerequisite) => (
              <div
                key={prerequisite.subjectId}
                className="flex items-center gap-1 pr-1 bg-secondary text-secondary-foreground rounded-md px-2 py-1"
              >
                <span className="font-medium">{prerequisite.subjectId}</span>
                <span className="text-xs">({prerequisite.credits} credits)</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemovePrerequisite(prerequisite.subjectId.toString())}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="sticky top-0 bg-background z-20 border-b">
          <CommandInput
            placeholder="Search prerequisites by name or code..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-12"
          />
          <CommandSeparator />
          {selectedSubjects.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-muted/50">
              <span className="text-sm text-muted-foreground">
                {selectedSubjects.length} prerequisite{selectedSubjects.length !== 1 ? "s" : ""} selected
              </span>
              <Button onClick={handleAddSubjects} size="sm" className="gap-2">
                <Plus size={14} />
                Add Selected
              </Button>
            </div>
          )}
        </div>

        <div className="flex h-[60vh] max-h-[70vh] overflow-hidden">
          <div className="w-1/2 overflow-y-auto border-r">
            <CommandGroup heading="Available Subjects">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => {
                  const alreadyPrerequisite = isSubjectAlreadyPrerequisite(subject);
                  return (
                    <CommandItem
                      key={subject.subjectId}
                      onSelect={() => handleSubjectToggle(subject)}
                      onMouseEnter={() => setHoveredSubject(subject)}
                      onMouseLeave={() => setHoveredSubject(null)}
                      className={cn(
                        "flex flex-col items-start gap-2 px-4 py-3 transition-colors",
                        alreadyPrerequisite ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-accent/10",
                      )}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div
                          className={cn(
                            "w-4 h-4 border-2 rounded flex items-center justify-center",
                            alreadyPrerequisite
                              ? "bg-muted border-muted"
                              : isSubjectSelected(subject)
                                ? "bg-primary border-primary"
                                : "border-muted-foreground",
                          )}
                        >
                          {(isSubjectSelected(subject) || alreadyPrerequisite) && (
                            <Check
                              size={12}
                              className={alreadyPrerequisite ? "text-muted-foreground" : "text-primary-foreground"}
                            />
                          )}
                        </div>
                        <BookOpen
                          size={16}
                          className={alreadyPrerequisite ? "text-muted-foreground" : "text-primary"}
                        />
                        <span className={cn("font-medium", alreadyPrerequisite && "text-muted-foreground")}>
                          {subject.name}
                        </span>
                        <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full">{subject.subjectId}</span>
                      </div>
                      {alreadyPrerequisite && (
                        <span className="text-xs text-muted-foreground pl-6">
                          This subject is already a prerequisite
                        </span>
                      )}
                      {!alreadyPrerequisite && subject.description && (
                        <span className="text-sm text-muted-foreground line-clamp-2 pl-6">{subject.description}</span>
                      )}
                    </CommandItem>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  <div className="mb-2">No subjects found</div>
                  <div className="text-sm">Try adjusting your search</div>
                </div>
              )}
            </CommandGroup>
          </div>

          <div className="w-1/2 flex flex-col">
            {/* Upper half - Subject details */}
            <div className="h-1/2 p-4 bg-muted/10 border-b">
              {hoveredSubject ? (
                <div className="space-y-4 animate-in fade-in-50">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BookOpen size={20} className="text-primary" />
                      <h3 className="font-semibold text-lg">{hoveredSubject.name}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Code: {hoveredSubject.subjectId}</span>
                      <span>Credits: {hoveredSubject.credits}</span>
                    </div>
                    {hoveredSubject.description && (
                      <p className="text-sm text-muted-foreground">{hoveredSubject.description}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Hover on a subject to see details</p>
                  </div>
                </div>
              )}
            </div>

            {/* Lower half - Selected subjects */}
            <div className="h-1/2 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">Selected Prerequisites</h3>
                <span className="text-xs text-muted-foreground">
                  {selectedSubjects.length} prerequisite{selectedSubjects.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-2 max-h-full overflow-y-auto">
                {selectedSubjects.length > 0 ? (
                  selectedSubjects.map((subject) => (
                    <div key={subject.subjectId} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{subject.name}</div>
                        <div className="text-xs text-muted-foreground">{subject.subjectId}</div>
                      </div>
                      <button
                        onClick={() => handleRemoveSubject(subject)}
                        className="p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    <div className="mb-2">No prerequisites selected</div>
                    <div className="text-xs">Click on subjects to add them as prerequisites</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CommandDialog>
    </div>
  );
}
