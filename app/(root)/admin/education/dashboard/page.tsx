"use client";

import React, { useState } from "react";

import { MOCK_ACADEMIC_YEARS } from "@/app/api/model/AcademicYearModel";
import { Button } from "@/components/ui/button";
import AcademicYearItem from "@/components/ui/custom/education/academic_year/AcademicYearItem";
import { AcademicYearTable } from "@/components/ui/custom/education/academic_year/AcademicYearTable";
import { Input } from "@/components/ui/input";
import { Calendar, Grid, List, Plus, School, Search } from "lucide-react";

export default function page() {
  const academicYears = MOCK_ACADEMIC_YEARS;
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAcademicYears = academicYears.filter((year) =>
    year.year.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="px-6 bg-gray-50 py-6 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Academic Years</h1>
              <p className="text-gray-600 mt-1">Manage academic years and their details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search academic years..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg p-1 mr-2">
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
            <Button className="bg-primary hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Academic Year
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {viewMode === "cards" ? (
          <>
            <div className="flex items-center gap-2 mb-6">
              <School className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAcademicYears.map((academicYear) => (
                <AcademicYearItem key={academicYear.id} academicYear={academicYear} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Detailed List</h2>
            </div>
            <AcademicYearTable academicYears={filteredAcademicYears} />
          </>
        )}
      </div>
    </div>
  );
}
