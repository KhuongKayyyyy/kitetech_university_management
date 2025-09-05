"use client";

import React, { useEffect, useState } from "react";

import { FacultyModel } from "@/app/api/model/model";
import { departmentService } from "@/app/api/services/departmentService";
import { Button } from "@/components/ui/button";
import DepartmentItem from "@/components/ui/custom/education/department/DepartmentItem";
import { DepartmentTable } from "@/components/ui/custom/education/department/DepartmentTable";
import { NewDepartmentDialog } from "@/components/ui/custom/education/department/NewDepartmentDialog";
import { useDepartments } from "@/hooks/useDeparment";
import { Building, Download, Grid, List, Plus, Search, Trash2, Upload } from "lucide-react";
import { toast, Toaster } from "sonner";

import PreviewImportDepartment from "./PreviewImportDepartment";

const DepartmentPage = () => {
  const { departments, setDepartments, loading } = useDepartments();

  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024");

  const [openAddDepartment, setOpenAddDepartment] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [selectedImportFile, setSelectedImportFile] = useState<File | null>(null);

  const filteredDepartments = departments.filter(
    (department) =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (department.contact_info?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  );

  const handleAddDepartment = async (newDepartment: FacultyModel) => {
    setOpenAddDepartment(false);
    const data = await departmentService.addDepartment(newDepartment);
    toast.success("Department " + newDepartment.name + " created successfully");
    setDepartments([...departments, data]);
  };

  const handleDeleteDepartment = async (deletedId: string) => {
    try {
      await departmentService.deleteDepartment(parseInt(deletedId));
      setDepartments((prev) => prev.filter((dept) => dept.id !== parseInt(deletedId)));
      setSelectedDepartments((prev) => prev.filter((id) => id !== parseInt(deletedId)));
      toast.success("Department deleted successfully");
    } catch (error) {
      toast.error("Failed to delete department");
    }
  };

  const handleSelectDepartment = (departmentId: number) => {
    setSelectedDepartments((prev) => {
      if (prev.includes(departmentId)) {
        return prev.filter((id) => id !== departmentId);
      } else {
        return [...prev, departmentId];
      }
    });
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedDepartments.map((id) => departmentService.deleteDepartment(id)));
      setDepartments((prev) => prev.filter((dept) => !selectedDepartments.includes(dept.id)));
      setSelectedDepartments([]);
      toast.success(`${selectedDepartments.length} departments deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete selected departments");
    }
  };

  const handleClearSelection = () => {
    setSelectedDepartments([]);
  };

  const handleDownloadTemplateDepartment = async () => {
    try {
      const response = await departmentService.downloadDepartmentTemplate();
      const url = window.URL.createObjectURL(new Blob([response]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "department_template.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Failed to download template");
    }
  };

  const handleImportDepartment = async () => {
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
            localStorage.setItem("departmentImportFile", JSON.stringify(fileData));
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

  interface DepartmentImportData {
    id?: string;
    name: string;
    code: string;
    dean: string;
    contact_info: string;
    status: "valid" | "warning" | "error";
    errors?: string[];
    warnings?: string[];
    rowNumber: number;
  }

  const handleConfirmImport = async (validData: DepartmentImportData[]) => {
    try {
      setImportLoading(true);
      toast.info("Importing departments...");

      const fileDataStr = localStorage.getItem("departmentImportFile");
      if (!fileDataStr) {
        toast.error("No file found. Please select a file again.");
        return;
      }

      const fileData = JSON.parse(fileDataStr);

      const fetchResponse = await fetch(fileData.data);
      const blob = await fetchResponse.blob();
      const file = new File([blob], fileData.name, { type: fileData.type });

      const importResponse = await departmentService.importDepartment(file);

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
          toast.warning(`Imported ${successCount} departments successfully. ${errorCount} failed.`);
          // Show error details if needed
          if (errors && errors.length > 0) {
            const errorMessages = errors.map((error: any) => `Row ${error.row}: ${error.message}`).join("\n");
            console.warn("Import errors:", errorMessages);
          }
        } else {
          toast.success(`Successfully imported ${successCount} departments`);
        }

        // Refresh the departments list after successful import
        const updatedDepartments = await departmentService.getDepartments();
        setDepartments(updatedDepartments);
      } else {
        toast.error(message || "Failed to import departments");
      }

      setShowImportPreview(false);
      setSelectedImportFile(null);

      // Clear localStorage
      localStorage.removeItem("departmentImportFile");
    } catch (error) {
      console.error("Error importing departments:", error);
      toast.error("Failed to import departments");
    } finally {
      setImportLoading(false);
    }
  };

  const handleCancelImport = () => {
    setShowImportPreview(false);
    setSelectedImportFile(null);
    localStorage.removeItem("departmentImportFile");
  };

  return (
    <div className="px-6 bg-primary-foreground py-6 min-h-screen">
      <Toaster></Toaster>
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Department Management</h1>
          <p className="text-gray-600">Manage departments and their associated majors</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Year Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="year-picker" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Academic Year:
            </label>
            <select
              id="year-picker"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
            >
              <option value="2023">2023-2024</option>
              <option value="2024">2024-2025</option>
              <option value="2025">2025-2026</option>
              <option value="2026">2026-2027</option>
            </select>
          </div>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleDownloadTemplateDepartment()}
          >
            <Download className="w-4 h-4" />
            Download Template
          </Button>

          {/* Import Button */}
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleImportDepartment()}
            disabled={importLoading}
          >
            <Upload className="w-4 h-4" />
            {importLoading ? "Processing..." : "Import"}
          </Button>

          {/* Add Department Button */}
          <Button
            onClick={() => setOpenAddDepartment(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Department
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
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* View Toggle and Stats */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {filteredDepartments.length} of {departments.length} departments
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

      {/* Selection Actions - Only show in cards view when items are selected */}
      {viewMode === "cards" && selectedDepartments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {selectedDepartments.length} department{selectedDepartments.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleClearSelection} className="flex items-center gap-2">
                Clear Selection
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      {filteredDepartments.length === 0 ? (
        <div className="text-center py-12">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
          <p className="text-gray-600">Try adjusting your search criteria.</p>
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((department) => (
            <DepartmentItem
              key={department.id}
              department={department}
              onDelete={(id) => handleDeleteDepartment(id.toString())}
              isSelected={selectedDepartments.includes(department.id)}
              onSelect={() => handleSelectDepartment(department.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <DepartmentTable departments={filteredDepartments} />
        </div>
      )}

      <NewDepartmentDialog open={openAddDepartment} setOpen={setOpenAddDepartment} onAdd={handleAddDepartment} />

      {/* Import Preview Dialog */}
      {selectedImportFile && (
        <PreviewImportDepartment
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

export default DepartmentPage;
