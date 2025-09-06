"use client";

import React, { useEffect, useState } from "react";

import { RegistrationPeriod } from "@/app/api/model/RegistrationPeriodModel";
import { SemesterModel } from "@/app/api/model/SemesterModel";
import { semesterService } from "@/app/api/services/semesterService";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RegisPeriodStatus } from "@/constants/enum/RegisPeriodStatus";
import { Calendar, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface EditRegisPeriodDialogProps {
  registrationPeriod: RegistrationPeriod;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (updatedPeriod: Partial<RegistrationPeriod>) => void;
}

export default function EditRegisPeriodDialog({
  registrationPeriod,
  open,
  setOpen,
  onSubmit,
}: EditRegisPeriodDialogProps) {
  const [formData, setFormData] = useState({
    semesterId: registrationPeriod.semester_id.toString(),
    startDate: registrationPeriod.start_date,
    endDate: registrationPeriod.end_date,
    status: registrationPeriod.status,
    description: registrationPeriod.description || "",
  });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      semester_id: parseInt(formData.semesterId),
      start_date: formData.startDate,
      end_date: formData.endDate,
      status: formData.status,
      description: formData.description,
    });
    setOpen(false);
  };

  const handleChange = (field: string, value: string | RegisPeriodStatus) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="h-5 w-5" />
            Edit Registration Period
          </DialogTitle>
          <DialogDescription>Update the registration period information below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="semesterId">Semester</Label>
            <Select value={formData.semesterId} onValueChange={(value) => handleChange("semesterId", value)}>
              <SelectTrigger>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value as RegisPeriodStatus)}
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter registration period description..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Calendar className="w-4 h-4 mr-2" />
              Update Period
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
