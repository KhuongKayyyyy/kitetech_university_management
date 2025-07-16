"use client";

import React from "react";

import {
  departmentData,
  englishSubjects,
  PESubjects,
  philosophySubjects,
  skillSubjects,
  subjects,
} from "@/app/api/fakedata";
import { SubjectModel } from "@/app/api/model/model";
import { Button } from "@/components/ui/button";
import { CommandDialog, CommandGroup, CommandInput, CommandItem, CommandSeparator } from "@/components/ui/command";
import { cn, getDepartmentNameById } from "@/lib/utils";
import { BookCopyIcon, BookOpen, Check, Dumbbell, GraduationCap, Languages, Plus, Trash, Wrench } from "lucide-react";

import SubjectItem from "../subject/SubjectItem";

type SubjectSearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSubjects: SubjectModel[];
  onSelect?: (subjects: SubjectModel[]) => void;
  subjectType: string;
  departmentId: number;
};

function renderSubjectGroup(
  heading: string,
  subjectList: SubjectModel[],
  onSelect?: (subject: SubjectModel) => void,
  onHover?: (subject: SubjectModel | null) => void,
  showMeta?: boolean,
  icon?: React.ReactNode,
) {
  return (
    <CommandGroup heading={heading}>
      {subjectList.map((subject) => (
        <CommandItem
          key={subject.subjectId}
          onSelect={() => onSelect?.(subject)}
          onMouseEnter={() => onHover?.(subject)}
          onMouseLeave={() => onHover?.(null)}
          className={cn(
            "flex flex-col items-start gap-1 px-3 py-2 cursor-pointer hover:bg-accent/10 transition-colors",
            {
              "flex-row items-center gap-2": !showMeta,
            },
          )}
        >
          <div className="flex items-center gap-2 w-full">
            {icon || <BookCopyIcon size={16} className="opacity-60" />}
            <span className="flex-1">{subject.name}</span>
            {showMeta && (
              <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-full">
                {getDepartmentNameById(subject.faculty_id)}
              </span>
            )}
          </div>
          {showMeta && subject.description && (
            <span className="text-xs text-muted-foreground line-clamp-1">{subject.description}</span>
          )}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

export default function SubjectSearchDialog({
  open,
  onOpenChange,
  onSelect,
  departmentId,
  subjectType,
  selectedSubjects: existingSelectedSubjects,
}: SubjectSearchDialogProps) {
  const [hoveredSubject, setHoveredSubject] = React.useState<SubjectModel | null>(null);
  const [selectedMajorId, setSelectedMajorId] = React.useState<String | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSubjects, setSelectedSubjects] = React.useState<SubjectModel[]>([]);

  const department = departmentData.find((d) => d.id === departmentId);
  const majors = department?.majors ?? [];

  const filteredSubjects = subjects.filter((subject) => {
    const matchesDepartment = subject.faculty_id === departmentId;
    const matchesMajor = selectedMajorId === null || subject.majorId === selectedMajorId;
    const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesMajor && matchesSearch;
  });

  const handleSubjectToggle = (subject: SubjectModel) => {
    // Check if subject is already in the existing curriculum
    const isAlreadyAdded = existingSelectedSubjects.some((s) => s.subjectId === subject.subjectId);
    if (isAlreadyAdded) {
      return; // Don't allow selection if already added
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

  const isSubjectSelected = (subject: SubjectModel) => {
    return selectedSubjects.some((s) => s.subjectId === subject.subjectId);
  };

  const isSubjectAlreadyAdded = (subject: SubjectModel) => {
    return existingSelectedSubjects.some((s) => s.subjectId === subject.subjectId);
  };

  const handleRemoveSubject = (subject: SubjectModel) => {
    setSelectedSubjects((prev) => prev.filter((s) => s.subjectId !== subject.subjectId));
  };

  const handleAddSubjects = () => {
    onSelect?.(selectedSubjects);
    setSelectedSubjects([]);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="sticky top-0 bg-background z-20 border-b">
        <CommandInput
          placeholder="Search subjects by name, code or description..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="h-12"
        />
        <CommandSeparator />
        {majors.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3">
            <button
              onClick={() => setSelectedMajorId(null)}
              className={cn(
                "text-sm px-4 py-2 rounded-full transition-colors",
                selectedMajorId === null
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted hover:bg-accent/80 text-muted-foreground",
              )}
            >
              All Majors
            </button>
            {majors.map((major) => (
              <button
                key={major.id}
                onClick={() => setSelectedMajorId(major.id.toString())}
                className={cn(
                  "text-sm px-4 py-2 rounded-full transition-colors",
                  selectedMajorId === major.id.toString()
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted hover:bg-accent/80 text-muted-foreground",
                )}
              >
                {major.name}
              </button>
            ))}
          </div>
        )}
        {selectedSubjects.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-muted/50">
            <span className="text-sm text-muted-foreground">
              {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? "s" : ""} selected
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
          {subjectType === "core" && (
            <CommandGroup heading="Major Subjects">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => {
                  const alreadyAdded = isSubjectAlreadyAdded(subject);
                  return (
                    <CommandItem
                      key={subject.subjectId}
                      onSelect={() => handleSubjectToggle(subject)}
                      onMouseEnter={() => setHoveredSubject(subject)}
                      onMouseLeave={() => setHoveredSubject(null)}
                      className={cn(
                        "flex flex-col items-start gap-2 px-4 py-3 transition-colors",
                        alreadyAdded ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-accent/10",
                      )}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div
                          className={cn(
                            "w-4 h-4 border-2 rounded flex items-center justify-center",
                            alreadyAdded
                              ? "bg-muted border-muted"
                              : isSubjectSelected(subject)
                                ? "bg-primary border-primary"
                                : "border-muted-foreground",
                          )}
                        >
                          {(isSubjectSelected(subject) || alreadyAdded) && (
                            <Check
                              size={12}
                              className={alreadyAdded ? "text-muted-foreground" : "text-primary-foreground"}
                            />
                          )}
                        </div>
                        <GraduationCap size={18} className={alreadyAdded ? "text-muted-foreground" : "text-primary"} />
                        <span className={cn("font-medium", alreadyAdded && "text-muted-foreground")}>
                          {subject.name}
                        </span>
                        <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full">{subject.subjectId}</span>
                      </div>
                      {alreadyAdded && (
                        <span className="text-xs text-muted-foreground pl-6">This subject has already been added</span>
                      )}
                      {!alreadyAdded && subject.description && (
                        <span className="text-sm text-muted-foreground line-clamp-2 pl-6">{subject.description}</span>
                      )}
                    </CommandItem>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  <div className="mb-2">No subjects found</div>
                  <div className="text-sm">Try adjusting your search or filters</div>
                </div>
              )}
            </CommandGroup>
          )}
          {(subjectType === "core" || subjectType === "pe") && (
            <CommandGroup heading="Physical Education">
              {PESubjects.map((subject) => {
                const alreadyAdded = isSubjectAlreadyAdded(subject);
                return (
                  <CommandItem
                    key={subject.subjectId}
                    onSelect={() => handleSubjectToggle(subject)}
                    onMouseEnter={() => setHoveredSubject(subject)}
                    onMouseLeave={() => setHoveredSubject(null)}
                    className={cn(
                      "flex flex-col items-start gap-2 px-4 py-3 transition-colors",
                      alreadyAdded ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-accent/10",
                    )}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className={cn(
                          "w-4 h-4 border-2 rounded flex items-center justify-center",
                          alreadyAdded
                            ? "bg-muted border-muted"
                            : isSubjectSelected(subject)
                              ? "bg-primary border-primary"
                              : "border-muted-foreground",
                        )}
                      >
                        {(isSubjectSelected(subject) || alreadyAdded) && (
                          <Check
                            size={12}
                            className={alreadyAdded ? "text-muted-foreground" : "text-primary-foreground"}
                          />
                        )}
                      </div>
                      <Dumbbell size={16} className={alreadyAdded ? "text-muted-foreground" : "text-blue-500"} />
                      <span className={cn("font-medium", alreadyAdded && "text-muted-foreground")}>{subject.name}</span>
                      <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full">{subject.subjectId}</span>
                    </div>
                    {alreadyAdded && (
                      <span className="text-xs text-muted-foreground pl-6">This subject has already been added</span>
                    )}
                    {!alreadyAdded && subject.description && (
                      <span className="text-sm text-muted-foreground line-clamp-2 pl-6">{subject.description}</span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {(subjectType === "core" || subjectType === "philosophy") && (
            <CommandGroup heading="Philosophy">
              {philosophySubjects.map((subject) => {
                const alreadyAdded = isSubjectAlreadyAdded(subject);
                return (
                  <CommandItem
                    key={subject.subjectId}
                    onSelect={() => handleSubjectToggle(subject)}
                    onMouseEnter={() => setHoveredSubject(subject)}
                    onMouseLeave={() => setHoveredSubject(null)}
                    className={cn(
                      "flex flex-col items-start gap-2 px-4 py-3 transition-colors",
                      alreadyAdded ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-accent/10",
                    )}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className={cn(
                          "w-4 h-4 border-2 rounded flex items-center justify-center",
                          alreadyAdded
                            ? "bg-muted border-muted"
                            : isSubjectSelected(subject)
                              ? "bg-primary border-primary"
                              : "border-muted-foreground",
                        )}
                      >
                        {(isSubjectSelected(subject) || alreadyAdded) && (
                          <Check
                            size={12}
                            className={alreadyAdded ? "text-muted-foreground" : "text-primary-foreground"}
                          />
                        )}
                      </div>
                      <BookOpen size={16} className={alreadyAdded ? "text-muted-foreground" : "text-purple-500"} />
                      <span className={cn("font-medium", alreadyAdded && "text-muted-foreground")}>{subject.name}</span>
                      <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full">{subject.subjectId}</span>
                    </div>
                    {alreadyAdded && (
                      <span className="text-xs text-muted-foreground pl-6">This subject has already been added</span>
                    )}
                    {!alreadyAdded && subject.description && (
                      <span className="text-sm text-muted-foreground line-clamp-2 pl-6">{subject.description}</span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {(subjectType === "core" || subjectType === "english") && (
            <CommandGroup heading="English">
              {englishSubjects.map((subject) => {
                const alreadyAdded = isSubjectAlreadyAdded(subject);
                return (
                  <CommandItem
                    key={subject.subjectId}
                    onSelect={() => handleSubjectToggle(subject)}
                    onMouseEnter={() => setHoveredSubject(subject)}
                    onMouseLeave={() => setHoveredSubject(null)}
                    className={cn(
                      "flex flex-col items-start gap-2 px-4 py-3 transition-colors",
                      alreadyAdded ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-accent/10",
                    )}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className={cn(
                          "w-4 h-4 border-2 rounded flex items-center justify-center",
                          alreadyAdded
                            ? "bg-muted border-muted"
                            : isSubjectSelected(subject)
                              ? "bg-primary border-primary"
                              : "border-muted-foreground",
                        )}
                      >
                        {(isSubjectSelected(subject) || alreadyAdded) && (
                          <Check
                            size={12}
                            className={alreadyAdded ? "text-muted-foreground" : "text-primary-foreground"}
                          />
                        )}
                      </div>
                      <Languages size={16} className={alreadyAdded ? "text-muted-foreground" : "text-green-500"} />
                      <span className={cn("font-medium", alreadyAdded && "text-muted-foreground")}>{subject.name}</span>
                      <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full">{subject.subjectId}</span>
                    </div>
                    {alreadyAdded && (
                      <span className="text-xs text-muted-foreground pl-6">This subject has already been added</span>
                    )}
                    {!alreadyAdded && subject.description && (
                      <span className="text-sm text-muted-foreground line-clamp-2 pl-6">{subject.description}</span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {(subjectType === "core" || subjectType === "skill") && (
            <CommandGroup heading="Skills">
              {skillSubjects.map((subject) => {
                const alreadyAdded = isSubjectAlreadyAdded(subject);
                return (
                  <CommandItem
                    key={subject.subjectId}
                    onSelect={() => handleSubjectToggle(subject)}
                    onMouseEnter={() => setHoveredSubject(subject)}
                    onMouseLeave={() => setHoveredSubject(null)}
                    className={cn(
                      "flex flex-col items-start gap-2 px-4 py-3 transition-colors",
                      alreadyAdded ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-accent/10",
                    )}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className={cn(
                          "w-4 h-4 border-2 rounded flex items-center justify-center",
                          alreadyAdded
                            ? "bg-muted border-muted"
                            : isSubjectSelected(subject)
                              ? "bg-primary border-primary"
                              : "border-muted-foreground",
                        )}
                      >
                        {(isSubjectSelected(subject) || alreadyAdded) && (
                          <Check
                            size={12}
                            className={alreadyAdded ? "text-muted-foreground" : "text-primary-foreground"}
                          />
                        )}
                      </div>
                      <Wrench size={16} className={alreadyAdded ? "text-muted-foreground" : "text-orange-500"} />
                      <span className={cn("font-medium", alreadyAdded && "text-muted-foreground")}>{subject.name}</span>
                      <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full">{subject.subjectId}</span>
                    </div>
                    {alreadyAdded && (
                      <span className="text-xs text-muted-foreground pl-6">This subject has already been added</span>
                    )}
                    {!alreadyAdded && subject.description && (
                      <span className="text-sm text-muted-foreground line-clamp-2 pl-6">{subject.description}</span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </div>

        <div className="w-1/2 flex flex-col">
          {/* Upper half - Subject details */}
          <div className="h-1/2 p-4 bg-muted/10 border-b">
            {hoveredSubject ? (
              <div className="space-y-4 animate-in fade-in-50">
                <SubjectItem subject={hoveredSubject} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BookCopyIcon size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Hover on a subject to see details</p>
                </div>
              </div>
            )}
          </div>

          {/* Lower half - Selected subjects */}
          <div className="h-1/2 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Selected Subjects</h3>
              <span className="text-xs text-muted-foreground">
                {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? "s" : ""}
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
                  <div className="mb-2">No subjects selected</div>
                  <div className="text-xs">Click on subjects to add them</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CommandDialog>
  );
}
