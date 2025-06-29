"use client";

import React, { useMemo, useState } from "react";

import { departmentData } from "@/app/api/fakedata";
import { Button } from "@/components/ui/button";
import MajorItem from "@/components/ui/custom/education/major/MajorItem";
import { MajorTable } from "@/components/ui/custom/education/major/MajorTable";
import { Building, GraduationCap, Grid, List, Plus, Search } from "lucide-react";

const MajorPage = () => {
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedYear, setSelectedYear] = useState("2024");

  // Get all majors with department info
  const allMajorsWithDept = useMemo(() => {
    return departmentData.flatMap((dept) =>
      dept.majors.map((major) => ({
        ...major,
        departmentName: dept.name,
        departmentId: dept.id,
      })),
    );
  }, []);

  // Get unique departments for filter
  const departments = useMemo(() => Array.from(new Set(departmentData.map((dept) => dept.name))), []);

  // Filter majors based on search and department
  const filteredMajors = useMemo(() => {
    return allMajorsWithDept.filter((major) => {
      const matchesSearch =
        major.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (major.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        major.departmentName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = selectedDepartment === "all" || major.departmentName === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [allMajorsWithDept, searchTerm, selectedDepartment]);

  // Group majors by department for cards view
  const groupedMajors = useMemo(() => {
    const grouped = filteredMajors.reduce(
      (acc, major) => {
        const deptName = major.departmentName;
        if (!acc[deptName]) {
          acc[deptName] = [];
        }
        acc[deptName].push(major);
        return acc;
      },
      {} as Record<string, typeof filteredMajors>,
    );
    return grouped;
  }, [filteredMajors]);

  return (
    <div className="px-6 bg-primary-foreground py-6 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Major Management</h1>
          <p className="text-gray-600">Manage academic majors across all departments</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Year Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="year-picker" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Academic Year:
            </label>
            <select
              id="year-picker"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
            >
              <option value="2023">2023-2024</option>
              <option value="2024">2024-2025</option>
              <option value="2025">2025-2026</option>
              <option value="2026">2026-2027</option>
            </select>
          </div>

          {/* Add Major Button */}
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Add Major
          </Button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search majors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle and Stats */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {filteredMajors.length} of {allMajorsWithDept.length} majors
            </span>

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
          </div>
        </div>
      </div>

      {/* Content Section */}
      {filteredMajors.length === 0 ? (
        <div className="text-center py-12">
          <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No majors found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <MajorTable majors={filteredMajors} />
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMajors).map(([departmentName, majors]) => (
            <div key={departmentName} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  {departmentName}
                </h2>
                <p className="text-sm text-gray-600">
                  {majors.length} {majors.length === 1 ? "major" : "majors"} available
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {majors.map((major) => {
                  const department = departmentData.find((d) => d.id === major.departmentId);
                  return <MajorItem key={major.id} major={major} department={department!} />;
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MajorPage;
