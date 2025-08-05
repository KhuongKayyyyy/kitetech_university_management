"use client";

import React, { useEffect, useState } from "react";

import { FacultyModel } from "@/app/api/model/model";
import { MOCK_SUBJECT_CLASSES, SubjectClassModel } from "@/app/api/model/SubjectClassModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubjectClassItem } from "@/components/ui/custom/elearning/subject_class/SubjectClassItem";
import { SubjectClassTable } from "@/components/ui/custom/elearning/subject_class/SubjectClassTable";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, List, Plus, Search } from "lucide-react";

export default function CoursePage() {
  const [subjectClasses, setSubjectClasses] = useState<SubjectClassModel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isLoading, setIsLoading] = useState(false);

  // Use mock data from the model
  useEffect(() => {
    setSubjectClasses(MOCK_SUBJECT_CLASSES);
  }, []);

  const handleUpdateSubjectClass = async (updatedSubjectClass: SubjectClassModel) => {
    setSubjectClasses((prev) => prev.map((sc) => (sc.id === updatedSubjectClass.id ? updatedSubjectClass : sc)));
  };

  const handleDeleteSubjectClasses = async (subjectClassIds: string[]) => {
    setSubjectClasses((prev) => prev.filter((sc) => !subjectClassIds.includes(sc.id!)));
  };

  const filteredSubjectClasses = subjectClasses.filter(
    (sc) =>
      sc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sc.subject?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sc.teacher?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeClasses = subjectClasses.filter((sc) => sc.isActive).length;
  const totalEnrollments = subjectClasses.reduce((sum, sc) => sum + (sc.enrolledStudents?.length || 0), 0);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
          <p className="text-muted-foreground">Manage and organize subject classes for the current semester</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Course
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjectClasses.length}</div>
            <p className="text-xs text-muted-foreground">{activeClasses} active courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">Students enrolled across all courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Class Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subjectClasses.length > 0 ? Math.round(totalEnrollments / subjectClasses.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Students per course</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search courses, subjects, or teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="flex items-center gap-2"
          >
            <Grid className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            Table
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjectClasses.map((subjectClass) => (
            <SubjectClassItem key={subjectClass.id} subjectClass={subjectClass} onUpdate={handleUpdateSubjectClass} />
          ))}
        </div>
      ) : (
        <SubjectClassTable
          subjectClasses={filteredSubjectClasses}
          onUpdate={handleUpdateSubjectClass}
          onDelete={handleDeleteSubjectClasses}
        />
      )}

      {filteredSubjectClasses.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">No courses found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms or clear the search to see all courses."
                  : "Get started by adding your first course."}
              </p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
