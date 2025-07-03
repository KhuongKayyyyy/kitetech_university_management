import React from "react";

import { CurriculumnSubject } from "@/app/api/model/CurriculumnSubject";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubjectType } from "@/constants/enum/SubjectType";
import { ArrowUpRight, BookOpen } from "lucide-react";

interface Board {
  id: string;
  name: string;
  type: SubjectType;
  columnOrder: string[];
  semesterColumn: { [key: string]: { id: string; title: string; subjectIds: string[] } };
}

interface Step {
  id: number;
  name: string;
  type: string;
}

interface SaveCurriculumDialogProps {
  steps: Step[];
  boards: Board[];
  subjects: { [key: string]: CurriculumnSubject };
  currentStep: number;
  onSave?: () => void;
  onCancel?: () => void;
}

export default function SaveCurriculumDialog({
  steps,
  boards,
  subjects,
  currentStep,
  onSave,
  onCancel,
}: SaveCurriculumDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2" size="lg" disabled={currentStep < steps.length}>
          Save Curriculum
          <ArrowUpRight size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-7xl">
        <DialogHeader>
          <DialogTitle>Curriculum Preview</DialogTitle>
          <DialogDescription>Review your curriculum before saving</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {steps.map((step) => {
            const board = boards.find((b) => b.type === step.type);
            return (
              <div key={step.id} className="mb-6">
                <h3 className="font-semibold mb-2">{step.name}</h3>
                {board && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(board.semesterColumn).map(([id, column]) => (
                      <div
                        key={id}
                        className="p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-lg">{column.title}</h4>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {column.subjectIds.length} subjects
                          </span>
                        </div>
                        <ul className="space-y-3">
                          {column.subjectIds.map((subjectId) => {
                            const subject = subjects[subjectId];
                            return (
                              subject && (
                                <li key={subjectId} className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                                    <span className="font-medium text-foreground text-sm">{subject.SubjectName}</span>
                                    <Badge variant="default" className="text-xs ml-auto">
                                      {subject.SubjectType}
                                    </Badge>
                                  </div>
                                  {subject.PrerequisiteSubjects && subject.PrerequisiteSubjects.length > 0 && (
                                    <div className="ml-3.5">
                                      <div className="text-xs text-muted-foreground mb-1">Prerequisites:</div>
                                      <div className="flex flex-wrap gap-1">
                                        {subject.PrerequisiteSubjects.map((prereq, index) => (
                                          <Badge
                                            key={index}
                                            variant="outline"
                                            className="text-xs flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                                          >
                                            <BookOpen size={10} className="text-blue-500" />
                                            {prereq.name || prereq.SubjectName}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </li>
                              )
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>Confirm & Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
