"use client";

import React, { useState } from "react";

import { RegistrationPeriod } from "@/app/api/model/RegistrationPeriodModel";
import { MOCK_SEMESTERS } from "@/app/api/model/SemesterModel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RegisPeriodStatus } from "@/constants/enum/RegisPeriodStatus";
import { CalendarDays, Clock, FileText, Hash } from "lucide-react";

interface AddRegistrationPeriodProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddRegistrationPeriod: (registrationPeriod: RegistrationPeriod) => void;
}

export default function AddRegistrationPeriodDialog({
  open,
  setOpen,
  onAddRegistrationPeriod,
}: AddRegistrationPeriodProps) {
  const [formData, setFormData] = useState({
    semesterId: "",
    startDate: "",
    endDate: "",
    status: RegisPeriodStatus.Open,
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.semesterId) {
      newErrors.semesterId = "Semester ID is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newRegistrationPeriod: RegistrationPeriod = {
        id: 0,
        semesterId: parseInt(formData.semesterId),
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        description: formData.description || undefined,
      };

      onAddRegistrationPeriod(newRegistrationPeriod);
      handleClose();
    } catch (error) {
      console.error("Error adding registration period:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      semesterId: "",
      startDate: "",
      endDate: "",
      status: RegisPeriodStatus.Open,
      description: "",
    });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Add New Registration Period
          </DialogTitle>
          <DialogDescription>
            Create a new registration period for student enrollment. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            {/* Semester ID */}
            <div className="space-y-2">
              <Label htmlFor="semesterId" className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Semester *
              </Label>
              <Select value={formData.semesterId} onValueChange={(value) => handleInputChange("semesterId", value)}>
                <SelectTrigger className={errors.semesterId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_SEMESTERS.map((semester) => (
                    <SelectItem key={semester.id} value={semester.id.toString()}>
                      {semester.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.semesterId && <p className="text-sm text-red-500">{errors.semesterId}</p>}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Start Date *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className={errors.startDate ? "border-red-500" : ""}
                />
                {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  End Date *
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className={errors.endDate ? "border-red-500" : ""}
                />
                {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: RegisPeriodStatus) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={RegisPeriodStatus.Open}>Open</SelectItem>
                  <SelectItem value={RegisPeriodStatus.Closed}>Closed</SelectItem>
                  <SelectItem value={RegisPeriodStatus.Cancelled}>Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter registration period description (optional)"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Registration Period"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
