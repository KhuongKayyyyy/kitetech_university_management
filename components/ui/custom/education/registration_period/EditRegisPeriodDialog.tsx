"use client";

import React, { useState } from "react";

import { RegistrationPeriod } from "@/app/api/model/RegistrationPeriodModel";
import { MOCK_SEMESTERS } from "@/app/api/model/SemesterModel";
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
    semesterId: registrationPeriod.semesterId.toString(),
    startDate: registrationPeriod.startDate,
    endDate: registrationPeriod.endDate,
    status: registrationPeriod.status,
    description: registrationPeriod.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      semesterId: parseInt(formData.semesterId),
      startDate: formData.startDate,
      endDate: formData.endDate,
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
