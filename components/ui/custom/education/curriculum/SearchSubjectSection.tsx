import React from "react";

import { Subject } from "@/app/api/model/model";
import SubjectSearchDialog from "@/components/ui/custom/education/curriculum/SearchSubjectDialog";
import { Search } from "lucide-react";

interface Step {
  id: number;
  name: string;
  type: string;
}

interface SearchSubjectSectionProps {
  steps: Step[];
  currentStep: number;
  openSearch: boolean;
  setOpenSearch: (open: boolean) => void;
  departmentId: number;
  globalSelectedSubjects: Subject[];
  onSelect: (subjects: Subject[]) => void;
  onOpenGlobalSearch: () => void;
}

export default function SearchSubjectSection({
  steps,
  currentStep,
  openSearch,
  setOpenSearch,
  departmentId,
  globalSelectedSubjects,
  onSelect,
  onOpenGlobalSearch,
}: SearchSubjectSectionProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <button
          className="inline-flex h-10 w-fit rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={onOpenGlobalSearch}
        >
          <span className="flex items-center gap-2">
            <Search size={16} strokeWidth={2} />
            <span>Search {steps[currentStep - 1].name}</span>
          </span>
          <kbd className="ml-4 inline-flex h-5 items-center rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      <SubjectSearchDialog
        selectedSubjects={globalSelectedSubjects}
        open={openSearch}
        onOpenChange={setOpenSearch}
        departmentId={departmentId}
        subjectType={steps[currentStep - 1].type as "core" | "pe" | "skill" | "english" | "philosophy"}
        onSelect={onSelect}
      />
    </>
  );
}
