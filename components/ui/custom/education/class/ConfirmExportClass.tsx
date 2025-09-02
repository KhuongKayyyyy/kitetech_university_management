"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, FileSpreadsheet } from "lucide-react";

interface ConfirmExportClassProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  exportCount?: number;
  exportType?: "all" | "filtered" | "selected";
}

export default function ConfirmExportClass({
  open,
  setOpen,
  onConfirm,
  exportCount = 0,
  exportType = "all",
}: ConfirmExportClassProps) {
  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  const getExportMessage = () => {
    switch (exportType) {
      case "selected":
        return `Export ${exportCount} selected class${exportCount !== 1 ? "es" : ""} to Excel?`;
      case "filtered":
        return `Export ${exportCount} filtered class${exportCount !== 1 ? "es" : ""} to Excel?`;
      default:
        return `Export all ${exportCount} class${exportCount !== 1 ? "es" : ""} to Excel?`;
    }
  };

  const getExportDescription = () => {
    switch (exportType) {
      case "selected":
        return "This will export only the classes you have selected to an Excel file.";
      case "filtered":
        return "This will export only the classes that match your current filters to an Excel file.";
      default:
        return "This will export all classes in the system to an Excel file.";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            Confirm Export
          </DialogTitle>
          <DialogDescription>{getExportMessage()}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Download className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Export Details</p>
              <p className="text-xs text-blue-700 mt-1">{getExportDescription()}</p>
              <p className="text-xs text-blue-600 mt-2">
                The file will include class codes, descriptions, majors, academic years, and faculty information.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
