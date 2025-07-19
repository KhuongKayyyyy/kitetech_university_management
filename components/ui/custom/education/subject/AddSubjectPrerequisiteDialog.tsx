"use client";

import React from "react";

import { CurriculumnSubjectModel } from "@/app/api/model/CurriculumnSubjectModel";
import { SubjectModel } from "@/app/api/model/model";
import { Button } from "@/components/ui/button";
import { CommandDialog, CommandGroup, CommandInput, CommandItem, CommandSeparator } from "@/components/ui/command";
import { useSubjects } from "@/hooks/useSubject";
import { cn } from "@/lib/utils";
import { BookOpen, Check, Plus, Trash, X } from "lucide-react";
import { toast } from "sonner";

interface AddSubjectPrerequisiteProps {
  currentSubject: any; // Can be either old or new structure
  selectedPrerequisites?: SubjectModel[];
  onAddPrerequisites?: (subjects: SubjectModel[]) => void;
  onRemovePrerequisite?: (subjectId: string) => void;
  existingSubjectIds?: Set<string>; // Set of curriculum subject IDs
}

export default function AddSubjectPrerequisite({
  currentSubject,
  selectedPrerequisites = [],
  onAddPrerequisites,
  onRemovePrerequisite,
  existingSubjectIds = new Set(),
}: AddSubjectPrerequisiteProps) {
  const [open, setOpen] = React.useState(false);
  const [hoveredSubject, setHoveredSubject] = React.useState<SubjectModel | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSubjects, setSelectedSubjects] = React.useState<SubjectModel[]>([]);
  const { subjects, loading, error } = useSubjects();

  // Filter out the current subject and apply search/prerequisite filters
  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.id.toString().toLowerCase().includes(searchQuery.toLowerCase());
    const notAlreadyPrerequisite = !selectedPrerequisites.some((prereq) => prereq.id === subject.id);
    // Fix the comparison by converting both to strings
    const notCurrentSubject = subject.id.toString() !== currentSubject.SubjectID.toString();
    return matchesSearch && notAlreadyPrerequisite && notCurrentSubject;
  });

  const handleSubjectToggle = (subject: SubjectModel) => {
    const isAlreadyPrerequisite = selectedPrerequisites.some((s) => s.id === subject.id);
    if (isAlreadyPrerequisite) {
      return;
    }

    setSelectedSubjects((prev) => {
      const isSelected = prev.some((s) => s.id === subject.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== subject.id);
      } else {
        return [...prev, subject];
      }
    });
  };

  const isSubjectSelected = (subject: SubjectModel) => {
    return selectedSubjects.some((s) => s.id === subject.id);
  };

  const isSubjectAlreadyPrerequisite = (subject: SubjectModel) => {
    return selectedPrerequisites.some((s) => s.id === subject.id);
  };

  const handleRemoveSubject = (subject: SubjectModel) => {
    setSelectedSubjects((prev) => prev.filter((s) => s.id !== subject.id));
  };

  const handleAddSubjects = () => {
    onAddPrerequisites?.(selectedSubjects);
    setSelectedSubjects([]);
    setOpen(false);
  };

  const handleRemovePrerequisite = (subjectId: string) => {
    try {
      // Convert to string for consistent comparison since IDs might be numbers or strings
      const prerequisiteToRemove = selectedPrerequisites.find((p) => p.id.toString() === subjectId.toString());
      if (!prerequisiteToRemove) {
        toast.error("Prerequisite not found in selected list");
        return;
      }

      onRemovePrerequisite?.(subjectId);
      // Filter by converting both IDs to string for consistent comparison
      setSelectedSubjects((prev) => prev.filter((s) => s.id.toString() !== subjectId.toString()));

      toast.success(`Removed "${prerequisiteToRemove.name}" as prerequisite`);
    } catch (error) {
      console.error("Error removing prerequisite:", error);
      toast.error("Failed to remove prerequisite");
    }
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
          <div className="text-xs text-gray-500">Prerequisites:</div>
          <div className="flex flex-wrap gap-2">
            {selectedPrerequisites.map((prerequisite) => (
              <div
                key={prerequisite.id}
                className="group flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg px-3 py-2 border border-slate-200 transition-all duration-200"
              >
                <BookOpen size={14} className="text-blue-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{prerequisite.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{prerequisite.id}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{prerequisite.credits} credits</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 ml-2 hover:bg-red-50 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Removing prerequisite with ID:", prerequisite.id);
                    handleRemovePrerequisite(prerequisite.id.toString());
                  }}
                >
                  <X className="h-4 w-4" />
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
              {loading ? (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  <div className="mb-2">Loading subjects...</div>
                </div>
              ) : error ? (
                <div className="px-4 py-8 text-center text-destructive">
                  <div className="mb-2">Error loading subjects</div>
                  <div className="text-sm">{error.message}</div>
                </div>
              ) : filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => {
                  const alreadyPrerequisite = isSubjectAlreadyPrerequisite(subject);
                  const isAlreadyInCurriculum = existingSubjectIds.has(subject.id);
                  return (
                    <CommandItem
                      key={subject.id}
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
                        <span className="ml-auto text-xs bg-muted px-2 py-1 rounded-full">{subject.id}</span>
                        {!isAlreadyInCurriculum && !alreadyPrerequisite && (
                          <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                            Will be auto-added
                          </span>
                        )}
                        {isAlreadyInCurriculum && !alreadyPrerequisite && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            In curriculum
                          </span>
                        )}
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
                      <span>Code: {hoveredSubject.id}</span>
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
                    <div key={subject.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{subject.name}</div>
                        <div className="text-xs text-muted-foreground">{subject.id}</div>
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
