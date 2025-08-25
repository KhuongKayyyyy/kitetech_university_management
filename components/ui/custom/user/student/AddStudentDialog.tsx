"use client";

import { useEffect, useMemo, useState } from "react";

import { ClassModel } from "@/app/api/model/ClassModel";
import { Student } from "@/app/api/model/StudentModel";
import { classService } from "@/app/api/services/classService";
import { studentService } from "@/app/api/services/studentService";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { toast } from "sonner";

const startYear = 2021;

interface AddStudentDialogProps {
  open: boolean;
  onClose: () => void;
  onStudentAdded: () => void;
}

export default function AddStudentDialog({ open, onClose, onStudentAdded }: AddStudentDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState<Date>();
  const [gender, setGender] = useState<number>(0);
  const [selectedClassCode, setSelectedClassCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState<ClassModel[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      const classes = await classService.getClasses();
      setClasses(classes);
    };
    fetchClasses();
  }, []);

  const handleSave = async () => {
    console.log({ name, email, phone, address, birthday, gender, selectedClassCode });
    if (!name || !email || !phone || !address || !birthday || !selectedClassCode) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const studentData = {
        full_name: name,
        email,
        phone,
        address,
        birth_date: format(birthday, "yyyy-MM-dd"),
        gender,
        class_id: parseInt(selectedClassCode),
      };
      console.log(studentData);

      await studentService.addStudent(studentData);
      toast.success("Student added successfully");
      onStudentAdded();
      onClose();

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setBirthday(undefined);
      setGender(0);
      setSelectedClassCode("");
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Failed to add student");
    } finally {
      setIsLoading(false);
    }
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
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              className="col-span-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input id="phone" className="col-span-3" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input id="address" className="col-span-3" value={address} onChange={(e) => setAddress(e.target.value)} />
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
            <Label className="text-right">Gender</Label>
            <select
              value={gender}
              onChange={(e) => setGender(Number(e.target.value))}
              className="col-span-3 rounded border p-2"
            >
              <option value={0}>Female</option>
              <option value={1}>Male</option>
              <option value={2}>Other</option>
            </select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Class Code</Label>
            <select
              value={selectedClassCode}
              onChange={(e) => {
                setSelectedClassCode(e.target.value);
                console.log(selectedClassCode);
              }}
              className="col-span-3 rounded border p-2"
            >
              <option value="">Select a class</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.class_code}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
