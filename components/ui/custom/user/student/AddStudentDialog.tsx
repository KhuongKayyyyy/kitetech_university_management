"use client";

import { useState } from "react";

import { departmentData, majors } from "@/app/api/fakedata";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";

const startYear = 2021;

interface AddStudentDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddStudentDialog({ open, onClose }: AddStudentDialogProps) {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState<Date>();
  const [location, setLocation] = useState("");
  const [departmentId, setDepartmentId] = useState<number>(5);
  const [majorId, setMajorId] = useState<number>(4);
  const [currentStudentCount, setCurrentStudentCount] = useState(972);
  const [currentClassCount, setCurrentClassCount] = useState(2);
  const [selectedClassCode, setSelectedClassCode] = useState("");

  const generateStudentId = () => {
    const yearSuffix = startYear.toString().slice(-2);
    const nextNumber = (currentStudentCount + 1).toString().padStart(4, "0");
    return `${departmentId}${yearSuffix}0${nextNumber}`;
  };

  const generateClassCode = () => {
    return `${startYear.toString().slice(2)}${departmentId.toString().padStart(2, "0")}${majorId.toString().padStart(2, "0")}0${currentClassCount.toString().padStart(2, "0")}`;
  };

  const handleSave = () => {
    const id = generateStudentId();
    const classCode = generateClassCode();
    console.log({ id, name, birthday, location, departmentId, majorId, classCode });
  };

  const getClassOptions = () => {
    const year = startYear.toString().slice(2);
    const dep = departmentId.toString().padStart(2, "0");
    const maj = majorId.toString().padStart(2, "0");
    return [1, 2].map((n) => `${year}${dep}${maj}${n.toString().padStart(2, "0")}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>Fill in student details. ID and Class will be auto-generated.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 px-5">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Birthday</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("col-span-3 justify-start text-left font-normal", !birthday && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthday ? format(birthday, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={birthday} onSelect={setBirthday} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              className="col-span-3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Department</Label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(Number(e.target.value))}
              className="col-span-3 rounded border p-2"
            >
              {departmentData.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Major</Label>
            <select
              value={majorId}
              onChange={(e) => setMajorId(Number(e.target.value))}
              className="col-span-3 rounded border p-2"
            >
              {(majors[departmentId] || []).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Student ID</Label>
            <Input readOnly value={generateStudentId()} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Class Code</Label>
            <select
              value={selectedClassCode}
              onChange={(e) => setSelectedClassCode(e.target.value)}
              className="col-span-3 rounded border p-2"
            >
              <option value="">Select a class</option>
              {getClassOptions().map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={handleSave}>
              Save Student
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
