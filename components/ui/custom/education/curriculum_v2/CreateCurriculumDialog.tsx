"use client";

import React, { useCallback, useMemo, useState } from "react";

import { AcademicYearModel } from "@/app/api/model/AcademicYearModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { BookOpen, Dumbbell, Globe, GraduationCap, Lightbulb, Save, School, X } from "lucide-react";
import { toast } from "sonner";

export interface CurriculumBoardType {
  id: string;
  name: string;
  description: string;
  type: string;
  color: string;
  defaultSemesters: number;
}

export interface CurriculumFormData {
  name: string;
  description: string;
  academicYear: string;
  facultyId: string;
  majorId: string;
  totalCredits: number;
  selectedBoardTypes: string[];
}

interface CreateCurriculumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CurriculumFormData, boardTypes: CurriculumBoardType[]) => void;
  faculties: Array<{ id: string; name: string }>;
  majors: Array<{ id: string; name: string; facultyId: string }>;
  academicYears: AcademicYearModel[];
}

// Function to generate random colors
const getRandomColor = () => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-lime-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-fuchsia-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-sky-500",
    "bg-slate-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Move board types outside component to prevent recreation
const CURRICULUM_BOARD_TYPES: CurriculumBoardType[] = [
  {
    id: "core",
    name: "Core Subjects",
    description: "Essential subjects that all students must complete",
    type: "core",
    color: getRandomColor(),
    defaultSemesters: 8,
  },
  {
    id: "physical_education",
    name: "Physical Education",
    description: "Physical fitness and sports-related courses",
    type: "physical_education",
    color: getRandomColor(),
    defaultSemesters: 2,
  },
  {
    id: "skill_development",
    name: "Skill Development",
    description: "Practical skills and soft skills training",
    type: "skill_development",
    color: getRandomColor(),
    defaultSemesters: 4,
  },
  {
    id: "english",
    name: "English Courses",
    description: "Language proficiency and communication skills",
    type: "english",
    color: getRandomColor(),
    defaultSemesters: 3,
  },
  {
    id: "philosophy",
    name: "Philosophy & Ethics",
    description: "Philosophical thinking and ethical reasoning",
    type: "philosophy",
    color: getRandomColor(),
    defaultSemesters: 2,
  },
];

const getIconForBoardType = (boardTypeId: string) => {
  switch (boardTypeId) {
    case "core":
      return BookOpen;
    case "physical_education":
      return Dumbbell;
    case "skill_development":
      return Lightbulb;
    case "english":
      return Globe;
    case "philosophy":
      return School;
    default:
      return BookOpen;
  }
};

export default function CreateCurriculumDialog({
  open,
  onOpenChange,
  onSubmit,
  faculties,
  majors,
  academicYears,
}: CreateCurriculumDialogProps) {
  const [formData, setFormData] = useState<CurriculumFormData>({
    name: "",
    description: "",
    academicYear: new Date().getFullYear().toString(),
    facultyId: "",
    majorId: "",
    totalCredits: 120,
    selectedBoardTypes: ["core"], // Core is selected by default
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter majors based on selected faculty - memoize with stable reference
  const filteredMajors = useMemo(() => {
    return majors.filter((major) => major.facultyId === formData.facultyId);
  }, [majors, formData.facultyId]);

  // Individual handlers for each field to avoid complex dependency chains
  const handleNameChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, name: value }));
  }, []);

  const handleDescriptionChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  }, []);

  const handleAcademicYearChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, academicYear: value }));
  }, []);

  const handleTotalCreditsChange = useCallback((value: number) => {
    setFormData((prev) => ({ ...prev, totalCredits: value }));
  }, []);

  const handleFacultyChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      facultyId: value,
      majorId: "", // Reset major when faculty changes
    }));
  }, []);

  const handleMajorChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, majorId: value }));
  }, []);

  const handleBoardTypeToggle = useCallback((boardTypeId: string) => {
    setFormData((prev) => {
      const isSelected = prev.selectedBoardTypes.includes(boardTypeId);

      if (isSelected) {
        // Don't allow deselecting core subjects
        if (boardTypeId === "core") {
          toast.error("Core subjects must be included in every curriculum.");
          return prev; // Return previous state without changes
        }
        const newSelectedTypes = prev.selectedBoardTypes.filter((id) => id !== boardTypeId);
        return {
          ...prev,
          selectedBoardTypes: newSelectedTypes,
        };
      } else {
        const newSelectedTypes = [...prev.selectedBoardTypes, boardTypeId];
        return {
          ...prev,
          selectedBoardTypes: newSelectedTypes,
        };
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Curriculum name is required.");
      return;
    }

    if (!formData.facultyId) {
      toast.error("Please select a faculty.");
      return;
    }

    if (!formData.majorId) {
      toast.error("Please select a major.");
      return;
    }

    if (formData.selectedBoardTypes.length === 0) {
      toast.error("Please select at least one curriculum board type.");
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedBoardTypes = CURRICULUM_BOARD_TYPES.filter((type) => formData.selectedBoardTypes.includes(type.id));

      await onSubmit(formData, selectedBoardTypes);

      // Reset form
      setFormData({
        name: "",
        description: "",
        academicYear: new Date().getFullYear().toString(),
        facultyId: "",
        majorId: "",
        totalCredits: 120,
        selectedBoardTypes: ["core"],
      });

      toast.success("Curriculum structure created successfully!");
    } catch (error) {
      toast.error("Failed to create curriculum. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = useCallback(() => {
    setFormData({
      name: "",
      description: "",
      academicYear: new Date().getFullYear().toString(),
      facultyId: "",
      majorId: "",
      totalCredits: 120,
      selectedBoardTypes: ["core"],
    });
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Create New Curriculum
          </DialogTitle>
          <DialogDescription>Set up the basic information and structure for your new curriculum.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
              <CardDescription>Enter the fundamental details about the curriculum.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Curriculum Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Computer Science 2024"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year *</Label>
                  <Select value={formData.academicYear} onValueChange={handleAcademicYearChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an academic year" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map((year) => (
                        <SelectItem key={year.id} value={year.year.toString()}>
                          {year.start_date?.substring(0, 4)} - {year.end_date?.substring(0, 4)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              C
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="faculty">Faculty *</Label>
                  <Select value={formData.facultyId} onValueChange={handleFacultyChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a faculty" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculties.map((faculty) => (
                        <SelectItem key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="major">Major *</Label>
                  <Select value={formData.majorId} onValueChange={handleMajorChange} disabled={!formData.facultyId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a major" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredMajors.map((major) => (
                        <SelectItem key={major.id} value={major.id}>
                          {major.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalCredits">Total Credits</Label>
                <Input
                  id="totalCredits"
                  type="number"
                  min="1"
                  value={formData.totalCredits}
                  onChange={(e) => handleTotalCreditsChange(parseInt(e.target.value) || 120)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the curriculum..."
                  value={formData.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Curriculum Board Types Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Curriculum Structure</CardTitle>
              <CardDescription>
                Select the types of curriculum boards you want to include. Each board will help organize different
                categories of subjects.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CURRICULUM_BOARD_TYPES.map((boardType) => {
                  const isSelected = formData.selectedBoardTypes.includes(boardType.id);
                  const isCore = boardType.id === "core";
                  const IconComponent = getIconForBoardType(boardType.id);

                  return (
                    <Card
                      key={boardType.id}
                      onClick={() => !isCore && handleBoardTypeToggle(boardType.id)}
                      className={`group relative transition-all duration-300 cursor-pointer border-2 ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50 hover:shadow-md hover:bg-accent/20"
                      } ${isCore ? "border-primary bg-primary/10 shadow-sm" : ""}`}
                    >
                      <CardHeader className="space-y-3 p-6">
                        <CardTitle className="flex items-center justify-between text-lg font-semibold">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg transition-colors ${
                                isSelected || isCore
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-accent group-hover:bg-primary/10"
                              }`}
                            >
                              <IconComponent className="h-5 w-5" />
                            </div>
                            {boardType.name}
                          </div>
                          {isSelected && !isCore && (
                            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                              <svg className="h-3 w-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                          {isCore && (
                            <div className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                              Required
                            </div>
                          )}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                          {boardType.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
              {formData.selectedBoardTypes.length > 0 && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Selected: {formData.selectedBoardTypes.length} board type
                    {formData.selectedBoardTypes.length > 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Creating..." : "Create Curriculum"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
