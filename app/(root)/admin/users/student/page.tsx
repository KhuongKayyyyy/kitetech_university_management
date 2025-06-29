"use client";

import React, { useMemo, useState } from "react";

import { students } from "@/app/api/fakedata";
import { Button } from "@/components/ui/button";
import AddStudentDialog from "@/components/ui/custom/user/student/AddStudentDialog";
import StudentDatabase from "@/components/ui/custom/user/student/StudentDatabase";
import StudentItem from "@/components/ui/custom/user/student/StudentItem";
import { GraduationCap, Grid, List, Plus, Search } from "lucide-react";

export default function StudentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);
  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) {
      return students;
    }

    const searchLower = searchTerm.toLowerCase();
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchLower) ||
        student.studentEmail.toLowerCase().includes(searchLower) ||
        student.studentId.toLowerCase().includes(searchLower) ||
        student.location.toLowerCase().includes(searchLower),
    );
  }, [searchTerm]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              Student Management
            </h1>
            <p className="text-gray-600 mt-1">Manage student profiles, enrollment, and academic information</p>
          </div>

          {/* Add Student Button */}
          <Button
            onClick={() => setOpenAddStudentDialog(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Student
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
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* View Toggle and Stats */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {filteredStudents.length} of {students.length} students
            </span>

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
          </div>
        </div>
      </div>

      {/* Content Section */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-600">
            {searchTerm ? "Try adjusting your search criteria." : "Get started by adding your first student."}
          </p>
          {!searchTerm && (
            <Button className="mt-4" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add First Student
            </Button>
          )}
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentItem key={student.id} student={student} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <StudentDatabase students={filteredStudents} />
        </div>
      )}
      <AddStudentDialog open={openAddStudentDialog} onClose={() => setOpenAddStudentDialog(false)} />
    </div>
  );
}
