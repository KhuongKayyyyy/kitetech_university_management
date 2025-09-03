"use client";

import React, { useEffect, useMemo, useState } from "react";

import { Student } from "@/app/api/model/StudentModel";
import { studentService } from "@/app/api/services/studentService";
import { Button } from "@/components/ui/button";
import AddStudentDialog from "@/components/ui/custom/user/student/AddStudentDialog";
import StudentItem from "@/components/ui/custom/user/student/StudentItem";
import StudentTable from "@/components/ui/custom/user/student/StudentTable";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { API_CONFIG } from "@/constants/api_config";
import { ChevronLeft, ChevronRight, Download, GraduationCap, Grid, List, Plus, Search, Upload } from "lucide-react";
import { toast, Toaster } from "sonner";

import PreviewImportStudent from "./PreviewImportStudent";

interface StudentImportData {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  birthDate: string;
  class: string;
  status: "valid" | "warning" | "error";
  errors?: string[];
  warnings?: string[];
  rowNumber: number;
}

export default function StudentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [importData, setImportData] = useState<StudentImportData[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [selectedImportFile, setSelectedImportFile] = useState<File | null>(null);
  const itemsPerPage = 9; // 3x4 grid for cards

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await studentService.getStudents();
        setStudents(data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) {
      return students;
    }

    const searchLower = searchTerm.toLowerCase();
    return students.filter(
      (student) =>
        student.full_name?.toLowerCase().includes(searchLower) ||
        student.email?.toLowerCase().includes(searchLower) ||
        student.phone?.toLowerCase().includes(searchLower) ||
        student.address?.toLowerCase().includes(searchLower) ||
        student.classes?.class_code?.toLowerCase().includes(searchLower),
    );
  }, [searchTerm, students]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDownloadTemplate = async () => {
    try {
      const downloadResponse = await fetch(API_CONFIG.DOWNLOAD_STUDENT_TEMPLATE);
      if (!downloadResponse.ok) {
        throw new Error("Failed to download template");
      }

      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "students_template.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Failed to download template");
    }
  };

  // Validation will be handled by PreviewImportStudent after parsing the file

  const handleImportStudent = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".xlsx,.xls,.csv";
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          setImportLoading(true);
          toast.info("Processing file...");

          // Save file to localStorage as base64
          const reader = new FileReader();
          reader.onload = () => {
            const fileData = {
              name: file.name,
              type: file.type,
              size: file.size,
              data: reader.result as string,
            };
            localStorage.setItem("studentImportFile", JSON.stringify(fileData));
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

  const handleConfirmImport = async (validData: StudentImportData[]) => {
    try {
      setImportLoading(true);
      toast.info("Importing students...");

      const fileDataStr = localStorage.getItem("studentImportFile");
      if (!fileDataStr) {
        toast.error("No file found. Please select a file again.");
        return;
      }

      const fileData = JSON.parse(fileDataStr);

      const fetchResponse = await fetch(fileData.data);
      const blob = await fetchResponse.blob();
      const file = new File([blob], fileData.name, { type: fileData.type });

      const importResponse = await studentService.importStudent(file);

      const { success, message, data } = importResponse;

      if (success) {
        const { successCount, errorCount, errors } = data;

        if (errorCount > 0) {
          toast.warning(`Imported ${successCount} students successfully. ${errorCount} failed.`);
          // Show error details if needed
          if (errors && errors.length > 0) {
            console.error("Import errors:", errors);
            // You could show a detailed error dialog here if needed
          }
        } else {
          toast.success(`Successfully imported ${successCount} students`);
        }

        // Refresh the students list after successful import
        await handleStudentAdded();
      } else {
        toast.error(message || "Failed to import students");
      }

      setShowImportPreview(false);
      setImportData([]);
      setSelectedImportFile(null);

      // Clear localStorage
      localStorage.removeItem("studentImportFile");
    } catch (error) {
      console.error("Error importing students:", error);
      toast.error("Failed to import students");
    } finally {
      setImportLoading(false);
    }
  };

  const handleCancelImport = () => {
    setShowImportPreview(false);
    setImportData([]);
    setSelectedImportFile(null);

    // Clear localStorage
    localStorage.removeItem("studentImportFile");
  };

  const handleStudentAdded = async () => {
    try {
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (error) {
      console.error("Failed to refresh students:", error);
    }
  };

  const importDialog = (
    <>
      {selectedImportFile && (
        <PreviewImportStudent
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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading students...</p>
          </div>
        </div>
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
              <GraduationCap className="w-6 h-6 text-primary" />
              Student Management
            </h1>
            <p className="text-gray-600 mt-1">Manage student profiles, enrollment, and academic information</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Download Import Template Button */}
            <Button variant="outline" className="flex items-center gap-2" onClick={() => handleDownloadTemplate()}>
              <Download className="w-4 h-4" />
              Download Template
            </Button>

            {/* Import Button */}
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleImportStudent()}
              disabled={importLoading}
            >
              <Upload className="w-4 h-4" />
              {importLoading ? "Processing..." : "Import"}
            </Button>

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
            <Button className="mt-4" variant="outline" onClick={() => setOpenAddStudentDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Student
            </Button>
          )}
        </div>
      ) : viewMode === "cards" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedStudents.map((student) => (
              <StudentItem key={student.id} student={student} onStudentUpdated={handleStudentAdded} />
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
          <StudentTable students={filteredStudents} onStudentUpdated={handleStudentAdded} />
        </div>
      )}
      <AddStudentDialog
        open={openAddStudentDialog}
        onClose={() => setOpenAddStudentDialog(false)}
        onStudentAdded={handleStudentAdded}
      />
    </div>
  );
}
