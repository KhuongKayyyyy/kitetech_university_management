"use client";

import React from "react";

import { curriculumData } from "@/app/api/fakedata";
import { FakeCurriculumSubjects } from "@/app/api/fakedata/FakeCurriculumV2Data";
import { CurriculumnSubjectModel } from "@/app/api/model/CurriculumnSubjectModel";
import { Button } from "@/components/ui/button";
import CurriculumItem from "@/components/ui/custom/education/curriculum/CurriculumItem";
import GeneratedCurriBoard from "@/components/ui/custom/education/curriculum/generated-curri/GeneratedCurriBoard";
import { Edit } from "lucide-react";
import { useParams } from "next/navigation";

export default function page() {
  const { id } = useParams();

  // Convert the V2 curriculum subjects object to array format for GeneratedCurriBoard
  const curriculumSubjectsArray = Object.values(FakeCurriculumSubjects) as CurriculumnSubjectModel[];

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Curriculum Details</h1>
            <p className="text-gray-600">Manage and edit curriculum structure</p>
          </div>
          <Button className="gap-2" size="lg">
            <Edit className="h-4 w-4" />
            Edit Curriculum Board
          </Button>
        </div>
      </div>

      {/* Curriculum Item */}
      <CurriculumItem curriculum={curriculumData[0] as CurriculumModel} onEdit={() => {}} onDelete={() => {}} />

      {/* Generated Curriculum Board - Using V2 Data */}
      <GeneratedCurriBoard subjects={curriculumSubjectsArray} />
    </div>
  );
}
