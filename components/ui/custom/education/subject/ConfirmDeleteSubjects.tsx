import React from "react";

import { SubjectModel } from "@/app/api/model/model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getMajorNameById } from "@/lib/utils";
import { AlertTriangle, BookOpen, TrashIcon } from "lucide-react";

interface ConfirmDeleteSubjectsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjects: SubjectModel[];
  onConfirm: () => void;
}

export default function ConfirmDeleteSubjects({ open, onOpenChange, subjects, onConfirm }: ConfirmDeleteSubjectsProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = () => {
    setIsDeleting(true);
    try {
      onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (!isDeleting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-left">Delete Subjects</DialogTitle>
              <DialogDescription className="text-left">
                Are you sure you want to delete the following {subjects.length} subject{subjects.length > 1 ? "s" : ""}?
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Warning Message */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrashIcon className="h-4 w-4 text-destructive" />
              <p className="text-destructive font-semibold text-sm">Warning</p>
            </div>
            <p className="text-destructive/80 text-sm">
              This will permanently delete the selected subjects and all related data. Students enrolled in these
              subjects may be affected.
            </p>
          </div>

          {/* Subjects List */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Subjects to be deleted:</h4>
            <div className="max-h-48 overflow-y-auto border rounded-lg p-3 bg-gray-50">
              <div className="space-y-3">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-100 border border-blue-200">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900 truncate">{subject.name}</h5>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {getMajorNameById(subject.faculty_id.toString())}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {subject.credits} credit{subject.credits !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 font-mono">ID: {subject.id}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isDeleting} className="min-w-[120px]">
            {isDeleting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent text-white" />
                Deleting...
              </>
            ) : (
              <>
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete {subjects.length} Subject{subjects.length > 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
