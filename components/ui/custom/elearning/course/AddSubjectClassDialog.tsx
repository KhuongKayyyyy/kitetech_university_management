import React, { useState } from "react";

import { AvailableSubject } from "@/app/api/model/AvailableSubject";
import { MOCK_SEMESTER_WEEKS } from "@/app/api/model/SemesterWeekModel";
import { MOCK_TIME_SHEETS } from "@/app/api/model/TimeSheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useSubjects } from "@/hooks/useSubject";
import { BookOpen, Calendar, CalendarDays, Clock, Save, X } from "lucide-react";
import { toast } from "sonner";

interface AddSubjectClassDialogProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubjectClassAdd?: (subjectClass: any) => Promise<void>;
  trigger?: React.ReactNode;
}

interface SubjectClassFormData {
  subject_id: number;
  class_name: string;
  description: string;
  semester_week_ids: number[];
  max_students: number;
  instructor: string;
  location: string;
  schedule_time_sheets: number[];
}

const DAYS_OF_WEEK = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

export default function AddSubjectClassDialog({
  isOpen,
  onOpenChange,
  onSubjectClassAdd,
  trigger,
}: AddSubjectClassDialogProps) {
  const { subjects } = useSubjects();
  const [formData, setFormData] = useState<SubjectClassFormData>({
    subject_id: 0,
    class_name: "",
    description: "",
    semester_week_ids: [],
    max_students: 30,
    instructor: "",
    location: "",
    schedule_time_sheets: [],
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof SubjectClassFormData, value: string | number | number[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWeekSelection = (weekId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      semester_week_ids: checked
        ? [...prev.semester_week_ids, weekId]
        : prev.semester_week_ids.filter((id) => id !== weekId),
    }));
  };

  const handleTimeSheetSelection = (timeSheetId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      schedule_time_sheets: checked
        ? [...prev.schedule_time_sheets, timeSheetId]
        : prev.schedule_time_sheets.filter((id) => id !== timeSheetId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.subject_id) {
      toast.error("Subject selection is required.");
      return;
    }

    if (!formData.class_name.trim()) {
      toast.error("Class name is required.");
      return;
    }

    if (formData.semester_week_ids.length === 0) {
      toast.error("Please select at least one semester week.");
      return;
    }

    if (!formData.instructor.trim()) {
      toast.error("Instructor name is required.");
      return;
    }

    if (formData.schedule_time_sheets.length === 0) {
      toast.error("Please select at least one time sheet from the timetable.");
      return;
    }

    setIsSaving(true);
    try {
      const submissionData = {
        ...formData,
      };

      await onSubjectClassAdd?.(submissionData);

      // Reset form on success
      setFormData({
        subject_id: 0,
        class_name: "",
        description: "",
        semester_week_ids: [],
        max_students: 30,
        instructor: "",
        location: "",
        schedule_time_sheets: [],
      });

      onOpenChange?.(false);
      toast.success("Subject class created successfully!");
    } catch (error) {
      toast.error("Failed to create subject class. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      subject_id: 0,
      class_name: "",
      description: "",
      semester_week_ids: [],
      max_students: 30,
      instructor: "",
      location: "",
      schedule_time_sheets: [],
    });
    onOpenChange?.(false);
  };

  const getSelectedSubject = () => {
    return subjects.find((subject) => subject.id.toString() === formData.subject_id.toString());
  };

  const getSelectedTimeSheets = () => {
    return MOCK_TIME_SHEETS.filter((sheet) => formData.schedule_time_sheets.includes(sheet.id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Create Subject Class
          </DialogTitle>
          <DialogDescription>Create a new subject class with selected weeks and course details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            {/* Subject Selection */}
            <div className="space-y-2">
              <Label htmlFor="subject_id">Subject *</Label>
              <Select
                value={formData.subject_id.toString()}
                onValueChange={(value: string) => handleInputChange("subject_id", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name} ({subject.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Class Name */}
            <div className="space-y-2">
              <Label htmlFor="class_name">Class Name *</Label>
              <Input
                id="class_name"
                placeholder="e.g., Morning Section, Advanced Group"
                value={formData.class_name}
                onChange={(e) => handleInputChange("class_name", e.target.value)}
                required
              />
            </div>

            {/* Class Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor *</Label>
                <Input
                  id="instructor"
                  placeholder="Instructor name"
                  value={formData.instructor}
                  onChange={(e) => handleInputChange("instructor", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_students">Max Students</Label>
                <Input
                  id="max_students"
                  type="number"
                  min="1"
                  value={formData.max_students}
                  onChange={(e) => handleInputChange("max_students", parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Room/Building"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>
            </div>

            {/* Semester Weeks Selection - MOVED TO TOP */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Active Semester Weeks *
              </Label>
              <p className="text-sm text-muted-foreground">
                Select the weeks when this class will be active during the semester
              </p>
              <Card>
                <CardContent className="p-4">
                  <div className="max-h-48 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {MOCK_SEMESTER_WEEKS.sort((a, b) => (a.week_number || 0) - (b.week_number || 0)) // Sort by week_number
                        .map((week) => (
                          <div key={week.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                            <Checkbox
                              id={`week-${week.id}`}
                              checked={week.id !== undefined && formData.semester_week_ids.includes(week.id)}
                              onCheckedChange={(checked) =>
                                week.id !== undefined && handleWeekSelection(week.id, checked as boolean)
                              }
                            />
                            <Label htmlFor={`week-${week.id}`} className="text-xs font-normal cursor-pointer flex-1">
                              <div className="font-medium">Week {week.week_number}</div>
                              <div className="text-gray-500">
                                {week.start_date} - {week.end_date}
                              </div>
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>
                  {formData.semester_week_ids.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-xs text-blue-600 font-medium">
                        ✓ {formData.semester_week_ids.length} week(s) selected
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Timetable Schedule Selection - MOVED AFTER SEMESTER WEEKS */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Class Schedule - Weekly Timetable *
              </Label>
              <p className="text-sm text-muted-foreground">
                Click on time slots to select your class schedule for the selected weeks
              </p>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Weekly Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Timetable Grid */}
                  <div className="border rounded-lg overflow-hidden">
                    {/* Header Row - Days */}
                    <div className="grid grid-cols-8 bg-gray-50 border-b">
                      <div className="p-3 text-xs font-semibold text-gray-600 border-r">Time</div>
                      {DAYS_OF_WEEK.map((day) => (
                        <div
                          key={day.value}
                          className="p-3 text-xs font-semibold text-gray-700 text-center border-r last:border-r-0"
                        >
                          {day.label}
                        </div>
                      ))}
                    </div>

                    {/* Time Rows */}
                    {MOCK_TIME_SHEETS.map((sheet) => sheet.sheet) // Get all sheet names
                      .filter((sheet, index, arr) => arr.indexOf(sheet) === index) // Remove duplicates
                      .sort((a, b) => {
                        // Extract sheet numbers for proper sorting
                        const getSheetNumber = (sheetName: string) => {
                          const match = sheetName.match(/\d+/);
                          return match ? parseInt(match[0]) : 0;
                        };
                        return getSheetNumber(a) - getSheetNumber(b);
                      })
                      .map((sheetName) => {
                        // Get the time slot for this sheet
                        const timeSlot =
                          MOCK_TIME_SHEETS.find((sheet) => sheet.sheet === sheetName)?.time_of_sheet || "";

                        return (
                          <div key={sheetName} className="grid grid-cols-8 border-b last:border-b-0">
                            {/* Time Column */}
                            <div className="p-3 text-xs font-medium text-gray-600 bg-gray-25 border-r flex items-center">
                              {timeSlot}
                            </div>

                            {/* Day Columns */}
                            {DAYS_OF_WEEK.map((day) => {
                              const timeSheet = MOCK_TIME_SHEETS.find(
                                (sheet) => sheet.date.toLowerCase() === day.value && sheet.sheet === sheetName,
                              );

                              return (
                                <div
                                  key={`${day.value}-${sheetName}`}
                                  className="border-r last:border-r-0 min-h-[60px]"
                                >
                                  {timeSheet ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleTimeSheetSelection(
                                          timeSheet.id,
                                          !formData.schedule_time_sheets.includes(timeSheet.id),
                                        )
                                      }
                                      className={`w-full h-full p-2 text-xs transition-all duration-200 hover:bg-blue-50 ${
                                        formData.schedule_time_sheets.includes(timeSheet.id)
                                          ? "bg-blue-100 border-2 border-blue-400 text-blue-800"
                                          : "bg-white hover:bg-gray-50 border border-gray-200"
                                      }`}
                                    >
                                      <div className="space-y-1">
                                        <div className="font-medium truncate">{timeSheet.sheet}</div>
                                        {formData.schedule_time_sheets.includes(timeSheet.id) && (
                                          <div className="text-xs text-blue-600">✓ Selected</div>
                                        )}
                                      </div>
                                    </button>
                                  ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                      <span className="text-xs text-gray-400">—</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                  </div>

                  {/* Selected Schedule Summary */}
                  {formData.schedule_time_sheets.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          Selected Schedule ({formData.schedule_time_sheets.length} slots)
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {getSelectedTimeSheets().map((timeSheet) => (
                          <div key={timeSheet.id} className="text-xs bg-white px-2 py-1 rounded border border-blue-200">
                            <div className="font-medium capitalize text-blue-800">{timeSheet.date}</div>
                            <div className="text-blue-600">{timeSheet.time_of_sheet}</div>
                            <div className="text-gray-600 truncate">{timeSheet.sheet}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Class description and additional notes"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={2}
              />
            </div>

            {/* Selected Subject Info */}
            {getSelectedSubject() && (
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900 mb-2">Selected Subject</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-gray-600">Code:</span>
                          <div className="font-medium text-blue-800">{getSelectedSubject()?.id}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Credits:</span>
                          <div className="font-medium text-blue-800">{getSelectedSubject()?.credits}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <div className="font-medium text-blue-800">{getSelectedSubject()?.name}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Faculty:</span>
                          <div className="font-medium text-blue-800">{getSelectedSubject()?.faculty_id}</div>
                        </div>
                      </div>
                      {getSelectedSubject()?.description && (
                        <div className="mt-2 text-xs">
                          <span className="text-gray-600">Description:</span>
                          <div className="text-blue-700 mt-1">{getSelectedSubject()?.description}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Creating..." : "Create Class"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
