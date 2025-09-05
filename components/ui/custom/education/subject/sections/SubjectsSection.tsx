"use client";

import React, { useMemo, useState } from "react";

import PreviewImportSubject from "@/app/(root)/admin/education/subject/PreviewImportSubject";
import { SubjectModel } from "@/app/api/model/model";
import { subjectService } from "@/app/api/services/subjectService";
import { Button } from "@/components/ui/button";
import { AddSubjectDialog } from "@/components/ui/custom/education/subject/AddSubjectDialog";
import SubjectItem from "@/components/ui/custom/education/subject/SubjectItem";
import { SubjectTable } from "@/components/ui/custom/education/subject/SubjectTable";
import { useDepartments } from "@/hooks/useDeparment";
import { useSubjects } from "@/hooks/useSubject";
import { BookOpen, Download, Grid, List, Plus, Search, Upload } from "lucide-react";
import { toast } from "sonner";

// Skeleton Components
const SubjectCardSkeleton = () => (
  <div className="p-4 border border-gray-200 rounded-lg animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
  </div>
);

const SubjectTableSkeleton = () => (
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

const SubjectsSectionSkeleton = () => (
  <>
    {/* Header Skeleton */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
    </div>

    {/* Search and Filter Skeleton */}
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="flex items-center border border-gray-300 rounded-lg p-1">
          <div className="h-8 bg-gray-200 rounded w-8 mr-1 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
        </div>
      </div>
      <div className="mt-3 h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
    </div>

    {/* Content Skeleton */}
    <div className="space-y-8">
      {[...Array(2)].map((_, deptIndex) => (
        <div key={deptIndex} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-1 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, subjectIndex) => (
              <SubjectCardSkeleton key={subjectIndex} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </>
);

export default function SubjectsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [openAddSubjectDialog, setOpenAddSubjectDialog] = useState(false);
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [selectedImportFile, setSelectedImportFile] = useState<File | null>(null);

  const { departments } = useDepartments();
  const { subjects, loading, error, addSubject, updateSubject, deleteSubjects } = useSubjects();

  // Handle adding a new subject
  const handleAddSubject = async (subjectData: Omit<SubjectModel, "id">) => {
    try {
      console.log("Handling add subject:", subjectData);
      await addSubject(subjectData);
      toast.success("Subject added successfully!");
    } catch (error) {
      console.error("Failed to add subject:", error);
      toast.error("Failed to add subject. Please try again.");
      throw error; // Re-throw to let the dialog handle it
    }
  };

  // Handle updating a subject
  const handleUpdateSubject = async (updatedSubject: SubjectModel) => {
    try {
      console.log("Handling update subject:", updatedSubject);
      await updateSubject(updatedSubject);
      toast.success("Subject " + updatedSubject.name + " updated successfully!");
    } catch (error) {
      console.error("Failed to update subject:", error);
      toast.error("Failed to update subject. Please try again.");
      throw error; // Re-throw to let the dialog handle it
    }
  };

  // Handle deleting subjects
  const handleDeleteSubjects = async (subjectIds: string[]) => {
    try {
      console.log("Handling delete subjects:", subjectIds);
      await deleteSubjects(subjectIds);
      toast.success(`${subjectIds.length} subject${subjectIds.length > 1 ? "s" : ""} deleted successfully!`);
    } catch (error) {
      console.error("Failed to delete subjects:", error);
      toast.error("Failed to delete subjects. Please try again.");
      throw error; // Re-throw to let the dialog handle it
    }
  };

  // Create department map for quick lookup
  const departmentMap = useMemo(() => {
    const map = new Map();
    departments.forEach((department) => {
      map.set(department.id, department);
    });
    return map;
  }, [departments]);

  // Filter subjects based on search and filters
  const filteredSubjects = useMemo(() => {
    if (!subjects || !Array.isArray(subjects)) return [];

    return subjects.filter((subject) => {
      const department = departmentMap.get(subject.faculty_id);
      if (!department) return false;

      const matchesSearch =
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (subject.description ?? "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = selectedDepartment === "all" || department.name === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  }, [subjects, searchTerm, selectedDepartment, departmentMap]);

  // Group filtered subjects by department
  const groupedSubjects = useMemo(() => {
    if (!filteredSubjects || !Array.isArray(filteredSubjects)) return {};

    const grouped: { [departmentName: string]: SubjectModel[] } = {};
    filteredSubjects.forEach((subject) => {
      const department = departmentMap.get(subject.faculty_id);
      if (!department) return;

      const departmentName = department.name;
      if (!grouped[departmentName]) {
        grouped[departmentName] = [];
      }
      grouped[departmentName].push(subject);
    });
    return grouped;
  }, [filteredSubjects, departmentMap]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("all");
  };

  const handleDownloadTemplateSubject = async () => {
    try {
      const response = await subjectService.downloadSubjectTemplate();
      const url = window.URL.createObjectURL(new Blob([response]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "subject_template.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Failed to download template");
    }
  };

  const handleImportSubject = async () => {
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
            localStorage.setItem("subjectImportFile", JSON.stringify(fileData));
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

  interface SubjectImportData {
    id?: string;
    name: string;
    credits: string;
    description: string;
    faculty: string;
    grading_formula: string;
    status: "valid" | "warning" | "error";
    errors?: string[];
    warnings?: string[];
    rowNumber: number;
  }

  const handleConfirmImport = async (validData: SubjectImportData[]) => {
    try {
      setImportLoading(true);
      toast.info("Importing subjects...");

      const fileDataStr = localStorage.getItem("subjectImportFile");
      if (!fileDataStr) {
        toast.error("No file found. Please select a file again.");
        return;
      }

      const fileData = JSON.parse(fileDataStr);

      const fetchResponse = await fetch(fileData.data);
      const blob = await fetchResponse.blob();
      const file = new File([blob], fileData.name, { type: fileData.type });

      const importResponse = await subjectService.importSubject(file);

      console.log("Import response:", importResponse);

      // Handle the response structure - the API response should have the correct format
      const responseData = importResponse;

      // Check if response has the expected structure
      if (!responseData || typeof responseData !== "object") {
        console.error("Invalid response structure:", responseData);
        toast.error("Invalid response from server");
        return;
      }

      const { success, message, data } = responseData;

      if (success) {
        if (!data || typeof data !== "object") {
          console.error("Invalid data structure:", data);
          toast.error("Invalid data structure from server");
          return;
        }

        const { successCount, errorCount, errors } = data;

        if (errorCount > 0) {
          toast.warning(`Imported ${successCount} subjects successfully. ${errorCount} failed.`);
          // Show error details if needed
          if (errors && errors.length > 0) {
            const errorMessages = errors.map((error: any) => `Row ${error.row}: ${error.message}`).join("\n");
            console.warn("Import errors:", errorMessages);
          }
        } else {
          toast.success(`Successfully imported ${successCount} subjects`);
        }

        // Refresh the subjects list after successful import
        window.location.reload(); // Simple refresh for now
      } else {
        toast.error(message || "Failed to import subjects");
      }

      setShowImportPreview(false);
      setSelectedImportFile(null);

      // Clear localStorage
      localStorage.removeItem("subjectImportFile");
    } catch (error) {
      console.error("Error importing subjects:", error);
      toast.error("Failed to import subjects");
    } finally {
      setImportLoading(false);
    }
  };

  const handleCancelImport = () => {
    setShowImportPreview(false);
    setSelectedImportFile(null);
    localStorage.removeItem("subjectImportFile");
  };

  if (loading) {
    return <SubjectsSectionSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading subjects: {error.message}</p>
      </div>
    );
  }

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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => handleDownloadTemplateSubject()}>
            <Download className="w-4 h-4" />
            Download Template
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleImportSubject()}
            disabled={importLoading}
          >
            <Upload className="w-4 h-4" />
            {importLoading ? "Processing..." : "Import"}
          </Button>

          <Button
            onClick={() => setOpenAddSubjectDialog(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Subject
          </Button>
        </div>
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
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
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
          {(searchTerm || selectedDepartment !== "all") && (
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
          Showing {filteredSubjects.length} of {subjects?.length || 0} subjects
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
            Object.entries(groupedSubjects).map(([departmentName, subjectList]) => {
              return (
                <div key={departmentName} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{departmentName}</h2>
                    <p className="text-sm text-gray-600">{subjectList.length} subjects</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjectList.map((subject) => {
                      const department = departmentMap.get(subject.faculty_id);
                      return (
                        <SubjectItem
                          key={subject.id}
                          subject={subject}
                          department={department}
                          onUpdate={handleUpdateSubject}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <SubjectTable subjects={filteredSubjects} onUpdate={handleUpdateSubject} onDelete={handleDeleteSubjects} />
      )}

      {/* Add Subject Dialog */}
      <AddSubjectDialog open={openAddSubjectDialog} setOpen={setOpenAddSubjectDialog} onSubmit={handleAddSubject} />

      {/* Import Preview Dialog */}
      {selectedImportFile && (
        <PreviewImportSubject
          open={showImportPreview}
          file={selectedImportFile}
          onConfirm={handleConfirmImport}
          onCancel={handleCancelImport}
          isLoading={importLoading}
        />
      )}
    </>
  );
}
