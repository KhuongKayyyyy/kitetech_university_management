"use client";

import React, { useMemo, useState } from "react";

import { mockClasses } from "@/app/api/model/ClassModel";
import { Button } from "@/components/ui/button";
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
import { useDepartments } from "@/hooks/useDeparment";
import { useMajors } from "@/hooks/useMajor";
import { GraduationCap, Plus, Search } from "lucide-react";

interface AddAvailableClassProps {
  onAddClasses?: (classIds: number[]) => void;
}

export default function AddAvailableClass({ onAddClasses }: AddAvailableClassProps) {
  const { departments } = useDepartments();
  const { majors } = useMajors();

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedMajor, setSelectedMajor] = useState<string>("all");
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);

  // Filter majors based on selected department
  const filteredMajors = useMemo(() => {
    if (selectedDepartment === "all") return majors;
    return majors.filter((major) => major.faculty?.id === parseInt(selectedDepartment));
  }, [majors, selectedDepartment]);

  // Filter classes based on search term, department, and major
  const filteredClasses = useMemo(() => {
    let filtered = mockClasses;

    // Filter by search term (class name or code)
    if (searchTerm) {
      filtered = filtered.filter(
        (cls) =>
          cls.classCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by major
    if (selectedMajor !== "all") {
      filtered = filtered.filter((cls) => cls.majorId === parseInt(selectedMajor));
    } else if (selectedDepartment !== "all") {
      // If department is selected but major is "all", filter by department
      const departmentMajorIds = filteredMajors.map((major) => major.id);
      filtered = filtered.filter((cls) => departmentMajorIds.includes(cls.majorId));
    }

    return filtered;
  }, [mockClasses, searchTerm, selectedMajor, selectedDepartment, filteredMajors]);

  // Group classes by department and major
  const groupedClasses = useMemo(() => {
    const groups: Record<string, Record<string, typeof mockClasses>> = {};

    filteredClasses.forEach((cls) => {
      const major = majors.find((m) => m.id === cls.majorId);
      const department = departments.find((d) => d.id === major?.faculty?.id);

      if (department && major) {
        if (!groups[department.name]) {
          groups[department.name] = {};
        }
        if (!groups[department.name][major.name]) {
          groups[department.name][major.name] = [];
        }
        groups[department.name][major.name].push(cls);
      }
    });

    return groups;
  }, [filteredClasses, majors, departments]);

  const handleClassSelection = (classId: number, checked: boolean) => {
    if (checked) {
      setSelectedClasses((prev) => [...prev, classId]);
    } else {
      setSelectedClasses((prev) => prev.filter((id) => id !== classId));
    }
  };

  const handleAddClasses = () => {
    if (onAddClasses && selectedClasses.length > 0) {
      onAddClasses(selectedClasses);
      setSelectedClasses([]);
      setOpen(false);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedDepartment("all");
    setSelectedMajor("all");
    setSelectedClasses([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Available Classes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden min-w-[900px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Add Available Classes
          </DialogTitle>
          <DialogDescription>
            Select classes to make available for registration. Classes are organized by department and major.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Classes</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by class code or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={selectedDepartment}
                onValueChange={(value) => {
                  setSelectedDepartment(value);
                  setSelectedMajor("all");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="major">Major</Label>
              <Select value={selectedMajor} onValueChange={setSelectedMajor}>
                <SelectTrigger>
                  <SelectValue placeholder="All Majors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Majors</SelectItem>
                  {filteredMajors.map((major) => (
                    <SelectItem key={major.id} value={major.id.toString()}>
                      {major.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Classes List */}
          <div className="border rounded-lg max-h-[60vh] overflow-y-auto">
            {Object.keys(groupedClasses).length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No classes found matching your criteria.</div>
            ) : (
              <div className="space-y-4 p-4">
                {Object.entries(groupedClasses).map(([departmentName, majorGroups]) => (
                  <div key={departmentName} className="space-y-3">
                    <h3 className="font-semibold text-lg text-primary border-b pb-1">{departmentName}</h3>
                    {Object.entries(majorGroups).map(([majorName, classes]) => (
                      <div key={majorName} className="ml-4 space-y-2">
                        <h4 className="font-medium text-md text-muted-foreground">{majorName}</h4>
                        <div className="ml-4 space-y-2">
                          {classes.map((cls) => (
                            <div key={cls.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded">
                              <Checkbox
                                id={`class-${cls.id}`}
                                checked={selectedClasses.includes(cls.id)}
                                onCheckedChange={(checked) => handleClassSelection(cls.id, checked as boolean)}
                              />
                              <div className="flex-1">
                                <Label htmlFor={`class-${cls.id}`} className="text-sm font-medium cursor-pointer">
                                  {cls.classCode}
                                </Label>
                                {cls.description && <p className="text-xs text-muted-foreground">{cls.description}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Count */}
          {selectedClasses.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedClasses.length} class{selectedClasses.length !== 1 ? "es" : ""} selected
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddClasses} disabled={selectedClasses.length === 0}>
            Add {selectedClasses.length} Class{selectedClasses.length !== 1 ? "es" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
