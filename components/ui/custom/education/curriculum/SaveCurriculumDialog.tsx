import React from "react";

import { CurriculumnSubjectModel } from "@/app/api/model/CurriculumnSubjectModel";
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
import { ArrowUpRight, BookOpen, GraduationCap } from "lucide-react";

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
  subjects: { [key: string]: CurriculumnSubjectModel };
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
      <DialogContent className="!max-w-[95vw] w-full p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl">Curriculum Preview</DialogTitle>
          <DialogDescription>Review your curriculum before saving</DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto space-y-8">
          {steps.map((step) => {
            const board = boards.find((b) => b.type === step.type);
            return (
              <div key={step.id} className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                  <GraduationCap className="text-primary" size={24} />
                  <h3 className="text-xl font-bold text-primary">{step.name}</h3>
                </div>
                {board && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(board.semesterColumn).map(([id, column]) => (
                      <div
                        key={id}
                        className="group p-5 bg-gradient-to-br from-background to-muted/20 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                            {column.title}
                          </h4>
                          <div className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20 hover:bg-primary/20 transition-colors">
                            {column.subjectIds.length} subjects
                          </div>
                        </div>
                        <div className="space-y-3">
                          {column.subjectIds.map((subjectId) => {
                            const subject = subjects[subjectId];
                            return (
                              subject && (
                                <div
                                  key={subjectId}
                                  className="group/subject p-4 bg-card rounded-lg border border-border/30 hover:border-primary/40 hover:shadow-md hover:shadow-primary/10 transition-all duration-200 hover:bg-primary/[0.02] cursor-pointer"
                                >
                                  <div className="flex items-start gap-3 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-primary/70 mt-2 flex-shrink-0 group-hover/subject:bg-primary transition-colors" />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2 mb-2">
                                        <span className="font-semibold text-foreground text-sm leading-relaxed group-hover/subject:text-primary transition-colors">
                                          {subject.SubjectName}
                                        </span>
                                        <Badge
                                          variant="secondary"
                                          className="text-xs shrink-0 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                                        >
                                          {subject.SubjectType}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  {subject.PrerequisiteSubjects && subject.PrerequisiteSubjects.length > 0 && (
                                    <div className="ml-5 space-y-2">
                                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Prerequisites
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {subject.PrerequisiteSubjects.map((prereq, index) => (
                                          <Badge
                                            key={index}
                                            variant="outline"
                                            className="text-xs flex items-center gap-1.5 px-2.5 py-1 bg-blue-50/80 hover:bg-blue-100/80 text-blue-700 border-blue-200/60 hover:border-blue-300 transition-all duration-200 hover:shadow-sm"
                                          >
                                            <BookOpen size={10} className="text-blue-500" />
                                            <span className="font-medium">{prereq.name || prereq.SubjectName}</span>
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <DialogFooter className="gap-3 pt-6 border-t border-border/50">
          <Button variant="outline" onClick={onCancel} className="px-6">
            Cancel
          </Button>
          <Button onClick={onSave} className="px-6 bg-primary hover:bg-primary/90">
            Confirm & Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
