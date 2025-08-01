"use client";

import React, { useMemo, useState } from "react";

import { MajorModel } from "@/app/api/model/model";
import { majorService } from "@/app/api/services/majorService";
import { Button } from "@/components/ui/button";
import MajorItem from "@/components/ui/custom/education/major/MajorItem";
import { MajorTable } from "@/components/ui/custom/education/major/MajorTable";
import { NewMajorDialog } from "@/components/ui/custom/education/major/NewMajorDialog";
import { useDepartments } from "@/hooks/useDeparment";
import { useMajors } from "@/hooks/useMajor";
import { Building, GraduationCap, Grid, List, Plus, Search } from "lucide-react";
import { toast } from "sonner";

// Skeleton Components
const MajorCardSkeleton = () => (
  <div className="p-4 border border-gray-200 rounded-lg animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
  </div>
);

const MajorTableSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/8"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MajorPageSkeleton = () => (
  <div className="px-6 bg-primary-foreground py-6 min-h-screen">
    {/* Header Skeleton */}
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div>
        <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
    </div>

    {/* Controls Skeleton */}
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="h-10 bg-gray-200 rounded w-full max-w-md animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="space-y-8">
      {[...Array(3)].map((_, deptIndex) => (
        <div key={deptIndex} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-6">
            <div className="h-6 bg-gray-200 rounded w-48 mb-1 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, majorIndex) => (
              <MajorCardSkeleton key={majorIndex} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MajorPage = () => {
  const { majors, setMajors, loading } = useMajors();
  const { departments: departmentData, setDepartments, loading: departmentLoading } = useDepartments();

  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [openAddMajor, setOpenAddMajor] = useState(false);

  const handleAddMajor = async (newMajor: MajorModel) => {
    try {
      const created = await majorService.addMajor(newMajor);

      const attachedFaculty = departmentData.find((dept) => dept.id === newMajor.faculty?.id);
      const completeMajor = { ...created, faculty: attachedFaculty };
      toast.success("Major " + newMajor.name + " added successfully!");
      setMajors([...majors, completeMajor]);
    } catch (error) {
      console.error("Failed to add major:", error);
      toast.error("Failed to add major. Please try again.");
    }
  };

  const handleMajorUpdated = (updatedMajor: MajorModel) => {
    setMajors((prevMajors) =>
      prevMajors.map((major) =>
        major.id === updatedMajor.id ? { ...updatedMajor, faculty: updatedMajor.faculty } : major,
      ),
    );
  };

  const handleMajorsDeleted = async (deletedMajors: MajorModel[]) => {
    try {
      for (const major of deletedMajors) {
        await majorService.deleteMajor(major.id.toString());
      }
      setMajors((prevMajors) =>
        prevMajors.filter((major) => !deletedMajors.some((deleted) => deleted.id === major.id)),
      );
      toast.success(deletedMajors.length + " majors deleted successfully!");
    } catch (error) {
      console.error("Failed to delete majors:", error);
      toast.error("Failed to delete majors. Please try again.");
    }
  };

  const allMajorsWithFaculty = useMemo(() => {
    return majors.map((major) => ({
      ...major,
      facultyName: major.faculty?.name || "Unknown Faculty",
    }));
  }, [majors]);

  // Get unique departments for filter
  const departmentNames = useMemo(() => {
    const uniqueDepts = Array.from(new Set(allMajorsWithFaculty.map((major) => major.facultyName)));
    return uniqueDepts.filter((dept) => dept !== "Unknown Faculty");
  }, [allMajorsWithFaculty]);

  // Filter majors based on search and department
  const filteredMajors = useMemo(() => {
    return allMajorsWithFaculty.filter((major) => {
      const matchesSearch =
        major.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (major.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        major.facultyName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = selectedDepartment === "all" || major.facultyName === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [allMajorsWithFaculty, searchTerm, selectedDepartment]);

  // Group majors by department for cards view
  const groupedMajors = useMemo(() => {
    const grouped = filteredMajors.reduce(
      (acc, major) => {
        const deptName = major.facultyName;
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

  if (loading || departmentLoading) {
    return <MajorPageSkeleton />;
  }

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
          <Button
            onClick={() => setOpenAddMajor(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
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
              {departmentNames.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle and Stats */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {filteredMajors.length} of {allMajorsWithFaculty.length} majors
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
          <MajorTable majors={filteredMajors} onMajorsDeleted={handleMajorsDeleted} />
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
                  const department = departmentData.find((d) => d.id === major.faculty?.id);
                  return (
                    <MajorItem
                      key={major.id}
                      major={major}
                      department={department!}
                      onMajorUpdated={handleMajorUpdated}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <NewMajorDialog open={openAddMajor} setOpen={setOpenAddMajor} onAdd={handleAddMajor} />
    </div>
  );
};

export default MajorPage;
