import React from "react";

import { MajorModel } from "@/app/api/model/model";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface ConfirmDeleteMajorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  majors: MajorModel[];
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteMajorDialog({
  open,
  onOpenChange,
  majors,
  onConfirm,
  onCancel,
}: ConfirmDeleteMajorDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirm Delete
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Are you sure you want to delete the following major{majors.length > 1 ? "s" : ""}? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="max-h-48 overflow-y-auto space-y-2 bg-gray-50 rounded-md p-3">
            {majors.map((major) => (
              <div key={major.id} className="text-sm font-medium text-gray-800 bg-white px-3 py-2 rounded border">
                {major.name}
                {major.faculty && <span className="text-gray-500 text-xs block">Department: {major.faculty.name}</span>}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel} className="border-gray-300 hover:bg-gray-50">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} className="bg-red-600 hover:bg-red-700 text-white">
            Delete {majors.length > 1 ? `${majors.length} Majors` : "Major"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
