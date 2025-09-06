"use client";

import React from "react";

import { ClassModel } from "@/app/api/model/ClassModel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, GraduationCap } from "lucide-react";

interface ConfirmRemoveClassDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  classItem: ClassModel | null;
  isRemoving?: boolean;
}

export default function ConfirmRemoveClassDialog({
  open,
  onClose,
  onConfirm,
  classItem,
  isRemoving = false,
}: ConfirmRemoveClassDialogProps) {
  if (!classItem) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Remove Class from Registration Period
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this class from the registration period? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <GraduationCap className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{classItem.class_code || "N/A"}</h3>
                <p className="text-sm text-gray-600">Class ID: {classItem.id}</p>
              </div>
            </div>
            {classItem.description && <p className="text-sm text-gray-700 mt-2">{classItem.description}</p>}
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">
                <strong>Warning:</strong> Students who have registered for this class will be affected by this removal.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isRemoving}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isRemoving}
            className="bg-red-600 hover:bg-red-700"
          >
            {isRemoving ? "Removing..." : "Remove Class"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
