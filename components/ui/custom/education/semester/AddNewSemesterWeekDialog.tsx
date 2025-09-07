import React, { useState } from "react";

import { SemesterModel } from "@/app/api/model/SemesterModel";
import { SemesterWeekModel } from "@/app/api/model/SemesterWeekModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar, CalendarDays, Save, X } from "lucide-react";
import { toast } from "sonner";

interface AddNewSemesterWeekDialogProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSemesterWeekAdd?: (semesterWeek: Omit<SemesterWeekModel, "id">) => Promise<void>;
  trigger?: React.ReactNode;
  semesters?: SemesterModel[];
  selectedSemester?: SemesterModel;
}

export default function AddNewSemesterWeekDialog({
  isOpen,
  onOpenChange,
  onSemesterWeekAdd,
  trigger,
  semesters = [],
  selectedSemester,
}: AddNewSemesterWeekDialogProps) {
  const [formData, setFormData] = useState<Omit<SemesterWeekModel, "id">>({
    week_number: 1,
    start_date: "",
    end_date: "",
    description: "",
    semester_id: selectedSemester?.id || 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof Omit<SemesterWeekModel, "id">, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.semester_id) {
      toast.error("Semester is required.");
      return;
    }

    if (!formData.week_number || formData.week_number < 1) {
      toast.error("Valid week number is required.");
      return;
    }

    if (!formData.start_date) {
      toast.error("Start date is required.");
      return;
    }

    if (!formData.end_date) {
      toast.error("End date is required.");
      return;
    }

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      toast.error("End date must be after start date.");
      return;
    }

    setIsSaving(true);
    try {
      await onSemesterWeekAdd?.(formData);

      // Reset form on success
      setFormData({
        week_number: 1,
        start_date: "",
        end_date: "",
        description: "",
        semester_id: selectedSemester?.id || 0,
      });

      onOpenChange?.(false);
      toast.success("Semester week created successfully!");
    } catch (error) {
      toast.error("Failed to create semester week. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      week_number: 1,
      start_date: "",
      end_date: "",
      description: "",
      semester_id: selectedSemester?.id || 0,
    });
    onOpenChange?.(false);
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    return format(new Date(dateString), "yyyy-MM-dd");
  };

  const getSemesterForDisplay = () => {
    return selectedSemester || semesters.find((semester) => semester.id === formData.semester_id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Add New Semester Week
          </DialogTitle>
          <DialogDescription>Create a new semester week with week number, dates, and description.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            {/* Semester */}
            {!selectedSemester ? (
              <div className="space-y-2">
                <Label htmlFor="semester_id">Semester *</Label>
                <Select
                  value={formData.semester_id?.toString() || ""}
                  onValueChange={(value: string) => handleInputChange("semester_id", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id.toString()}>
                        {semester.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Selected Semester</Label>
                <div className="p-3 bg-muted rounded-md">
                  <p className="font-medium">{selectedSemester.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedSemester.start_date), "MMM d, yyyy")} -{" "}
                    {format(new Date(selectedSemester.end_date), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            )}

            {/* Week Number */}
            <div className="space-y-2">
              <Label htmlFor="week_number">Week Number *</Label>
              <Input
                id="week_number"
                type="number"
                min="1"
                placeholder="e.g., 1, 2, 3..."
                value={formData.week_number}
                onChange={(e) => handleInputChange("week_number", parseInt(e.target.value) || 1)}
                required
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="start_date"
                    type="date"
                    value={formatDateForInput(formData.start_date || "")}
                    onChange={(e) => handleInputChange("start_date", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="end_date"
                    type="date"
                    value={formatDateForInput(formData.end_date || "")}
                    onChange={(e) => handleInputChange("end_date", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description for the week..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Preview Card */}
          {(formData.semester_id || formData.week_number || formData.start_date || formData.end_date) && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {getSemesterForDisplay() && (
                  <p className="text-sm text-muted-foreground">Semester: {getSemesterForDisplay()?.name}</p>
                )}
                {formData.week_number && <p className="font-semibold">Week {formData.week_number}</p>}
                {formData.start_date && formData.end_date && (
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(formData.start_date), "MMM d, yyyy")} -{" "}
                    {format(new Date(formData.end_date), "MMM d, yyyy")}
                  </p>
                )}
                {formData.description && <p className="text-sm text-muted-foreground">{formData.description}</p>}
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Creating..." : "Create Week"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
