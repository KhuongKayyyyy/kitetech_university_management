"use client";

import React, { useEffect, useState } from "react";

import PreviewImportCourse from "@/app/(root)/admin/elearning/course/PreviewImportCourse";
import { Course, CourseDetailModel } from "@/app/api/model/Course";
import { subjectClassService } from "@/app/api/services/courseService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AddCourseDialog from "@/components/ui/custom/elearning/course/AddCourseDialog";
import { SubjectClassItem } from "@/components/ui/custom/elearning/subject_class/CourseItem";
import { CourseTable } from "@/components/ui/custom/elearning/subject_class/CourseTable";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { API_CONFIG } from "@/constants/api_config";
import { BookOpen, Download, Grid, List, Plus, Search, Upload } from "lucide-react";
import { toast, Toaster } from "sonner";

// Skeleton components for loading states
const StatsCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-24" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-32" />
    </CardContent>
  </Card>
);

const GridItemSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-8 w-20" />
      </div>
    </CardContent>
  </Card>
);

const TableRowSkeleton = () => (
  <tr>
    <td className="p-4">
      <Skeleton className="h-4 w-4" />
    </td>
    <td className="p-4">
      <Skeleton className="h-4 w-32" />
    </td>
    <td className="p-4">
      <Skeleton className="h-4 w-24" />
    </td>
    <td className="p-4">
      <Skeleton className="h-4 w-20" />
    </td>
    <td className="p-4">
      <Skeleton className="h-4 w-16" />
    </td>
    <td className="p-4">
      <Skeleton className="h-4 w-20" />
    </td>
    <td className="p-4">
      <Skeleton className="h-4 w-12" />
    </td>
    <td className="p-4">
      <div className="flex gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </td>
  </tr>
);

export default function CoursePage() {
  const [courses, setCourses] = useState<CourseDetailModel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [addCourseDialogOpen, setAddCourseDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

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
        start_date: updatedCourse.start_date || "",
        end_date: updatedCourse.end_date || "",
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
      course.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.semester?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.location?.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const handleImportCourse = async () => {
    // Create a file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setSelectedFile(file);
        setImportDialogOpen(true);
      }
    };
    input.click();
  };

  const handleImportConfirm = async (validData: any[]) => {
    setIsImporting(true);
    try {
      // Helper function to normalize date formats (same as in PreviewImportCourse)
      const normalizeDate = (dateStr: string) => {
        if (!dateStr) return dateStr;
        const parts = dateStr.split(/[\/\-]/);
        if (parts.length === 3) {
          // Detect if format is DD/MM/YYYY (day > 12)
          if (parseInt(parts[0]) > 12) {
            return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
          }
          // Detect if format is MM/DD/YYYY (month > 12, day <= 12)
          else if (parseInt(parts[1]) > 12 && parseInt(parts[0]) <= 12) {
            return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`;
          }
          // Already in YYYY-MM-DD format or ambiguous case
          else if (parts[0].length === 4) {
            return dateStr; // Already in YYYY-MM-DD format
          }
          // Default to MM/DD/YYYY interpretation
          else {
            return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`;
          }
        }
        return dateStr;
      };

      // Convert the import data to Course format
      const coursesToImport = validData.map((item) => {
        // Parse schedules from "1Mon, 2Fri" format to Schedule array
        const schedules = item.schedules.split(",").map((schedule: string) => {
          const trimmed = schedule.trim();
          const section = parseInt(trimmed.match(/^\d+/)?.[0] || "1");
          const day = trimmed.replace(/^\d+/, "");
          return { sections: section, schedule: day };
        });

        return {
          subject_id: 0, // This should be resolved by subject name lookup
          semester: item.semester,
          description: item.subject, // Using subject as description for now
          schedules: schedules,
          start_date: normalizeDate(item.start_date),
          end_date: normalizeDate(item.end_date),
          location: item.location,
          enrolled: 0,
          teacher_username: item.teacher,
        } as Course;
      });

      // Import each course
      for (const course of coursesToImport) {
        await subjectClassService.addSubjectClass(course);
      }

      toast.success(`Successfully imported ${coursesToImport.length} courses!`);
      setImportDialogOpen(false);
      setSelectedFile(null);
      loadCourses(); // Refresh the list
    } catch (error) {
      console.error("Error importing courses:", error);
      toast.error("Failed to import courses");
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportCancel = () => {
    setImportDialogOpen(false);
    setSelectedFile(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Toaster />
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              Course Management
            </h1>
            <p className="text-gray-600 mt-1">Manage and organize subject classes for the current semester</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:bg-gray-50"
              onClick={() => handleDownloadTemplate()}
            >
              <Download className="w-4 h-4" />
              Download Template
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 hover:bg-gray-50"
              onClick={() => handleImportCourse()}
            >
              <Upload className="w-4 h-4" />
              Import Courses
            </Button>

            <AddCourseDialog
              isOpen={addCourseDialogOpen}
              onOpenChange={setAddCourseDialogOpen}
              onCourseAdd={handleAddCourse}
              trigger={
                <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Add New Course
                </Button>
              }
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
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
          </>
        )}
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
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Grid className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <List className="h-4 w-4" />
            Table
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <GridItemSkeleton key={index} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="p-4 text-left">
                        <Skeleton className="h-4 w-4" />
                      </th>
                      <th className="p-4 text-left">
                        <Skeleton className="h-4 w-16" />
                      </th>
                      <th className="p-4 text-left">
                        <Skeleton className="h-4 w-16" />
                      </th>
                      <th className="p-4 text-left">
                        <Skeleton className="h-4 w-16" />
                      </th>
                      <th className="p-4 text-left">
                        <Skeleton className="h-4 w-16" />
                      </th>
                      <th className="p-4 text-left">
                        <Skeleton className="h-4 w-16" />
                      </th>
                      <th className="p-4 text-left">
                        <Skeleton className="h-4 w-16" />
                      </th>
                      <th className="p-4 text-left">
                        <Skeleton className="h-4 w-16" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TableRowSkeleton key={index} />
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <SubjectClassItem key={course.id} course={course} onUpdate={handleUpdateCourse} />
          ))}
        </div>
      ) : (
        <CourseTable subjectClasses={filteredCourses} onUpdate={handleUpdateCourse} onDelete={handleDeleteCourses} />
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

      {/* Import Dialog */}
      {selectedFile && (
        <PreviewImportCourse
          file={selectedFile}
          onConfirm={handleImportConfirm}
          onCancel={handleImportCancel}
          isLoading={isImporting}
          open={importDialogOpen}
        />
      )}
    </div>
  );
}
