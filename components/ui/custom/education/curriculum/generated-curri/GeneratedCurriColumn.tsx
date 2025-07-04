import React from "react";

import { CurriculumnSubjectModel } from "@/app/api/model/CurriculumnSubjectModel";

import CurriSubjectItem from "./CurriSubjectItem";

interface GeneratedCurriColumnProps {
  subjects: CurriculumnSubjectModel[];
  semesterName: string;
}

export default function GeneratedCurriColumn({ subjects, semesterName }: GeneratedCurriColumnProps) {
  // Calculate total credits for this semester
  const totalCredits = subjects.reduce((sum, subject) => sum + subject.TotalCredits, 0);
  const semesterNumber = subjects.length > 0 ? subjects[0].Semester : 1;

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{semesterName}</h3>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">{subjects.length} subjects</span>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{totalCredits} credits</span>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="space-y-4">
        {subjects.map((subject) => (
          <CurriSubjectItem key={subject.SubjectID} subject={subject} />
        ))}
      </div>

      {/* Footer Summary */}
      {subjects.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Total Credits:</span>
            <span className="font-bold text-primary text-lg">{totalCredits}</span>
          </div>
        </div>
      )}
    </div>
  );
}
