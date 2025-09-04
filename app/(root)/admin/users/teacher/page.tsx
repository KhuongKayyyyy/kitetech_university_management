"use client";

import React, { useEffect, useMemo, useState } from "react";

import { Teacher } from "@/app/api/model/TeacherModel";
import { teacherService } from "@/app/api/services/teacherService";
import { Button } from "@/components/ui/button";
import CreateNewTeacherDialog from "@/components/ui/custom/user/teacher/CreateNewTeacherDialog";
import TeacherItem from "@/components/ui/custom/user/teacher/TeacherItem";
import TeacherTable from "@/components/ui/custom/user/teacher/TeacherTable";
import { Skeleton } from "@/components/ui/skeleton";
import { API_CONFIG } from "@/constants/api_config";
import { ChevronLeft, ChevronRight, Download, Grid, List, Plus, Search, Upload, Users } from "lucide-react";
import { toast, Toaster } from "sonner";

import PreviewImportTeacher from "./PreviewImportTeacher";

export default function TeacherPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [openAddTeacherDialog, setOpenAddTeacherDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 3x3 grid for cards
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [selectedImportFile, setSelectedImportFile] = useState<File | null>(null);

  // Fetch teachers data
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const teachersData = await teacherService.getTeachers();
        setTeachers(teachersData);
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Filter teachers based on search term
  const filteredTeachers = useMemo(() => {
    if (!searchTerm.trim()) {
      return teachers;
    }

    const searchLower = searchTerm.toLowerCase();
    return teachers.filter(
      (teacher: Teacher) =>
        teacher.full_name?.toLowerCase().includes(searchLower) ||
        teacher.email?.toLowerCase().includes(searchLower) ||
        teacher.phone?.toLowerCase().includes(searchLower),
    );
  }, [searchTerm, teachers]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTeachers = filteredTeachers.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle teacher creation
  const handleTeacherCreated = async () => {
    try {
      setLoading(true);
      const teachersData = await teacherService.getTeachers();
      setTeachers(teachersData);
    } catch (error) {
      console.error("Failed to refresh teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplateTeacher = async () => {
    try {
      const downloadResponse = await fetch(API_CONFIG.DOWNLOAD_TEACHER_TEMPLATE);
      if (!downloadResponse.ok) {
        throw new Error("Failed to download template");
      }
      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "teachers_template.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Failed to download template");
    }
  };

  const handleImportTeacher = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".xlsx,.xls,.csv";
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          setImportLoading(true);
          toast.info("Processing file...");

          const reader = new FileReader();
          reader.onload = () => {
            const fileData = {
              name: file.name,
              type: file.type,
              size: file.size,
              data: reader.result as string,
            };
            localStorage.setItem("teacherImportFile", JSON.stringify(fileData));
            setSelectedImportFile(file);
            setShowImportPreview(true);
            toast.success("File processed successfully");
          };
          reader.readAsDataURL(file);
        } catch (error) {
          console.error("Error processing file:", error);
          toast.error("Failed to process file");
        } finally {
          setImportLoading(false);
        }
      }
    };
    fileInput.click();
  };

  interface TeacherImportData {
    id?: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    birthDate: string;
    qualification: string;
    department: string;
    faculty: string;
    status: "valid" | "warning" | "error";
    errors?: string[];
    warnings?: string[];
    rowNumber: number;
  }

  const handleConfirmImport = async (_validData: TeacherImportData[]) => {
    try {
      setImportLoading(true);
      toast.info("Importing teachers...");

      const fileDataStr = localStorage.getItem("teacherImportFile");
      if (!fileDataStr) {
        toast.error("No file found. Please select a file again.");
        return;
      }

      const fileData = JSON.parse(fileDataStr);

      const fetchResponse = await fetch(fileData.data);
      const blob = await fetchResponse.blob();
      const file = new File([blob], fileData.name, { type: fileData.type });

      const importResponse = await teacherService.importTeacher(file);

      const { success, message, data } = importResponse;

      if (success) {
        const { successCount, errorCount, errors } = data;

        if (errorCount > 0) {
          toast.warning(`Imported ${successCount} teachers successfully. ${errorCount} failed.`);
          // Show error details if needed
          if (errors && errors.length > 0) {
            const errorMessages = errors.map((error: any) => `Row ${error.row}: ${error.message}`).join("\n");
            console.warn("Import errors:", errorMessages);
          }
        } else {
          toast.success(`Successfully imported ${successCount} teachers`);
        }

        // Refresh the teachers list after successful import
        await handleTeacherCreated();
      } else {
        toast.error(message || "Failed to import teachers");
      }

      setShowImportPreview(false);
      setSelectedImportFile(null);

      // Clear localStorage
      localStorage.removeItem("teacherImportFile");
    } catch (error) {
      console.error("Error importing teachers:", error);
      toast.error("Failed to import teachers");
    } finally {
      setImportLoading(false);
    }
  };

  const handleCancelImport = () => {
    setShowImportPreview(false);
    setSelectedImportFile(null);
    localStorage.removeItem("teacherImportFile");
  };

  const importDialog = (
    <>
      {selectedImportFile && (
        <PreviewImportTeacher
          open={showImportPreview}
          file={selectedImportFile}
          onConfirm={handleConfirmImport}
          onCancel={handleCancelImport}
          isLoading={importLoading}
        />
      )}
    </>
  );

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section Skeleton */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Controls Section Skeleton */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <Skeleton className="h-10 w-64" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>

        {/* Content Section Skeleton */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 grid grid-cols-4 gap-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {importDialog}
      <Toaster />
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Teacher Management
            </h1>
            <p className="text-gray-600 mt-1">Manage teacher profiles, departments, and academic information</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => handleDownloadTemplateTeacher()}>
            <Download className="w-4 h-4" />
            Download Template
          </Button>

          {/* Import Button */}
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleImportTeacher()}
            disabled={importLoading}
          >
            <Upload className="w-4 h-4" />
            {importLoading ? "Processing..." : "Import"}
          </Button>

          {/* Add Teacher Button */}
          <Button
            onClick={() => setOpenAddTeacherDialog(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Teacher
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
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* View Toggle and Stats */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {filteredTeachers.length} of {teachers.length} teachers
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
      {filteredTeachers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No teachers found</h3>
          <p className="text-gray-600">
            {searchTerm ? "Try adjusting your search criteria." : "Get started by adding your first teacher."}
          </p>
          {!searchTerm && (
            <Button className="mt-4" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add First Teacher
            </Button>
          )}
        </div>
      ) : viewMode === "cards" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTeachers.map((teacher: Teacher) => (
              <TeacherItem key={teacher.id} teacher={teacher} />
            ))}
          </div>

          {/* Pagination for Cards */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredTeachers.length)} of {filteredTeachers.length}{" "}
                teachers
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
          <TeacherTable teachers={filteredTeachers} />
        </div>
      )}

      {/* Create Teacher Dialog */}
      <CreateNewTeacherDialog
        isOpen={openAddTeacherDialog}
        setIsOpen={setOpenAddTeacherDialog}
        onTeacherCreated={handleTeacherCreated}
      />
    </div>
  );
}
