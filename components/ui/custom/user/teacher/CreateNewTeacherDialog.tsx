"use client";

import React, { useEffect, useState } from "react";

import { FacultyModel } from "@/app/api/model/model";
import { Teacher } from "@/app/api/model/TeacherModel";
import { departmentService } from "@/app/api/services/departmentService";
import { teacherService } from "@/app/api/services/teacherService";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";

interface CreateNewTeacherDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onTeacherCreated: () => void;
  isCreating?: boolean;
}

interface TeacherFormData {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  gender: number;
  birth_date: string;
  faculty_id: number;
}

export default function CreateNewTeacherDialog({
  isOpen,
  setIsOpen,
  onTeacherCreated,
  isCreating = false,
}: CreateNewTeacherDialogProps) {
  const [formData, setFormData] = useState<TeacherFormData>({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    gender: 0,
    birth_date: "",
    faculty_id: 0,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TeacherFormData, string>>>({});
  const [departments, setDepartments] = useState<FacultyModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [facultyOpen, setFacultyOpen] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const deptData = await departmentService.getDepartments();
        setDepartments(deptData);
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("Failed to fetch departments");
      }
    };

    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof TeacherFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TeacherFormData, string>> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.birth_date) {
      newErrors.birth_date = "Birth date is required";
    }

    if (!formData.faculty_id || formData.faculty_id === 0) {
      newErrors.faculty_id = "Faculty is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const teacherData: Teacher = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        birth_date: formData.birth_date,
        faculty_id: formData.faculty_id,
      };

      await teacherService.addTeacher(teacherData);
      toast.success(`Teacher ${formData.full_name} created successfully`);
      onTeacherCreated();
      handleCancel();
    } catch (error) {
      console.error("Error creating teacher:", error);
      toast.error("Failed to create teacher");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      address: "",
      gender: 0,
      birth_date: "",
      faculty_id: 0,
    });
    setErrors({});
    setDate(undefined);
    setFacultyOpen(false);
    setIsOpen(false);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      handleInputChange("birth_date", format(selectedDate, "yyyy-MM-dd"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Teacher</DialogTitle>
          <DialogDescription>Fill in the details below to create a new teacher account.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                type="text"
                placeholder="Enter full name"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                className={errors.full_name ? "border-red-500" : ""}
              />
              {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender.toString()}
                onValueChange={(value) => handleInputChange("gender", parseInt(value))}
              >
                <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Male</SelectItem>
                  <SelectItem value="1">Female</SelectItem>
                  <SelectItem value="2">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth_date">Birth Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      errors.birth_date ? "border-red-500" : ""
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
                </PopoverContent>
              </Popover>
              {errors.birth_date && <p className="text-sm text-red-500">{errors.birth_date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="faculty_id">Faculty *</Label>
              <Popover open={facultyOpen} onOpenChange={setFacultyOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={facultyOpen}
                    className={`w-full justify-between ${errors.faculty_id ? "border-red-500" : ""}`}
                  >
                    {formData.faculty_id
                      ? departments.find((dept) => dept.id === formData.faculty_id)?.name
                      : "Select faculty..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search faculty..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No faculty found.</CommandEmpty>
                      <CommandGroup>
                        {departments.map((dept) => (
                          <CommandItem
                            key={dept.id}
                            value={dept.name}
                            onSelect={() => {
                              handleInputChange("faculty_id", dept.id === formData.faculty_id ? 0 : dept.id);
                              setFacultyOpen(false);
                            }}
                          >
                            {dept.name}
                            <Check
                              className={cn("ml-auto", formData.faculty_id === dept.id ? "opacity-100" : "opacity-0")}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.faculty_id && <p className="text-sm text-red-500">{errors.faculty_id}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              type="text"
              placeholder="Enter address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isCreating}>
              {isLoading || isCreating ? "Creating..." : "Create Teacher"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
