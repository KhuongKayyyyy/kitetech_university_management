"use client";

import React, { useEffect, useState } from "react";

import { formulaSubjects, subjects } from "@/app/api/fakedata";
import { SubjectModel } from "@/app/api/model/model";
import { mockRegistrationPeriods } from "@/app/api/model/RegistrationPeriodModel";
import { gradingFormulaService } from "@/app/api/services/gradingFormulaService";
import { subjectService } from "@/app/api/services/subjectService";
import GradingFormulasSection from "@/components/ui/custom/education/subject/sections/GradingFormulasSection";
import RegistrationPeriodsSection from "@/components/ui/custom/education/subject/sections/RegistrationPeriodsSection";
import SubjectsSection from "@/components/ui/custom/education/subject/sections/SubjectsSection";
import { BookOpen, Calculator, Clock } from "lucide-react";
import { Toaster } from "sonner";

const SubjectPage = () => {
  const [activeTab, setActiveTab] = useState<"subjects" | "formulas" | "registration">("subjects");
  const [subjectsCount, setSubjectsCount] = useState(0);
  const [gradingFormulasCount, setGradingFormulasCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setIsLoading(true);

        // Fetch subjects count
        const subjectsData = await subjectService.getSubjects();
        setSubjectsCount(subjectsData.length);

        // Fetch grading formulas count
        const gradingFormulasData = await gradingFormulaService.getGradingFormulas();
        setGradingFormulasCount(gradingFormulasData.length);
      } catch (error) {
        console.error("Error fetching data counts:", error);
        // Fallback to mock data counts if service fails
        setSubjectsCount(subjects.length);
        setGradingFormulasCount(formulaSubjects.length);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="px-6 bg-gray-50 py-6 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              Education Management
            </h1>
            <p className="text-gray-600 mt-1">Manage subjects, grading formulas, and registration periods</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("subjects")}
            className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === "subjects"
                ? "border-b-2 border-primary text-primary bg-primary/5"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Subjects ({isLoading ? "..." : subjectsCount})
            </div>
          </button>
          <button
            onClick={() => setActiveTab("formulas")}
            className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === "formulas"
                ? "border-b-2 border-primary text-primary bg-primary/5"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Grading Formulas ({isLoading ? "..." : gradingFormulasCount})
            </div>
          </button>
          <button
            onClick={() => setActiveTab("registration")}
            className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
              activeTab === "registration"
                ? "border-b-2 border-primary text-primary bg-primary/5"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Registration Periods ({mockRegistrationPeriods.length})
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "subjects" && <SubjectsSection />}
          {activeTab === "formulas" && <GradingFormulasSection />}
          {activeTab === "registration" && <RegistrationPeriodsSection />}
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default SubjectPage;
