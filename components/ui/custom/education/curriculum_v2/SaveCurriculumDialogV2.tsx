"use client";

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
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Calendar, GraduationCap, Users } from "lucide-react";

interface SaveCurriculumDialogV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  curriculumInfo: any;
  boards: any[];
  subjects: { [key: string]: CurriculumnSubjectModel };
  onSave: () => void;
  onCancel: () => void;
}

export default function SaveCurriculumDialogV2({
  open,
  onOpenChange,
  curriculumInfo,
  boards,
  subjects,
  onSave,
  onCancel,
}: SaveCurriculumDialogV2Props) {
  // Calculate totals
  const totalSubjects = Object.keys(subjects).length;
  const totalCredits = Object.values(subjects).reduce(
    (sum: number, subject: CurriculumnSubjectModel) => sum + subject.TotalCredits,
    0,
  );
  const totalSemesters = boards.reduce((sum: number, board: any) => sum + Object.keys(board.semesterColumn).length, 0);

  const getIconForBoardType = (boardType: string) => {
    switch (boardType) {
      case "core":
        return <BookOpen className="w-4 h-4" />;
      case "physical_education":
        return <Users className="w-4 h-4" />;
      case "skill_development":
        return <GraduationCap className="w-4 h-4" />;
      case "english":
        return <BookOpen className="w-4 h-4" />;
      case "philosophy":
        return <Calendar className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Save Curriculum - {curriculumInfo?.name}</DialogTitle>
          <DialogDescription>
            Review your curriculum structure before saving. This will create the curriculum with all boards, semesters,
            and subjects.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] w-full">
          <div className="space-y-6">
            {/* Curriculum Summary */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Curriculum Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{boards.length}</div>
                  <div className="text-sm text-gray-600">Boards</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{totalSemesters}</div>
                  <div className="text-sm text-gray-600">Semesters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{totalSubjects}</div>
                  <div className="text-sm text-gray-600">Subjects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{totalCredits}</div>
                  <div className="text-sm text-gray-600">Total Credits</div>
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Detailed Structure</h3>
              {boards.map((board, boardIndex) => (
                <div key={board.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {getIconForBoardType(board.type)}
                    <h4 className="font-semibold">{board.name}</h4>
                    <Badge variant="secondary">{board.type}</Badge>
                  </div>

                  <div className="grid gap-3">
                    {board.columnOrder.map((columnId: string) => {
                      const column = board.semesterColumn[columnId];
                      if (!column) return null;

                      const columnSubjects = column.subjectIds
                        .map((subjectId: string) => subjects[subjectId])
                        .filter(Boolean);

                      const columnCredits = columnSubjects.reduce(
                        (sum: number, subject: CurriculumnSubjectModel) => sum + subject.TotalCredits,
                        0,
                      );

                      return (
                        <div key={columnId} className="bg-gray-50 rounded-md p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-sm">{column.title}</h5>
                            <div className="text-xs text-gray-500">
                              {columnSubjects.length} subjects • {columnCredits} credits
                            </div>
                          </div>

                          {columnSubjects.length > 0 ? (
                            <div className="space-y-1">
                              {columnSubjects.map((subject: CurriculumnSubjectModel) => (
                                <div
                                  key={subject.SubjectID}
                                  className="flex items-center justify-between text-xs bg-white rounded px-2 py-1"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{subject.SubjectName}</span>
                                    {subject.HasPrerequisite && (
                                      <Badge variant="outline" className="text-xs px-1 py-0">
                                        Has Prerequisites
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-500">ID: {subject.SubjectID}</span>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-500">{subject.TotalCredits} credits</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500 italic py-2">No subjects in this semester</div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {boardIndex < boards.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>

            {/* Prerequisites Summary */}
            {Object.values(subjects).some((s) => s.HasPrerequisite) && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Prerequisites Overview</h3>
                <div className="space-y-2">
                  {Object.values(subjects)
                    .filter((s) => s.HasPrerequisite && s.PrerequisiteSubjects.length > 0)
                    .map((subject) => (
                      <div key={subject.SubjectID} className="text-sm">
                        <span className="font-medium">{subject.SubjectName}</span>
                        <span className="text-gray-600"> requires: </span>
                        <span className="text-blue-600">
                          {subject.PrerequisiteSubjects.map((p) => p.name).join(", ")}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
            Save Curriculum
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
