"use client";

import { useEffect, useState } from "react";

import { FacultyModel } from "@/app/api/model/model";
import { Teacher } from "@/app/api/model/TeacherModel";
import { teacherService } from "@/app/api/services/teacherService";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

import { MajorInDepartTable } from "../major/MajorInDepartTable";

interface NewDepartmentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd?: (newDepartment: FacultyModel) => void;
}

export function NewDepartmentDialog({ open, setOpen, onAdd }: NewDepartmentDialogProps) {
  const [newDepartment, setNewDepartment] = useState<FacultyModel>({
    id: 0,
    name: "",
    contact_info: "",
    dean: "",
    majors: [],
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);

  useEffect(() => {
    if (open) {
      fetchTeachers();
    }
  }, [open]);

  const fetchTeachers = async () => {
    setIsLoadingTeachers(true);
    try {
      const teachersData = await teacherService.getTeachers();
      setTeachers(teachersData || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setTeachers([]);
    } finally {
      setIsLoadingTeachers(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewDepartment((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDeanChange = (value: string) => {
    setNewDepartment((prev) => ({
      ...prev,
      dean: value,
    }));
  };

  const handleSave = () => {
    if (onAdd) onAdd(newDepartment);
    setOpen(false);
    setNewDepartment({
      id: 0,
      name: "",
      contact_info: "",
      dean: "",
      majors: [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
          <DialogDescription>Enter the department's details and add any majors before saving.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={newDepartment.name} onChange={handleInputChange} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Code
            </Label>
            <Input id="code" value={newDepartment.code} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Contact Info
            </Label>
            <Input
              id="contact_info"
              value={newDepartment.contact_info}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dean" className="text-right">
              Dean
            </Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="col-span-3 justify-between"
                >
                  {newDepartment.dean
                    ? teachers.find((teacher) => teacher.full_name === newDepartment.dean)?.full_name
                    : isLoadingTeachers
                      ? "Loading teachers..."
                      : "Select a dean..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="col-span-3 p-0">
                <Command>
                  <CommandInput placeholder="Search teachers..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No teacher found.</CommandEmpty>
                    <CommandGroup>
                      {teachers.map((teacher) => (
                        <CommandItem
                          key={teacher.id}
                          value={teacher.full_name || ""}
                          onSelect={(currentValue) => {
                            handleDeanChange(currentValue === newDepartment.dean ? "" : currentValue);
                            setOpenCombobox(false);
                          }}
                        >
                          {teacher.full_name}
                          <Check
                            className={cn(
                              "ml-auto",
                              newDepartment.dean === teacher.full_name ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
