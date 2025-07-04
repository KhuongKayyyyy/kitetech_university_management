"use client";

import React, { useMemo, useRef, useState } from "react";

import { curriculumData, students } from "@/app/api/fakedata";
import { FakeCurriclumnData } from "@/app/api/fakedata/FakeCurriclumnData";
import { CurriculumnSubjectModel, defaultCurriculumnSubject } from "@/app/api/model/CurriculumnSubjectModel";
import { Button } from "@/components/ui/button";
import ClassDetailSectionMap from "@/components/ui/custom/education/class/ClassDetailSectionMap";
import CurriSubjectItem from "@/components/ui/custom/education/curriculum/generated-curri/CurriSubjectItem";
import GeneratedCurriBoard from "@/components/ui/custom/education/curriculum/generated-curri/GeneratedCurriBoard";
import GeneratedCurriColumn from "@/components/ui/custom/education/curriculum/generated-curri/GeneratedCurriColumn";
import StudentItem from "@/components/ui/custom/user/student/StudentItem";
import StudentTable from "@/components/ui/custom/user/student/StudentTable";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Grid,
  List,
  Plus,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";

export default function page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSection, setActiveSection] = useState("student");
  const itemsPerPage = 9; // 3x4 grid for cards
  const { id } = useParams();

  // Refs for sections
  const studentSectionRef = useRef<HTMLDivElement>(null);
  const curriculumSectionRef = useRef<HTMLDivElement>(null);
  const performanceSectionRef = useRef<HTMLDivElement>(null);

  // Take only first 50 students
  const classStudents = students.slice(0, 50);

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) {
      return classStudents;
    }

    const searchLower = searchTerm.toLowerCase();
    return classStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(searchLower) ||
        student.studentEmail.toLowerCase().includes(searchLower) ||
        student.studentId.toLowerCase().includes(searchLower) ||
        student.location.toLowerCase().includes(searchLower),
    );
  }, [searchTerm, classStudents]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle section change with auto-scroll
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);

    // Get the appropriate ref based on section
    let targetRef;
    switch (sectionId) {
      case "student":
        targetRef = studentSectionRef;
        break;
      case "curriculum":
        targetRef = curriculumSectionRef;
        break;
      case "performance":
        targetRef = performanceSectionRef;
        break;
      default:
        targetRef = studentSectionRef;
    }

    // Scroll to the section with smooth behavior
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              Class {id} Details
            </h1>
            <p className="text-gray-600 mt-1">Manage class information, students, and curriculum</p>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <ClassDetailSectionMap activeSection={activeSection} onSectionChange={handleSectionChange} />

      {/* Students Section */}
      <div ref={studentSectionRef} className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900">Students</h2>
          <span className="text-sm text-gray-500">({classStudents.length} total)</span>
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
                {filteredStudents.length} of {classStudents.length} students
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
              {searchTerm ? "Try adjusting your search criteria." : "No students are enrolled in this class."}
            </p>
          </div>
        ) : viewMode === "cards" ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedStudents.map((student) => (
                <StudentItem key={student.id} student={student} />
              ))}
            </div>

            {/* Pagination for Cards */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length}{" "}
                  students
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <StudentTable students={filteredStudents} />
          </div>
        )}
      </div>

      {/* Curriculum Section */}
      <div ref={curriculumSectionRef} className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900">Curriculum</h2>
          <span className="text-sm text-gray-500">({FakeCurriclumnData.length} subjects)</span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <GeneratedCurriBoard subjects={FakeCurriclumnData as CurriculumnSubjectModel[]} />
        </div>
      </div>

      {/* Performance Section */}
      <div ref={performanceSectionRef} className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900">Performance Analytics</h2>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Analytics</h3>
            <p className="text-gray-600">Class performance metrics and analytics will be displayed here.</p>
            <Button className="mt-4" variant="outline">
              View Detailed Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
