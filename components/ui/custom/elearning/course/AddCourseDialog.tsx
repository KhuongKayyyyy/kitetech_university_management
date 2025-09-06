import React, { useState } from "react";

import { Course } from "@/app/api/model/Course";
import { UserModel } from "@/app/api/model/UserModel";
import { subjectClassService } from "@/app/api/services/courseService";
import { userService } from "@/app/api/services/userService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSubjects } from "@/hooks/useSubject";
import { BookOpen, Calendar, Check, ChevronsUpDown, Info, MapPin, Plus, Save, User, X } from "lucide-react";
import { toast, Toaster } from "sonner";

interface TeacherUser {
  id?: number;
  username?: string;
  full_name?: string;
  email?: string;
  role?: string;
}

interface AddSubjectClassDialogProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCourseAdd?: (subjectClass: Course) => Promise<void>;
  trigger?: React.ReactNode;
}

interface SubjectClassFormData {
  subject_id: string;
  semester: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  enrolled: number;
  teacher_username: string;
  schedules: Array<{
    sections: number;
    schedule: string;
  }>;
}

const DAYS_OF_WEEK = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];

const SEMESTER_OPTIONS = ["HK1 2025-2026", "HK2 2025-2026", "HK1 2026-2027", "HK2 2026-2027"];

export default function AddCourseDialog({ isOpen, onOpenChange, onCourseAdd, trigger }: AddSubjectClassDialogProps) {
  const { subjects } = useSubjects();
  const [teacherUsers, setTeacherUsers] = useState<TeacherUser[]>([]);
  const [formData, setFormData] = useState<SubjectClassFormData>({
    subject_id: "",
    semester: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    enrolled: 0,
    teacher_username: "",
    schedules: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [semesterOpen, setSemesterOpen] = useState(false);

  // Load users with teacher role on component mount
  React.useEffect(() => {
    const loadTeacherUsers = async () => {
      try {
        const usersData = await userService.getUsers();
        // Filter users with teacher role (case insensitive)
        const teachers = usersData?.filter((user: UserModel) => user.role?.toLowerCase() === "teacher") || [];
        setTeacherUsers(teachers);
      } catch (error) {
        console.error("Failed to load teacher users:", error);
        toast.error("Failed to load teachers");
      }
    };
    loadTeacherUsers();
  }, []);

  const handleInputChange = (field: keyof SubjectClassFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleScheduleChange = (index: number, field: "sections" | "schedule", value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      schedules: prev.schedules.map((schedule, i) => (i === index ? { ...schedule, [field]: value } : schedule)),
    }));
  };

  const addSchedule = () => {
    setFormData((prev) => ({
      ...prev,
      schedules: [...prev.schedules, { sections: 1, schedule: "Monday" }],
    }));
  };

  const removeSchedule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.subject_id || formData.subject_id === "") {
      toast.error("Subject selection is required.");
      return;
    }

    if (!formData.semester.trim()) {
      toast.error("Semester selection is required.");
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      toast.error("Please select start and end dates.");
      return;
    }

    if (!formData.teacher_username.trim()) {
      toast.error("Teacher selection is required.");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("Location selection is required.");
      return;
    }

    if (formData.schedules.length === 0) {
      toast.error("Please add at least one schedule.");
      return;
    }

    setIsSaving(true);
    try {
      const submissionData: Course = {
        subject_id: parseInt(formData.subject_id),
        semester: formData.semester,
        description: formData.description,
        schedules: formData.schedules,
        start_date: formData.start_date,
        end_date: formData.end_date,
        location: formData.location,
        enrolled: formData.enrolled,
        teacher_username: formData.teacher_username,
      };

      // Call the service to add the subject class
      await subjectClassService.addSubjectClass(submissionData);

      // Call the callback if provided
      await onCourseAdd?.(submissionData);

      // Reset form on success
      setFormData({
        subject_id: "",
        semester: "",
        description: "",
        start_date: "",
        end_date: "",
        location: "",
        enrolled: 0,
        teacher_username: "",
        schedules: [],
      });

      onOpenChange?.(false);

      // Success toast with more details
      const subject = getSelectedSubject();
      const teacher = getSelectedTeacher();
      toast.success(`Subject class "${subject?.name}" has been created successfully!`, {
        description: `Teacher: ${getTeacherDisplayName(teacher || {})} | Location: ${formData.location} | Semester: ${formData.semester}`,
      });
    } catch (error) {
      console.error("Error creating subject class:", error);
      toast.error("Failed to create subject class. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      subject_id: "",
      semester: "",
      description: "",
      start_date: "",
      end_date: "",
      location: "",
      enrolled: 0,
      teacher_username: "",
      schedules: [],
    });
    onOpenChange?.(false);
  };

  const getSelectedSubject = () => {
    return subjects.find((subject) => subject.id === formData.subject_id);
  };

  const getSelectedTeacher = () => {
    return teacherUsers.find((teacher) => teacher.username === formData.teacher_username);
  };

  const getTeacherDisplayName = (teacher: TeacherUser) => {
    return teacher.full_name || teacher.email || teacher.username || "";
  };

  // Check if enough data is filled to show preview
  const shouldShowPreview = () => {
    return formData.subject_id && formData.semester && formData.teacher_username && formData.location;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Create Course
          </DialogTitle>
          <DialogDescription>Create a new course with selected weeks and course details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            {/* Subject Selection */}
            <div className="space-y-2">
              <Label htmlFor="subject_id">Subject *</Label>
              <Popover open={subjectOpen} onOpenChange={setSubjectOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={subjectOpen}
                    className="w-full justify-between"
                  >
                    {formData.subject_id
                      ? subjects.find((subject) => subject.id === formData.subject_id)?.name
                      : "Select subject..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search subjects..." />
                    <CommandList>
                      <CommandEmpty>No subject found.</CommandEmpty>
                      <CommandGroup>
                        {subjects.map((subject) => (
                          <CommandItem
                            key={subject.id}
                            value={`${subject.name} ${subject.id}`}
                            onSelect={() => {
                              handleInputChange("subject_id", subject.id);
                              setSubjectOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                formData.subject_id === subject.id ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {subject.name} ({subject.id})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Semester Selection */}
            <div className="space-y-2">
              <Label htmlFor="semester">Semester *</Label>
              <Popover open={semesterOpen} onOpenChange={setSemesterOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={semesterOpen}
                    className="w-full justify-between"
                  >
                    {formData.semester || "Select semester..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search semesters..." />
                    <CommandList>
                      <CommandEmpty>No semester found.</CommandEmpty>
                      <CommandGroup>
                        {SEMESTER_OPTIONS.map((semester) => (
                          <CommandItem
                            key={semester}
                            value={semester}
                            onSelect={() => {
                              handleInputChange("semester", semester);
                              setSemesterOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${formData.semester === semester ? "opacity-100" : "opacity-0"}`}
                            />
                            {semester}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange("start_date", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange("end_date", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Teacher and Location */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teacher_username">Teacher *</Label>
                <Popover open={teacherOpen} onOpenChange={setTeacherOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={teacherOpen}
                      className="w-full justify-between"
                    >
                      {formData.teacher_username
                        ? getTeacherDisplayName(getSelectedTeacher() || { id: 0, email: "", username: "" })
                        : "Select teacher..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search teachers..." />
                      <CommandList>
                        <CommandEmpty>No teacher found.</CommandEmpty>
                        <CommandGroup>
                          {teacherUsers.map((teacher) => (
                            <CommandItem
                              key={teacher.id}
                              value={`${getTeacherDisplayName(teacher)}`}
                              onSelect={() => {
                                handleInputChange("teacher_username", teacher.username || "");
                                setTeacherOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  formData.teacher_username === teacher.username ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {getTeacherDisplayName(teacher)}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={locationOpen}
                      className="w-full justify-between"
                    >
                      {formData.location || "Select location..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search locations..." />
                      <CommandList>
                        <CommandEmpty>No location found.</CommandEmpty>
                        <CommandGroup>
                          {[
                            "A1",
                            "A2",
                            "A3",
                            "A4",
                            "A5",
                            "B1",
                            "B2",
                            "B3",
                            "B4",
                            "B5",
                            "C1",
                            "C2",
                            "C3",
                            "C4",
                            "C5",
                            "D1",
                            "D2",
                            "D3",
                            "D4",
                            "D5",
                          ].map((location) => (
                            <CommandItem
                              key={location}
                              value={location}
                              onSelect={() => {
                                handleInputChange("location", location);
                                setLocationOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  formData.location === location ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              Room {location}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Enrolled Students */}
            <div className="space-y-2">
              <Label htmlFor="enrolled">Enrolled Students</Label>
              <Input
                id="enrolled"
                type="number"
                min="0"
                value={formData.enrolled}
                onChange={(e) => handleInputChange("enrolled", parseInt(e.target.value) || 0)}
                placeholder="Number of enrolled students"
              />
            </div>

            {/* Schedules Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Class Schedules *
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSchedule}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Schedule
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Add the weekly schedules for this subject class</p>

              {formData.schedules.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {formData.schedules.map((schedule, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor={`sections-${index}`} className="text-xs">
                                Sections
                              </Label>
                              <Select
                                value={schedule.sections.toString()}
                                onValueChange={(value) => handleScheduleChange(index, "sections", parseInt(value))}
                              >
                                <SelectTrigger className="text-sm">
                                  <SelectValue placeholder="Select sections" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                  <SelectItem value="4">4</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`schedule-${index}`} className="text-xs">
                                Day of Week
                              </Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" className="w-full justify-between text-sm">
                                    {schedule.schedule}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                  <Command>
                                    <CommandList>
                                      <CommandEmpty>No day found.</CommandEmpty>
                                      <CommandGroup>
                                        {DAYS_OF_WEEK.map((day) => (
                                          <CommandItem
                                            key={day.value}
                                            value={day.value}
                                            onSelect={() => handleScheduleChange(index, "schedule", day.value)}
                                          >
                                            <Check
                                              className={`mr-2 h-4 w-4 ${
                                                schedule.schedule === day.value ? "opacity-100" : "opacity-0"
                                              }`}
                                            />
                                            {day.label}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeSchedule(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {formData.schedules.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No schedules added yet. Click "Add Schedule" to get started.</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Class description and additional notes"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>

            {/* Class Preview Section */}
            {shouldShowPreview() && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <Info className="h-4 w-4" />
                    Class Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="text-sm text-gray-600">Subject</div>
                          <div className="font-medium text-green-900">{getSelectedSubject()?.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="text-sm text-gray-600">Teacher</div>
                          <div className="font-medium text-green-900">
                            {getTeacherDisplayName(getSelectedTeacher() || {})}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="text-sm text-gray-600">Location</div>
                          <div className="font-medium text-green-900">Room {formData.location}</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="text-sm text-gray-600">Semester</div>
                          <div className="font-medium text-green-900">{formData.semester}</div>
                        </div>
                      </div>
                      {formData.start_date && formData.end_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <div>
                            <div className="text-sm text-gray-600">Duration</div>
                            <div className="font-medium text-green-900">
                              {new Date(formData.start_date).toLocaleDateString()} -{" "}
                              {new Date(formData.end_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      )}
                      {formData.schedules.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <div>
                            <div className="text-sm text-gray-600">Schedules</div>
                            <div className="font-medium text-green-900">
                              {formData.schedules.map((s) => `${s.schedule} (section ${s.sections})`).join(", ")}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
        <Toaster />
      </DialogContent>
    </Dialog>
  );
}
