"use client";

import React, { useState } from "react";

import { departmentData } from "@/app/api/fakedata";
import { Button } from "@/components/ui/button";
import DepartmentItem from "@/components/ui/custom/education/department/DepartmentItem";
import { DepartmentTable } from "@/components/ui/custom/education/department/DepartmentTable";
import { Building, Grid, List, Plus, Search } from "lucide-react";

const DepartmentPage = () => {
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024");

  // Filter departments based on search term
  const filteredDepartments = departmentData.filter(
    (department) =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (department.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="px-6 bg-primary-foreground py-6 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Department Management</h1>
          <p className="text-gray-600">Manage departments and their associated majors</p>
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

          {/* Add Department Button */}
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Add Department
          </Button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* View Toggle and Stats */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {filteredDepartments.length} of {departmentData.length} departments
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
      {filteredDepartments.length === 0 ? (
        <div className="text-center py-12">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
          <p className="text-gray-600">Try adjusting your search criteria.</p>
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((department) => (
            <DepartmentItem key={department.id} department={department} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <DepartmentTable departments={filteredDepartments} />
        </div>
      )}
    </div>
  );
};

export default DepartmentPage;
