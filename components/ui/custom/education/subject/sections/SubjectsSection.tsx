"use client";

import React, { useMemo, useState } from "react";

import { departmentData, subjects } from "@/app/api/fakedata";
import { Subject } from "@/app/api/model/model";
import { Button } from "@/components/ui/button";
import { AddSubjectDialog } from "@/components/ui/custom/education/subject/AddSubjectDialog";
import SubjectItem from "@/components/ui/custom/education/subject/SubjectItem";
import { SubjectTable } from "@/components/ui/custom/education/subject/SubjectTable";
import { BookOpen, Grid, List, Plus, Search } from "lucide-react";
import { toast } from "sonner";

// Helper to flatten all majors and map by ID
const getMajorMap = () => {
  const majorMap = new Map<number, { major: any; departmentName: string }>();
  departmentData.forEach((dept) => {
    dept.majors.forEach((major) => {
      majorMap.set(major.id, {
        major,
        departmentName: dept.name,
      });
    });
  });
  return majorMap;
};

export default function SubjectsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedMajor, setSelectedMajor] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [openAddSubjectDialog, setOpenAddSubjectDialog] = useState(false);
  const majorMap = getMajorMap();

  // Get unique departments and majors for filters
  const departments = useMemo(() => Array.from(new Set(departmentData.map((dept) => dept.name))), []);

  const availableMajors = useMemo(() => {
    if (selectedDepartment === "all") return [];
    const dept = departmentData.find((d) => d.name === selectedDepartment);
    return dept ? dept.majors : [];
  }, [selectedDepartment]);

  // Filter subjects based on search and filters
  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const majorInfo = majorMap.get(Number(subject.majorId));
      if (!majorInfo) return false;

      const matchesSearch =
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (subject.description ?? "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = selectedDepartment === "all" || majorInfo.departmentName === selectedDepartment;

      const matchesMajor = selectedMajor === "all" || majorInfo.major.name === selectedMajor;

      return matchesSearch && matchesDepartment && matchesMajor;
    });
  }, [subjects, searchTerm, selectedDepartment, selectedMajor, majorMap]);

  // Group filtered subjects by majorId
  const groupedSubjects = useMemo(() => {
    const grouped: { [majorId: number]: Subject[] } = {};
    filteredSubjects.forEach((subject) => {
      if (!grouped[Number(subject.majorId)]) {
        grouped[Number(subject.majorId)] = [];
      }
      grouped[Number(subject.majorId)].push(subject);
    });
    return grouped;
  }, [filteredSubjects]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("all");
    setSelectedMajor("all");
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-primary" />
            Subject Management
          </h2>
          <p className="text-gray-600 mt-1">Manage and organize academic subjects</p>
        </div>
        <button
          onClick={() => setOpenAddSubjectDialog(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search subjects by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setSelectedMajor("all");
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Major Filter */}
          <select
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(e.target.value)}
            disabled={selectedDepartment === "all"}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="all">All Majors</option>
            {availableMajors.map((major) => (
              <option key={major.id} value={major.name}>
                {major.name}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
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

          {/* Reset Filters */}
          {(searchTerm || selectedDepartment !== "all" || selectedMajor !== "all") && (
            <button
              onClick={resetFilters}
              className="text-primary hover:text-primary/80 font-medium px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredSubjects.length} of {subjects.length} subjects
        </div>
      </div>

      {/* Content Display */}
      {viewMode === "cards" ? (
        <div className="space-y-8">
          {Object.keys(groupedSubjects).length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            Object.entries(groupedSubjects).map(([majorId, subjectList]) => {
              const majorInfo = majorMap.get(Number(majorId));
              if (!majorInfo) return null;

              return (
                <div key={majorId} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{majorInfo.major.name}</h2>
                    <p className="text-sm text-gray-600">
                      Department: {majorInfo.departmentName} • {subjectList.length} subjects
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjectList.map((subject) => (
                      <SubjectItem key={subject.id} subject={subject} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <SubjectTable subjects={filteredSubjects} />
      )}

      {/* Add Subject Dialog */}
      <AddSubjectDialog
        open={openAddSubjectDialog}
        setOpen={setOpenAddSubjectDialog}
        onSubmit={() => {
          toast.success("Subject added successfully");
        }}
      />
    </>
  );
}
