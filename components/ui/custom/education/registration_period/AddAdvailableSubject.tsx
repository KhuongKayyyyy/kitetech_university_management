"use client";

import React, { useMemo, useState } from "react";

import { subjects } from "@/app/api/fakedata";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, BookOpen, Plus, Search } from "lucide-react";

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
  const [selectedSubjects, setSelectedSubjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    max_registrations: "",
    day_of_week: "",
    start_period: "",
    end_period: "",
    weeks: "",
  });

  // Filter subjects based on search term (name or code)
  const filteredSubjects = useMemo(() => {
    if (!searchTerm.trim()) {
      return subjects;
    }

    const term = searchTerm.toLowerCase();
    return subjects.filter(
      (subject) => subject.name.toLowerCase().includes(term) || subject.id.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  const handleSubjectToggle = (subject: any) => {
    setSelectedSubjects((prev) => {
      const isSelected = prev.some((s) => s.id === subject.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== subject.id);
      } else {
        return [...prev, subject];
      }
    });
  };

  const handleNextStep = () => {
    if (selectedSubjects.length > 0) {
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
    if (selectedSubjects.length > 0) {
      selectedSubjects.forEach((subject) => {
        const availableSubject = {
          registration_period_id: registrationPeriodId,
          curriculum_item_id: subject.curriculum_item_id || 1,
          subject_id: subject.id,
          subject_name: subject.name,
          max_registrations: parseInt(formData.max_registrations),
          current_registrations: 0,
          day_of_week: formData.day_of_week,
          start_period: parseInt(formData.start_period),
          end_period: parseInt(formData.end_period),
          weeks: formData.weeks,
        };
        onSubmit(availableSubject);
      });
      resetForm();
      setOpen(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedSubjects([]);
    setSearchTerm("");
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
              ? "Search and select subjects to make available for registration"
              : "Configure the subject availability details"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Subjects</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="h-[300px] w-full">
              <div className="space-y-2">
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="flex items-start space-x-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => handleSubjectToggle(subject)}
                    >
                      <Checkbox
                        checked={selectedSubjects.some((s) => s.id === subject.id)}
                        onCheckedChange={() => handleSubjectToggle(subject)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <div>
                            <p className="text-sm font-medium leading-none">{subject.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {subject.id} - {subject.credits} credits
                            </p>
                            {subject.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{subject.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {searchTerm ? "No subjects found matching your search." : "No available subjects to add."}
                  </p>
                )}
              </div>
            </ScrollArea>

            {selectedSubjects.length > 0 && (
              <>
                <Separator />
                <div className="text-xs text-muted-foreground">
                  {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? "s" : ""} selected
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="button" onClick={handleNextStep} disabled={selectedSubjects.length === 0}>
                Next Step ({selectedSubjects.length})
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-2">Selected Subjects ({selectedSubjects.length})</h4>
              <div className="space-y-1 text-sm max-h-20 overflow-y-auto">
                {selectedSubjects.map((subject, index) => (
                  <p key={subject.id} className="text-gray-600">
                    {index + 1}. {subject.name} ({subject.subjectId})
                  </p>
                ))}
              </div>
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
                  Add Subjects ({selectedSubjects.length})
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
