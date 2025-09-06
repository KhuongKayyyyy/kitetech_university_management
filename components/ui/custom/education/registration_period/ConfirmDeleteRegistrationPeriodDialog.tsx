"use client";

import React from "react";

import { RegistrationPeriod } from "@/app/api/model/RegistrationPeriodModel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ConfirmDeleteRegistrationPeriodDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  registrationPeriod: RegistrationPeriod | null;
  isDeleting?: boolean;
}

export default function ConfirmDeleteRegistrationPeriodDialog({
  open,
  onClose,
  onConfirm,
  registrationPeriod,
  isDeleting = false,
}: ConfirmDeleteRegistrationPeriodDialogProps) {
  if (!registrationPeriod) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Delete Registration Period
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this registration period? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="font-medium text-gray-900">{registrationPeriod.description}</div>
            <div className="text-sm text-gray-600">
              <div>Semester ID: {registrationPeriod.semester_id}</div>
              <div>Start Date: {new Date(registrationPeriod.start_date).toLocaleDateString()}</div>
              <div>End Date: {new Date(registrationPeriod.end_date).toLocaleDateString()}</div>
              <div>Status: {registrationPeriod.status}</div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete Registration Period"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
