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
import { Subject } from "@/app/api/model/model";
import { CommandDialog, CommandGroup, CommandInput, CommandItem, CommandSeparator } from "@/components/ui/command";
import { cn, getDepartmentNameById } from "@/lib/utils";
import { BookCopyIcon, BookOpen, Dumbbell, GraduationCap, Languages, Wrench } from "lucide-react";

import SubjectItem from "../subject/SubjectItem";

type SubjectSearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (subject: Subject) => void;
  subjectType: string;
  departmentId: number;
};

function renderSubjectGroup(
  heading: string,
  subjectList: Subject[],
  onSelect?: (subject: Subject) => void,
  onHover?: (subject: Subject | null) => void,
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
                {getDepartmentNameById(subject.departmentId)}
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
}: SubjectSearchDialogProps) {
  const [hoveredSubject, setHoveredSubject] = React.useState<Subject | null>(null);
  const [selectedMajorId, setSelectedMajorId] = React.useState<number | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const department = departmentData.find((d) => d.id === departmentId);
  const majors = department?.majors ?? [];

  const filteredSubjects = subjects.filter((subject) => {
    const matchesDepartment = subject.departmentId === departmentId;
    const matchesMajor = selectedMajorId === null || subject.majorId === selectedMajorId;
    const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesMajor && matchesSearch;
  });

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
                onClick={() => setSelectedMajorId(major.id)}
                className={cn(
                  "text-sm px-4 py-2 rounded-full transition-colors",
                  selectedMajorId === major.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted hover:bg-accent/80 text-muted-foreground",
                )}
              >
                {major.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex h-[60vh] max-h-[70vh] overflow-hidden">
        <div className="w-1/2 overflow-y-auto border-r">
          {subjectType === "core" && (
            <CommandGroup heading="Major Subjects">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => (
                  <CommandItem
                    key={subject.subjectId}
                    onSelect={() => onSelect?.(subject)}
                    onMouseEnter={() => setHoveredSubject(subject)}
                    onMouseLeave={() => setHoveredSubject(null)}
                    className="flex flex-col items-start gap-2 px-4 py-3 cursor-pointer hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <GraduationCap size={18} className="text-primary" />
                      <span className="font-medium">{subject.name}</span>
                      <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full">{subject.subjectId}</span>
                    </div>
                    {subject.description && (
                      <span className="text-sm text-muted-foreground line-clamp-2 pl-6">{subject.description}</span>
                    )}
                  </CommandItem>
                ))
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
              {PESubjects.map((subject) => (
                <CommandItem
                  key={subject.subjectId}
                  onSelect={() => onSelect?.(subject)}
                  onMouseEnter={() => setHoveredSubject(subject)}
                  onMouseLeave={() => setHoveredSubject(null)}
                  className="flex flex-col items-start gap-2 px-4 py-3 cursor-pointer hover:bg-accent/10 transition-colors"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Dumbbell size={16} className="text-blue-500" />
                    <span className="font-medium">{subject.name}</span>
                    <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full">{subject.subjectId}</span>
                  </div>
                  {subject.description && (
                    <span className="text-sm text-muted-foreground line-clamp-2 pl-6">{subject.description}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {(subjectType === "core" || subjectType === "philosophy") && (
            <CommandGroup heading="Philosophy">
              {philosophySubjects.map((subject) => (
                <CommandItem
                  key={subject.subjectId}
                  onSelect={() => onSelect?.(subject)}
                  onMouseEnter={() => setHoveredSubject(subject)}
                  onMouseLeave={() => setHoveredSubject(null)}
                  className="flex flex-col items-start gap-2 px-4 py-3 cursor-pointer hover:bg-accent/10 transition-colors"
                >
                  <div className="flex items-center gap-2 w-full">
                    <BookOpen size={16} className="text-purple-500" />
                    <span className="font-medium">{subject.name}</span>
                    <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full">{subject.subjectId}</span>
                  </div>
                  {subject.description && (
                    <span className="text-sm text-muted-foreground line-clamp-2 pl-6">{subject.description}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {(subjectType === "core" || subjectType === "english") && (
            <CommandGroup heading="English">
              {englishSubjects.map((subject) => (
                <CommandItem
                  key={subject.subjectId}
                  onSelect={() => onSelect?.(subject)}
                  onMouseEnter={() => setHoveredSubject(subject)}
                  onMouseLeave={() => setHoveredSubject(null)}
                  className="flex flex-col items-start gap-2 px-4 py-3 cursor-pointer hover:bg-accent/10 transition-colors"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Languages size={16} className="text-green-500" />
                    <span className="font-medium">{subject.name}</span>
                    <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full">{subject.subjectId}</span>
                  </div>
                  {subject.description && (
                    <span className="text-sm text-muted-foreground line-clamp-2 pl-6">{subject.description}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {(subjectType === "core" || subjectType === "skill") && (
            <CommandGroup heading="Skills">
              {skillSubjects.map((subject) => (
                <CommandItem
                  key={subject.subjectId}
                  onSelect={() => onSelect?.(subject)}
                  onMouseEnter={() => setHoveredSubject(subject)}
                  onMouseLeave={() => setHoveredSubject(null)}
                  className="flex flex-col items-start gap-2 px-4 py-3 cursor-pointer hover:bg-accent/10 transition-colors"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Wrench size={16} className="text-orange-500" />
                    <span className="font-medium">{subject.name}</span>
                    <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full">{subject.subjectId}</span>
                  </div>
                  {subject.description && (
                    <span className="text-sm text-muted-foreground line-clamp-2 pl-6">{subject.description}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </div>

        <div className="w-1/2 p-6 bg-muted/10">
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
      </div>
    </CommandDialog>
  );
}
