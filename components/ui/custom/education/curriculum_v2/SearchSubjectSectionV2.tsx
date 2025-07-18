"use client";

import React from "react";

import { SubjectModel } from "@/app/api/model/model";
import SearchSubjectDialog from "@/components/ui/custom/education/curriculum/SearchSubjectDialog";
import { Search } from "lucide-react";

import { CurriculumBoardType } from "./CreateCurriculumDialog";

interface SearchSubjectSectionV2Props {
  steps: CurriculumBoardType[];
  currentStep: number;
  openSearch: boolean;
  setOpenSearch: (open: boolean) => void;
  departmentId: number;
  globalSelectedSubjects: SubjectModel[];
  onSelect: (subjects: SubjectModel[]) => void;
  onOpenGlobalSearch: () => void;
}

export default function SearchSubjectSectionV2({
  steps,
  currentStep,
  openSearch,
  setOpenSearch,
  departmentId,
  globalSelectedSubjects,
  onSelect,
  onOpenGlobalSearch,
}: SearchSubjectSectionV2Props) {
  const handleSubjectSelect = (subjects: SubjectModel[]) => {
    onSelect(subjects);
  };

  const currentStepType = steps[currentStep - 1];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <button
          className="inline-flex h-10 w-fit rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={onOpenGlobalSearch}
        >
          <span className="flex items-center gap-2">
            <Search size={16} strokeWidth={2} />
            <span>Search {currentStepType?.name || "Subjects"}</span>
          </span>
          <kbd className="ml-4 inline-flex h-5 items-center rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      <SearchSubjectDialog
        selectedSubjects={globalSelectedSubjects}
        open={openSearch}
        onOpenChange={setOpenSearch}
        departmentId={departmentId}
        subjectType={currentStepType?.type || "core"}
        onSelect={handleSubjectSelect}
      />
    </>
  );
}
