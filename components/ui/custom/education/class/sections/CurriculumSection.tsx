"use client";

import React from "react";

import { FakeCurriclumnData } from "@/app/api/fakedata/FakeCurriclumnData";
import { CurriculumnSubjectModel } from "@/app/api/model/CurriculumnSubjectModel";
import GeneratedCurriBoard from "@/components/ui/custom/education/curriculum/generated-curri/GeneratedCurriBoard";
import { BookOpen } from "lucide-react";

interface CurriculumSectionProps {
  classId: string;
}

export default function CurriculumSection({ classId }: CurriculumSectionProps) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      {/* <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Curriculum Overview</h2>
              <p className="text-gray-600">Course structure and subject progression</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
              {FakeCurriclumnData.length} Subjects
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">{FakeCurriclumnData.length}</div>
            <div className="text-sm text-gray-600">Total Subjects</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {FakeCurriclumnData.reduce((sum, subject) => sum + subject.TotalCredits, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Credits</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">8</div>
            <div className="text-sm text-gray-600">Semesters</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">85%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
        </div>
      </div> */}

      {/* Curriculum Board */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <GeneratedCurriBoard subjects={FakeCurriclumnData as CurriculumnSubjectModel[]} />
      </div>
    </div>
  );
}
