"use client";

import React, { useEffect, useMemo, useState } from "react";

import { ClassModel } from "@/app/api/model/ClassModel";
import { classService } from "@/app/api/services/classService";
import { Button } from "@/components/ui/button";
import AddClassDialog from "@/components/ui/custom/education/class/AddClassDialog";
import ClassItem from "@/components/ui/custom/education/class/ClassItem";
import { ClassTable } from "@/components/ui/custom/education/class/ClassTable";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ChevronLeft, ChevronRight, Download, Grid, List, Plus, Search, Upload } from "lucide-react";
import { toast } from "sonner";

import PreviewImportClass from "./PreviewImportClass";

const page = () => {
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9); // Default 3x3 grid for cards
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [selectedImportFile, setSelectedImportFile] = useState<File | null>(null);

  // Fetch classes from service
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const classesData = await classService.getClasses();
        setClasses(classesData);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const filteredClasses = useMemo(() => {
    if (!searchQuery) return classes;

    return classes.filter(
      (classItem) =>
        classItem.class_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classItem.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [classes, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClasses = filteredClasses.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes or items per page changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage]);

  const handleAddClass = () => {
    setOpen(true);
  };

  const handleClassAdded = async (newClass: ClassModel) => {
    // Refresh the classes list
    try {
      setLoading(true);
      const classesData = await classService.getClasses();
      setClasses(classesData);
      // Reset to first page when new item is added
      setCurrentPage(1);
    } catch (error) {
      console.error("Error refreshing classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
  };

  const handleDownloadTemplateClass = async () => {
    try {
      const response = await classService.downloadClassTemplate();
      const url = window.URL.createObjectURL(new Blob([response]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "classes_template.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Failed to download template");
    }
  };

  const handleImportClass = async () => {
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
            localStorage.setItem("classImportFile", JSON.stringify(fileData));
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

  interface ClassImportData {
    id?: string;
    description: string;
    major: string;
    status: "valid" | "warning" | "error";
    errors?: string[];
    warnings?: string[];
    rowNumber: number;
  }

  const handleConfirmImport = async (validData: ClassImportData[]) => {
    try {
      setImportLoading(true);
      toast.info("Importing classes...");

      const fileDataStr = localStorage.getItem("classImportFile");
      if (!fileDataStr) {
        toast.error("No file found. Please select a file again.");
        return;
      }

      const fileData = JSON.parse(fileDataStr);

      const fetchResponse = await fetch(fileData.data);
      const blob = await fetchResponse.blob();
      const file = new File([blob], fileData.name, { type: fileData.type });

      const importResponse = await classService.importClass(file);

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
          toast.warning(`Imported ${successCount} classes successfully. ${errorCount} failed.`);
          // Show error details if needed
          if (errors && errors.length > 0) {
            const errorMessages = errors.map((error: any) => `Row ${error.row}: ${error.message}`).join("\n");
            console.warn("Import errors:", errorMessages);
          }
        } else {
          toast.success(`Successfully imported ${successCount} classes`);
        }

        // Refresh the classes list after successful import
        try {
          setLoading(true);
          const classesData = await classService.getClasses();
          setClasses(classesData);
          setCurrentPage(1);
        } catch (error) {
          console.error("Error refreshing classes:", error);
        } finally {
          setLoading(false);
        }
      } else {
        toast.error(message || "Failed to import classes");
      }

      setShowImportPreview(false);
      setSelectedImportFile(null);

      // Clear localStorage
      localStorage.removeItem("classImportFile");
    } catch (error) {
      console.error("Error importing classes:", error);
      toast.error("Failed to import classes");
    } finally {
      setImportLoading(false);
    }
  };

  const handleCancelImport = () => {
    setShowImportPreview(false);
    setSelectedImportFile(null);
    localStorage.removeItem("classImportFile");
  };

  //   add class dialog
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="px-6 bg-primary-foreground py-6 min-h-screen">
        {/* Header Section Skeleton */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Controls Section Skeleton */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <Skeleton className="h-10 w-80" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>

        {/* Content Section Skeleton */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 bg-white rounded-xl border border-gray-200">
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 py-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3">
          <Skeleton className="h-5 w-48" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 bg-primary-foreground py-6 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Class Management</h1>
          <p className="text-gray-600">Manage classes and their academic information</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Add Class Button */}

          <Button variant="outline" className="flex items-center gap-2" onClick={() => handleDownloadTemplateClass()}>
            <Download className="w-4 h-4" />
            Download Template
          </Button>

          {/* Import Button */}
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleImportClass()}
            disabled={importLoading}
          >
            <Upload className="w-4 h-4" />
            {importLoading ? "Processing..." : "Import"}
          </Button>
          <Button onClick={handleAddClass} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Add Class
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
              placeholder="Search classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* View Toggle, Items Per Page, and Stats */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {filteredClasses.length} of {classes.length} classes
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
      {filteredClasses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
          <p className="text-gray-600">Try adjusting your search criteria.</p>
        </div>
      ) : viewMode === "cards" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {paginatedClasses.map((mockClass) => (
              <ClassItem key={mockClass.id} classData={mockClass} />
            ))}
          </div>

          {/* Pagination for Cards */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredClasses.length)} of {filteredClasses.length}{" "}
                  classes
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Items Per Page Selector */}
                <div className="flex items-center gap-2">
                  <label htmlFor="items-per-page" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Show:
                  </label>
                  <select
                    id="items-per-page"
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                  >
                    <option value="6">6</option>
                    <option value="9">9</option>
                    <option value="12">12</option>
                    <option value="18">18</option>
                    <option value="24">24</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="h-8 px-3"
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
                        onClick={() => handlePageChange(page)}
                        className="h-8 w-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="h-8 px-3"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-5 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <ClassTable classes={filteredClasses} />
        </div>
      )}

      <AddClassDialog open={open} setOpen={setOpen} onAddClass={handleClassAdded} />

      {/* Import Preview Dialog */}
      {selectedImportFile && (
        <PreviewImportClass
          open={showImportPreview}
          file={selectedImportFile}
          onConfirm={handleConfirmImport}
          onCancel={handleCancelImport}
          isLoading={importLoading}
        />
      )}
    </div>
  );
};

export default page;
