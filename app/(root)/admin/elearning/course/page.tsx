"use client";

import React, { useEffect, useState } from "react";

import { Course, CourseDetailModel } from "@/app/api/model/Course";
import { subjectClassService } from "@/app/api/services/courseService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AddCourseDialog from "@/components/ui/custom/elearning/course/AddCourseDialog";
import { SubjectClassItem } from "@/components/ui/custom/elearning/subject_class/CourseItem";
import { SubjectClassTable } from "@/components/ui/custom/elearning/subject_class/SubjectClassTable";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_CONFIG } from "@/constants/api_config";
import { Download, Grid, List, Plus, Search, Upload } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function CoursePage() {
  const [courses, setCourses] = useState<CourseDetailModel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [addCourseDialogOpen, setAddCourseDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleAddCourse = async (course: Course) => {
    try {
      await subjectClassService.addSubjectClass(course);
      toast.success("Course added successfully!");
      // Refresh the courses list
      loadCourses();
      setAddCourseDialogOpen(false);
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Failed to add course");
    }
  };

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const coursesData = await subjectClassService.getSubjectClasses();
      setCourses(coursesData || []);
    } catch (error) {
      console.error("Error loading courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  };

  // Load courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  const handleUpdateCourse = async (updatedCourse: CourseDetailModel) => {
    try {
      // Convert CourseDetailModel to Course for API call
      const courseData: Course = {
        subject_id: parseInt(updatedCourse.subject.id),
        semester: updatedCourse.semester,
        description: updatedCourse.description,
        schedules: updatedCourse.schedules || [],
        start_date: updatedCourse.start_date,
        end_date: updatedCourse.end_date,
        location: updatedCourse.location,
        enrolled: updatedCourse.enrolled,
        teacher_username: updatedCourse.instructor,
      };

      await subjectClassService.updateSubjectClass(courseData);
      toast.success("Course updated successfully!");
      loadCourses(); // Refresh the list
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
    }
  };

  const handleDeleteCourses = async (courseIds: string[]) => {
    try {
      // Delete courses one by one
      for (const id of courseIds) {
        await subjectClassService.deleteSubjectClass(parseInt(id));
      }
      toast.success("Courses deleted successfully!");
      loadCourses(); // Refresh the list
    } catch (error) {
      console.error("Error deleting courses:", error);
      toast.error("Failed to delete courses");
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.subject?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeClasses = courses.filter((course) => course.is_active).length;
  const totalEnrollments = courses.reduce((sum, course) => sum + course.enrolled, 0);

  const handleDownloadTemplate = async () => {
    try {
      const downloadResponse = await fetch(API_CONFIG.DOWNLOAD_COURSE_TEMPLATE);
      if (!downloadResponse.ok) {
        throw new Error("Failed to download template");
      }

      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "courses_template.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Failed to download template");
    }
  };

  const handleImportCourse = async () => {};

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Toaster />
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
          <p className="text-muted-foreground">Manage and organize subject classes for the current semester</p>
        </div>

        <Button variant="outline" className="flex items-center gap-2" onClick={() => handleDownloadTemplate()}>
          <Download className="w-4 h-4" />
          Download Template
        </Button>

        {/* Import Button */}
        <Button variant="outline" className="flex items-center gap-2" onClick={() => handleImportCourse()}>
          <Upload className="w-4 h-4" />
          Import
        </Button>
        <AddCourseDialog
          isOpen={addCourseDialogOpen}
          onOpenChange={setAddCourseDialogOpen}
          onCourseAdd={handleAddCourse}
          trigger={
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Course
            </Button>
          }
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
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
              {courses.length > 0 ? Math.round(totalEnrollments / courses.length) : 0}
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
      {isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Loading courses...</h3>
              <p className="text-muted-foreground">Please wait while we fetch the course data.</p>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <SubjectClassItem key={course.id} course={course} onUpdate={handleUpdateCourse} />
          ))}
        </div>
      ) : (
        <SubjectClassTable
          subjectClasses={filteredCourses}
          onUpdate={handleUpdateCourse}
          onDelete={handleDeleteCourses}
        />
      )}

      {!isLoading && filteredCourses.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">No courses found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms or clear the search to see all courses."
                  : "Get started by adding your first course."}
              </p>
              <Button className="mt-4" onClick={() => setAddCourseDialogOpen(true)}>
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
