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
import { AlertTriangle, TrashIcon } from "lucide-react";

interface ConfirmDeleteCoursesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  courseCount: number;
  courseNames: string[];
  isLoading?: boolean;
}

export function ConfirmDeleteCoursesDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  courseCount,
  courseNames,
  isLoading = false,
}: ConfirmDeleteCoursesDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">Delete Selected Courses</DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                This action cannot be undone. The selected courses will be permanently removed from the registration
                period.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <TrashIcon className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-red-900 mb-2">
                  Are you sure you want to delete {courseCount} course{courseCount > 1 ? "s" : ""}?
                </h4>
                <div className="space-y-1">
                  <p className="text-sm text-red-700 font-medium">Selected courses:</p>
                  <div className="max-h-32 overflow-y-auto">
                    <ul className="text-sm text-red-600 space-y-1">
                      {courseNames.map((name, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0"></span>
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading} className="flex-1 sm:flex-none">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete {courseCount} Course{courseCount > 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
