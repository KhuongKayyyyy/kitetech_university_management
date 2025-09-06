"use client";

import React, { useEffect, useState } from "react";

import { RegistrationPeriod } from "@/app/api/model/RegistrationPeriodModel";
import { SemesterModel } from "@/app/api/model/SemesterModel";
import { registrationPeriodService } from "@/app/api/services/registrationPeriodService";
import { semesterService } from "@/app/api/services/semesterService";
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
import { APP_ROUTES } from "@/constants/AppRoutes";
import { RegisPeriodStatus } from "@/constants/enum/RegisPeriodStatus";
import { CalendarDays, Clock, FileText, Hash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const router = useRouter();
  const [formData, setFormData] = useState({
    semesterId: "",
    startDate: "",
    endDate: "",
    status: RegisPeriodStatus.Open,
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [semesters, setSemesters] = useState<SemesterModel[]>([]);
  const [loadingSemesters, setLoadingSemesters] = useState(false);

  useEffect(() => {
    const fetchSemesters = async () => {
      if (open) {
        setLoadingSemesters(true);
        try {
          const semestersData = await semesterService.getSemesters();
          setSemesters(semestersData);
        } catch (error) {
          console.error("Error fetching semesters:", error);
          toast.error("Failed to load semesters");
        } finally {
          setLoadingSemesters(false);
        }
      }
    };

    fetchSemesters();
  }, [open]);

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
        semester_id: parseInt(formData.semesterId),
        start_date: formData.startDate,
        end_date: formData.endDate,
        status: formData.status,
        description: formData.description || "",
        created_at: "",
        updated_at: "",
        semester: {} as any,
        courseRegistrationClasses: [],
        courseRegistrationSubjects: [],
      };

      // Call the API to add the registration period
      const createdRegistrationPeriod = await registrationPeriodService.addRegistrationPeriod(newRegistrationPeriod);

      // Find the selected semester to populate the semester information
      const selectedSemester = semesters.find((s) => s.id === parseInt(formData.semesterId));

      // Create a complete registration period object with semester information
      const completeRegistrationPeriod: RegistrationPeriod = {
        ...createdRegistrationPeriod,
        semester: selectedSemester || {
          id: parseInt(formData.semesterId),
          name: "Unknown Semester",
          academic_year_id: 0,
          created_at: "",
          updated_at: "",
        },
      };

      // Call the callback to update the parent component
      onAddRegistrationPeriod(completeRegistrationPeriod);

      // Show success message
      toast.success("Registration period added successfully!");

      // Navigate to the new registration period detail page
      router.push(
        `${APP_ROUTES.REGISTRATION_PERIOD}/${createdRegistrationPeriod.id}?name=${createdRegistrationPeriod.description || "Registration Period"}`,
      );

      handleClose();
    } catch (error) {
      console.error("Error adding registration period:", error);
      toast.error("Failed to add registration period. Please try again.");
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
                  <SelectValue placeholder={loadingSemesters ? "Loading semesters..." : "Select semester"} />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((semester) => (
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
