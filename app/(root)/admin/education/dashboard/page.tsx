"use client";

import React, { useState } from "react";

import { MOCK_ACADEMIC_YEARS } from "@/app/api/model/AcademicYearModel";
import { Button } from "@/components/ui/button";
import AcademicYearItem from "@/components/ui/custom/education/academic_year/AcademicYearItem";
import { AcademicYearTable } from "@/components/ui/custom/education/academic_year/AcademicYearTable";
import BriefStatsItems from "@/components/ui/custom/education/general/BriefStatsItems";
import { Input } from "@/components/ui/input";
import { BookOpen, Building2, Calendar, GraduationCap, Grid, List, Plus, School, Search, Users } from "lucide-react";

export default function Page() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const academicYears = MOCK_ACADEMIC_YEARS;

  const filteredAcademicYears = academicYears.filter((year) =>
    year.year.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const statsData = [
    {
      title: "Academic Years",
      icon: <Calendar className="w-5 h-5 text-primary" />,
      total: academicYears.length,
      percentageChange: 10,
      isIncrease: true,
      unit: "years",
    },
    {
      title: "Departments",
      icon: <Building2 className="w-5 h-5 text-primary" />,
      total: 10,
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
      total: 12,
      percentageChange: 5,
      isIncrease: true,
    },
    {
      title: "Curriculums",
      icon: <BookOpen className="w-5 h-5 text-primary" />,
      total: 12,
      percentageChange: 5,
      isIncrease: true,
    },
  ];

  return (
    <div className="px-4 sm:px-6 bg-gray-50 py-4 sm:py-6 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Academic Years</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Manage academic years and their details</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search academic years..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-[200px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-300 rounded-lg p-1">
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="h-8 px-3"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="h-8 px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Button className="bg-primary hover:bg-primary/90 transition-colors whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" />
                Add Academic Year
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        {viewMode === "cards" ? (
          <>
            <div className="flex items-center gap-2 mb-6">
              <School className="w-5 h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">Overview</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredAcademicYears.map((academicYear) => (
                <AcademicYearItem key={academicYear.id} academicYear={academicYear} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-semibold">Detailed List</h2>
            </div>
            <div className="overflow-x-auto">
              <AcademicYearTable academicYears={filteredAcademicYears} />
            </div>
          </>
        )}
      </div>

      {/* Stats Grid */}
      <div className="py-6">
        <h2 className="text-lg sm:text-xl font-semibold">Overview</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, index) => (
          <BriefStatsItems
            key={index}
            title={stat.title}
            icon={stat.icon}
            total={stat.total}
            percentageChange={stat.percentageChange}
            isIncrease={stat.isIncrease}
            unit={stat.unit}
          />
        ))}
      </div>
    </div>
  );
}
