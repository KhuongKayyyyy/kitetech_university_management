"use client";

import React, { useState } from "react";

import { curriculumData, majorData } from "@/app/api/fakedata";
import { ClassModel } from "@/app/api/model/ClassModel";
import { classService } from "@/app/api/services/classService";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useAcademicYears } from "@/hooks/useAcademicYear";
import { useMajors } from "@/hooks/useMajor";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddClassDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddClass?: (classData: ClassModel) => void;
}

export default function AddClassDialog({ open, setOpen, onAddClass }: AddClassDialogProps) {
  const { academicYears } = useAcademicYears();
  const { majors } = useMajors();
  const [loading, setLoading] = useState(false);
  const [openMajor, setOpenMajor] = useState(false);
  const [openAcademicYear, setOpenAcademicYear] = useState(false);
  const [openCurriculum, setOpenCurriculum] = useState(false);

  const [formData, setFormData] = useState({
    majorId: "",
    academicYearId: "",
    curriculumId: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.majorId || !formData.academicYearId || !formData.curriculumId) {
      return;
    }

    const newClass: Omit<ClassModel, "id"> = {
      major_id: parseInt(formData.majorId),
      academic_year: parseInt(formData.academicYearId),
      curriculumId: parseInt(formData.curriculumId),
      description: formData.description || undefined,
    };

    try {
      setLoading(true);
      const addedClass = await classService.addClass(newClass as ClassModel);
      onAddClass?.(addedClass);
      toast.success("Class added successfully!");
      setOpen(false);
      setFormData({
        majorId: "",
        academicYearId: "",
        curriculumId: "",
        description: "",
      });
    } catch (error) {
      console.error("Error adding class:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>
            Create a new class with the required information. Fill in all the required fields.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="majorId" className="text-right">
                Major ID *
              </Label>
              <Popover open={openMajor} onOpenChange={setOpenMajor}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openMajor}
                    className="col-span-3 justify-between"
                    disabled={loading}
                  >
                    {formData.majorId
                      ? majors.find((major) => major.id?.toString() === formData.majorId)?.name
                      : "Select major..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search major..." />
                    <CommandList>
                      <CommandEmpty>No major found.</CommandEmpty>
                      <CommandGroup>
                        {majors.map((major) => (
                          <CommandItem
                            key={major.id}
                            value={major.name}
                            onSelect={() => {
                              handleInputChange("majorId", major.id?.toString() || "");
                              setOpenMajor(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.majorId === major.id?.toString() ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {major.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="academicYearId" className="text-right">
                Academic Year *
              </Label>
              <Popover open={openAcademicYear} onOpenChange={setOpenAcademicYear}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openAcademicYear}
                    className="col-span-3 justify-between"
                    disabled={loading}
                  >
                    {formData.academicYearId
                      ? academicYears.find((year) => year.year?.toString() === formData.academicYearId)?.year
                      : "Select academic year..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search academic year..." />
                    <CommandList>
                      <CommandEmpty>No academic year found.</CommandEmpty>
                      <CommandGroup>
                        {academicYears.map((academicYear) => (
                          <CommandItem
                            key={academicYear.id}
                            value={academicYear.year?.toString()}
                            onSelect={() => {
                              handleInputChange("academicYearId", academicYear.year?.toString() || "");
                              setOpenAcademicYear(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.academicYearId === academicYear.year?.toString() ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {academicYear.year}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="curriculumId" className="text-right">
                Curriculum *
              </Label>
              <Popover open={openCurriculum} onOpenChange={setOpenCurriculum}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCurriculum}
                    className="col-span-3 justify-between"
                    disabled={loading}
                  >
                    {formData.curriculumId
                      ? curriculumData.find((curriculum) => curriculum.id.toString() === formData.curriculumId)?.name
                      : "Select curriculum..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search curriculum..." />
                    <CommandList>
                      <CommandEmpty>No curriculum found.</CommandEmpty>
                      <CommandGroup>
                        {curriculumData.map((curriculum) => (
                          <CommandItem
                            key={curriculum.id}
                            value={curriculum.name}
                            onSelect={() => {
                              handleInputChange("curriculumId", curriculum.id.toString());
                              setOpenCurriculum(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.curriculumId === curriculum.id.toString() ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {curriculum.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Class description (optional)"
                className="col-span-3"
                rows={3}
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding Class...
                </>
              ) : (
                "Add Class"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
