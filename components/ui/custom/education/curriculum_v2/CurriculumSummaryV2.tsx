"use client";

import React from "react";

import { CurriculumnSubjectModel } from "@/app/api/model/CurriculumnSubjectModel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, Clock, GraduationCap, Target, Users } from "lucide-react";

import { CurriculumBoardType } from "./CreateCurriculumDialog";

interface Board {
  id: string;
  name: string;
  type: string;
  curriculumId: string;
  curriculumTypeId: string;
  columnOrder: string[];
  semesterColumn: {
    [key: string]: {
      id: string;
      title: string;
      subjectIds: string[];
      curriculumTypeId: string;
      semesterNumber: number;
    };
  };
}

interface CurriculumInfo {
  id: string;
  name: string;
  description: string;
  academicYear: string;
  facultyId: string;
  majorId: string;
  totalCredits: number;
  createdAt: string;
}

interface CurriculumSummaryV2Props {
  steps: CurriculumBoardType[];
  boards: Board[];
  subjects: { [key: string]: CurriculumnSubjectModel };
  curriculumInfo: CurriculumInfo;
}

export default function CurriculumSummaryV2({ steps, boards, subjects, curriculumInfo }: CurriculumSummaryV2Props) {
  // Calculate statistics
  const totalSubjects = Object.keys(subjects).length;
  const totalSemesters = boards.reduce((total, board) => total + Object.keys(board.semesterColumn).length, 0);
  const actualTotalCredits = Object.values(subjects).reduce((total, subject) => total + subject.TotalCredits, 0);

  // Group subjects by board type
  const subjectsByBoard = boards.map((board) => {
    const boardSubjects = Object.values(board.semesterColumn).flatMap((column) =>
      column.subjectIds.map((subjectId) => subjects[subjectId]).filter(Boolean),
    );
    const boardCredits = boardSubjects.reduce((total, subject) => total + subject.TotalCredits, 0);
    return {
      ...board,
      subjects: boardSubjects,
      credits: boardCredits,
      subjectCount: boardSubjects.length,
    };
  });

  const getIconForBoardType = (boardTypeId: string) => {
    switch (boardTypeId) {
      case "core":
        return BookOpen;
      case "physical_education":
        return Users;
      case "skill_development":
        return Target;
      case "english":
        return GraduationCap;
      case "philosophy":
        return Calendar;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <GraduationCap className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Curriculum Summary</h2>
            <p className="text-gray-600">Overview of your completed curriculum structure</p>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalSubjects}</div>
              <div className="text-sm text-gray-600">Total Subjects</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-8 h-8 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{actualTotalCredits}</div>
              <div className="text-sm text-gray-600">Total Credits</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalSemesters}</div>
              <div className="text-sm text-gray-600">Total Semesters</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-8 h-8 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{boards.length}</div>
              <div className="text-sm text-gray-600">Subject Categories</div>
            </CardContent>
          </Card>
        </div>

        {/* Curriculum Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Curriculum Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Name:</span>
                <p className="text-gray-900">{curriculumInfo.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Academic Year:</span>
                <p className="text-gray-900">{curriculumInfo.academicYear}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Planned Credits:</span>
                <p className="text-gray-900">{curriculumInfo.totalCredits}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Actual Credits:</span>
                <p className="text-gray-900">{actualTotalCredits}</p>
              </div>
              {curriculumInfo.description && (
                <div className="md:col-span-2">
                  <span className="text-sm font-medium text-gray-500">Description:</span>
                  <p className="text-gray-900">{curriculumInfo.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Breakdown by Board Type */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {subjectsByBoard.map((boardData) => {
            const IconComponent = getIconForBoardType(boardData.type);
            return (
              <Card key={boardData.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-5 h-5" />
                      <span>{boardData.name}</span>
                    </div>
                    <Badge variant="secondary">{boardData.subjectCount} subjects</Badge>
                  </CardTitle>
                  <CardDescription>
                    {boardData.credits} credits across {Object.keys(boardData.semesterColumn).length} semesters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.values(boardData.semesterColumn).map((semester) => {
                      const semesterSubjects = semester.subjectIds.map((id) => subjects[id]).filter(Boolean);
                      const semesterCredits = semesterSubjects.reduce(
                        (total, subject) => total + subject.TotalCredits,
                        0,
                      );

                      return (
                        <div key={semester.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{semester.title}</h4>
                            <span className="text-xs text-gray-500">
                              {semesterSubjects.length} subjects • {semesterCredits} credits
                            </span>
                          </div>
                          {semesterSubjects.length > 0 ? (
                            <div className="space-y-1">
                              {semesterSubjects.map((subject) => (
                                <div key={subject.SubjectID} className="flex items-center justify-between text-xs">
                                  <span className="text-gray-700">{subject.SubjectName}</span>
                                  <span className="text-gray-500">{subject.TotalCredits} credits</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 italic">No subjects assigned</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
