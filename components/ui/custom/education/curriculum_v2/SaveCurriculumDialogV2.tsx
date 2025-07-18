"use client";

import React from "react";

import { CurriculumnSubjectModel } from "@/app/api/model/CurriculumnSubjectModel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SaveCurriculumDialogV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  curriculumInfo: any;
  boards: any[];
  subjects: { [key: string]: CurriculumnSubjectModel };
  onSave: () => void;
  onCancel: () => void;
}

export default function SaveCurriculumDialogV2({
  open,
  onOpenChange,
  curriculumInfo,
  boards,
  subjects,
  onSave,
  onCancel,
}: SaveCurriculumDialogV2Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Curriculum</DialogTitle>
          <DialogDescription>Confirm saving your curriculum changes.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
