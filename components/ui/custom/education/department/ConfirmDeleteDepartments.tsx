import React from "react";

import { FacultyModel } from "@/app/api/model/model";
import { departmentService } from "@/app/api/services/departmentService";
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
import { AlertTriangle, TrashIcon } from "lucide-react";
import { toast } from "sonner";

interface ConfirmDeleteDepartmentsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: FacultyModel[];
  onDeleteSuccess: (deleted: FacultyModel[]) => void;
}

export default function ConfirmDeleteDepartments({
  open,
  onOpenChange,
  departments,
  onDeleteSuccess,
}: ConfirmDeleteDepartmentsProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await Promise.all(departments.map((department) => departmentService.deleteDepartment(department.id)));
      toast.success(`${departments.length} department${departments.length > 1 ? "s" : ""} deleted successfully`);
      onDeleteSuccess(departments);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete departments");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-left">Delete Departments</DialogTitle>
              <DialogDescription className="text-left">
                Are you sure you want to delete the following department{departments.length > 1 ? "s" : ""}? This action
                cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="my-4 max-h-48 overflow-y-auto">
          <div className="space-y-2">
            {departments.map((department) => (
              <div key={department.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div>
                  <div className="font-medium">{department.name}</div>
                  {department.contact_info && (
                    <div className="text-sm text-muted-foreground line-clamp-1">{department.contact_info}</div>
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  ID: {department.id}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="w-full sm:w-auto">
            {isDeleting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete {departments.length} Department{departments.length > 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
