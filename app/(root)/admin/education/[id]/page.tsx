"use client";

import React, { useEffect, useMemo, useState } from "react";

import { curriculumData, departmentData, majorData } from "@/app/api/fakedata";
import { AcademicYearModel, MOCK_ACADEMIC_YEARS } from "@/app/api/model/AcademicYearModel";
import { CurriculumModel } from "@/app/api/model/CurriculumModel";
import { Department, Major } from "@/app/api/model/model";
import { academicYearService } from "@/app/api/services/academicYearService";
import { Button } from "@/components/ui/button";
import { CurriculumTable } from "@/components/ui/custom/education/curriculum/CurriculumTable";
import { DepartmentTable } from "@/components/ui/custom/education/department/DepartmentTable";
import BriefStatsItems from "@/components/ui/custom/education/general/BriefStatsItems";
import { MajorTable } from "@/components/ui/custom/education/major/MajorTable";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Plus,
  School,
  Search,
  Users,
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";

export default function Page() {
  const [departments, setDepartments] = useState<Department[]>(departmentData);
  const allMajorsWithDept = useMemo(() => {
    return departmentData.flatMap((dept) =>
      dept.majors.map((major) => ({
        ...major,
        departmentName: dept.name,
        departmentId: dept.id,
      })),
    );
  }, []);
  const [majors, setMajors] = useState<Major[]>(allMajorsWithDept);
  const [curriculums, setCurriculums] = useState<CurriculumModel[]>(curriculumData);

  const params = useParams();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    semesters: true,
    departments: true,
    majors: true,
    curriculums: true,
  });

  const academicYearId = params.id as string;
  const [academicYear, setAcademicYear] = useState<AcademicYearModel | null>(null);

  useEffect(() => {
    const fetchAcademicYear = async () => {
      const data = await academicYearService.getAcademicYear(parseInt(academicYearId));
      setAcademicYear(data);
    };
    fetchAcademicYear();
  }, [academicYearId]);

  // const academicYear = MOCK_ACADEMIC_YEARS.find((year) => year.id === parseInt(academicYearId));

  if (!academicYear) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Academic Year Not Found</h1>
          <p className="text-gray-600">The requested academic year could not be found.</p>
        </div>
      </div>
    );
  }

  // Mock data for the academic year details
  const semesters = [
    { id: "1", name: "Fall Semester", startDate: "2023-09-01", endDate: "2023-12-31", status: "active" },
    { id: "2", name: "Spring Semester", startDate: "2024-01-15", endDate: "2024-05-15", status: "upcoming" },
  ];

  const filteredSemesters = semesters.filter((semester) =>
    semester.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const statsData = [
    {
      title: "Academic Years",
      icon: <Calendar className="w-5 h-5 text-primary" />,
      total: 5,
      percentageChange: 10,
      isIncrease: true,
      unit: "years",
    },
    {
      title: "Departments",
      icon: <Building2 className="w-5 h-5 text-primary" />,
      total: departments.length,
      percentageChange: 10,
      isIncrease: true,
    },
    {
      title: "Classes",
      icon: <Users className="w-5 h-5 text-primary" />,
      total: 24,
      percentageChange: 15,
      isIncrease: true,
    },
    {
      title: "Subjects",
      icon: <BookOpen className="w-5 h-5 text-primary" />,
      total: 48,
      percentageChange: 8,
      isIncrease: true,
    },
    {
      title: "Majors",
      icon: <GraduationCap className="w-5 h-5 text-primary" />,
      total: majors.length,
      percentageChange: 5,
      isIncrease: true,
    },
    {
      title: "Curriculums",
      icon: <BookOpen className="w-5 h-5 text-primary" />,
      total: curriculums.length,
      percentageChange: 5,
      isIncrease: true,
    },
  ];

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getSectionItemCount = (section: string) => {
    switch (section) {
      case "semesters":
        return filteredSemesters.length;
      case "departments":
        return departments.length;
      case "majors":
        return majors.length;
      case "curriculums":
        return curriculums.length;
      default:
        return 0;
    }
  };

  return (
    <div className="px-4 sm:px-6 bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center">
              <School className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">{academicYear.year}</h1>
              <p className="text-sm text-gray-600">Academic Year Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 hover:shadow-md transition-shadow duration-200">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search across all sections..."
            className="pl-10 focus:ring-2 focus:ring-primary/20 border-gray-300 hover:border-gray-400 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Overview</h2>
          <p className="text-sm text-gray-600">Key metrics for this academic year</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statsData.map((stat, index) => (
            <div key={index} className="hover:scale-105 transition-transform duration-200">
              <BriefStatsItems
                title={stat.title}
                icon={stat.icon}
                total={stat.total}
                percentageChange={stat.percentageChange}
                isIncrease={stat.isIncrease}
                unit={stat.unit}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Semesters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div
            className="p-4 sm:p-6 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection("semesters")}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-900">Semesters</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {getSectionItemCount("semesters")} items
                </span>
              </div>
              {expandedSections.semesters ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>

          {expandedSections.semesters && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSemesters.map((semester) => (
                  <div
                    key={semester.id}
                    className="p-4 border rounded-xl hover:shadow-lg hover:border-primary/20 transition-all duration-200 cursor-pointer group"
                  >
                    <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                      {semester.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {semester.startDate} - {semester.endDate}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 text-xs rounded-full mt-3 font-medium transition-colors ${
                        semester.status === "active"
                          ? "bg-green-100 text-green-800 group-hover:bg-green-200"
                          : "bg-blue-100 text-blue-800 group-hover:bg-blue-200"
                      }`}
                    >
                      {semester.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Departments Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div
            className="p-4 sm:p-6 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection("departments")}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-900">Departments</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {getSectionItemCount("departments")} items
                </span>
              </div>
              {expandedSections.departments ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>

          {expandedSections.departments && (
            <div className="p-4 sm:p-6">
              <div className="overflow-x-auto">
                <DepartmentTable departments={departments} />
              </div>
            </div>
          )}
        </div>

        {/* Majors Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div
            className="p-4 sm:p-6 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection("majors")}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-900">Majors</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {getSectionItemCount("majors")} items
                </span>
              </div>
              {expandedSections.majors ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>

          {expandedSections.majors && (
            <div className="p-4 sm:p-6">
              <div className="overflow-x-auto">
                <MajorTable majors={majors} />
              </div>
            </div>
          )}
        </div>

        {/* Curriculums Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div
            className="p-4 sm:p-6 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection("curriculums")}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-900">Curriculums</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {getSectionItemCount("curriculums")} items
                </span>
              </div>
              {expandedSections.curriculums ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>

          {expandedSections.curriculums && (
            <div className="p-4 sm:p-6">
              <div className="overflow-x-auto">
                <CurriculumTable curriculums={curriculums} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
