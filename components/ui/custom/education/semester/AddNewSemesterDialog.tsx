import React, { useState } from "react";

import { AcademicYearModel } from "@/app/api/model/AcademicYearModel";
import { SemesterModel } from "@/app/api/model/SemesterModel";
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
import { useAcademicYears } from "@/hooks/useAcademicYear";
import { format } from "date-fns";
import { Calendar, CalendarDays, Save, X } from "lucide-react";
import { toast } from "sonner";

interface AddNewSemesterDialogProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSemesterAdd?: (semester: Omit<SemesterModel, "id">) => Promise<void>;
  trigger?: React.ReactNode;
  academicYears?: AcademicYearModel[];
}

export default function AddNewSemesterDialog({
  isOpen,
  onOpenChange,
  onSemesterAdd,
  trigger,
}: AddNewSemesterDialogProps) {
  const { academicYears } = useAcademicYears();
  const [formData, setFormData] = useState<Omit<SemesterModel, "id">>({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "Active",
    academic_year_id: 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof Omit<SemesterModel, "id">, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Semester name is required.");
      return;
    }

    if (!formData.academic_year_id) {
      toast.error("Academic year is required.");
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
      await onSemesterAdd?.(formData);

      // Reset form on success
      setFormData({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "Active",
        academic_year_id: 0,
      });

      onOpenChange?.(false);
      toast.success("Semester created successfully!");
    } catch (error) {
      toast.error("Failed to create semester. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      status: "Active",
      academic_year_id: 0,
    });
    onOpenChange?.(false);
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    return format(new Date(dateString), "yyyy-MM-dd");
  };
  const getSelectedAcademicYear = () => {
    return academicYears.find((year) => year.id === formData.academic_year_id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Add New Semester
          </DialogTitle>
          <DialogDescription>
            Create a new semester with start and end dates, status, and description.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            {/* Academic Year */}
            <div className="space-y-2">
              <Label htmlFor="academic_year_id">Academic Year *</Label>
              <Select
                value={formData.academic_year_id.toString()}
                onValueChange={(value: string) => handleInputChange("academic_year_id", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id.toString()}>
                      {year.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Semester Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Semester Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Fall 2024, Spring 2025"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
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
                    value={formatDateForInput(formData.start_date)}
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
                    value={formatDateForInput(formData.end_date)}
                    onChange={(e) => handleInputChange("end_date", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: SemesterModel["status"]) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="ExamPeriod">Exam Period</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description for the semester..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Preview Card */}
          {(formData.name || formData.start_date || formData.end_date || formData.academic_year_id) && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {getSelectedAcademicYear() && (
                  <p className="text-sm text-muted-foreground">Academic Year: {getSelectedAcademicYear()?.year}</p>
                )}
                {formData.name && <p className="font-semibold">{formData.name}</p>}
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
              {isSaving ? "Creating..." : "Create Semester"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
