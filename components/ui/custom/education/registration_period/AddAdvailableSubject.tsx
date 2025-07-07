"use client";

import React, { useState } from "react";

import { subjects } from "@/app/api/fakedata";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, BookOpen, Plus } from "lucide-react";

interface AddAvailableSubjectProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  registrationPeriodId: number;
  onSubmit: (availableSubject: any) => void;
}

export default function AddAdvailableSubject({
  open,
  setOpen,
  registrationPeriodId,
  onSubmit,
}: AddAvailableSubjectProps) {
  const [step, setStep] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [formData, setFormData] = useState({
    max_registrations: "",
    day_of_week: "",
    start_period: "",
    end_period: "",
    weeks: "",
  });

  const handleSubjectSelect = (subjectId: string) => {
    // const subject = subjects.find((s) => s.id === parseInt(subjectId));
    // setSelectedSubject(subject);
  };

  const handleNextStep = () => {
    if (selectedSubject) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubject) {
      const availableSubject = {
        registration_period_id: registrationPeriodId,
        curriculum_item_id: selectedSubject.curriculum_item_id || 1,
        subject_id: selectedSubject.id,
        subject_name: selectedSubject.name,
        max_registrations: parseInt(formData.max_registrations),
        current_registrations: 0,
        day_of_week: formData.day_of_week,
        start_period: parseInt(formData.start_period),
        end_period: parseInt(formData.end_period),
        weeks: formData.weeks,
      };
      onSubmit(availableSubject);
      resetForm();
      setOpen(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedSubject(null);
    setFormData({
      max_registrations: "",
      day_of_week: "",
      start_period: "",
      end_period: "",
      weeks: "",
    });
  };

  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Available Subject - Step {step} of 2
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Select a subject to make available for registration"
              : "Configure the subject availability details"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select onValueChange={handleSubjectSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{subject.name}</div>
                          <div className="text-xs text-gray-500">{subject.credits} credits</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSubject && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Selected Subject</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Name:</span> {selectedSubject.name}
                  </p>
                  <p>
                    <span className="font-medium">Code:</span> {selectedSubject.code}
                  </p>
                  <p>
                    <span className="font-medium">Credits:</span> {selectedSubject.credits}
                  </p>
                  {selectedSubject.description && (
                    <p>
                      <span className="font-medium">Description:</span> {selectedSubject.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="button" onClick={handleNextStep} disabled={!selectedSubject}>
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-1">Subject: {selectedSubject?.name}</h4>
              <p className="text-sm text-gray-600">
                {selectedSubject?.code} - {selectedSubject?.credits} credits
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_registrations">Maximum Registrations</Label>
              <Input
                id="max_registrations"
                type="number"
                value={formData.max_registrations}
                onChange={(e) => handleChange("max_registrations", e.target.value)}
                placeholder="Enter maximum number of students"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="day_of_week">Day of Week</Label>
              <Select value={formData.day_of_week} onValueChange={(value) => handleChange("day_of_week", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monday">Monday</SelectItem>
                  <SelectItem value="Tuesday">Tuesday</SelectItem>
                  <SelectItem value="Wednesday">Wednesday</SelectItem>
                  <SelectItem value="Thursday">Thursday</SelectItem>
                  <SelectItem value="Friday">Friday</SelectItem>
                  <SelectItem value="Saturday">Saturday</SelectItem>
                  <SelectItem value="Sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_period">Start Period</Label>
                <Input
                  id="start_period"
                  type="number"
                  value={formData.start_period}
                  onChange={(e) => handleChange("start_period", e.target.value)}
                  placeholder="e.g., 1"
                  min="1"
                  max="10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_period">End Period</Label>
                <Input
                  id="end_period"
                  type="number"
                  value={formData.end_period}
                  onChange={(e) => handleChange("end_period", e.target.value)}
                  placeholder="e.g., 3"
                  min="1"
                  max="10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weeks">Weeks</Label>
              <Input
                id="weeks"
                value={formData.weeks}
                onChange={(e) => handleChange("weeks", e.target.value)}
                placeholder="e.g., 1-16 or 1,3,5,7-10"
                required
              />
            </div>

            <div className="flex justify-between gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handlePreviousStep}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subject
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
