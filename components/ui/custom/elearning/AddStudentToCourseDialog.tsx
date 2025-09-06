import React, { useEffect, useState } from "react";

import { UserModel } from "@/app/api/model/UserModel";
import { subjectClassService } from "@/app/api/services/courseService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Plus, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface AddStudentToCourseDialogProps {
  courseId: number;
  onStudentAdded?: () => void;
  children?: React.ReactNode;
}

export default function AddStudentToCourseDialog({
  courseId,
  onStudentAdded,
  children,
}: AddStudentToCourseDialogProps) {
  const [open, setOpen] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<UserModel[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<UserModel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch available students
  const fetchAvailableStudents = async () => {
    try {
      setIsLoading(true);
      const students = await subjectClassService.getAvailableStudentsToAddToCourse(courseId);
      setAvailableStudents(students);
      setFilteredStudents(students);
    } catch (error) {
      console.error("Error fetching available students:", error);
      toast.error("Failed to fetch available students");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter students based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredStudents(availableStudents);
    } else {
      const filtered = availableStudents.filter(
        (student) =>
          student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.username?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, availableStudents]);

  // Fetch students when dialog opens
  useEffect(() => {
    if (open) {
      fetchAvailableStudents();
      setSelectedStudents([]);
      setSearchTerm("");
    }
  }, [open, courseId]);

  const handleStudentToggle = (studentUsername: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentUsername)
        ? prev.filter((username) => username !== studentUsername)
        : [...prev, studentUsername],
    );
  };

  const handleAddStudents = async () => {
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    try {
      setIsAdding(true);
      await subjectClassService.addStudentsToCourse(courseId, selectedStudents);

      toast.success(`Successfully added ${selectedStudents.length} student(s) to the course`);
      setOpen(false);
      setSelectedStudents([]);
      onStudentAdded?.();
    } catch (error) {
      console.error("Error adding students to course:", error);
      toast.error("Failed to add students to course");
    } finally {
      setIsAdding(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((student) => student.username!));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Students
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add Students to Course</DialogTitle>
          <DialogDescription>
            Select students to add to this course. You can search by name, email, or username.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Select All */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleSelectAll} disabled={filteredStudents.length === 0}>
              {selectedStudents.length === filteredStudents.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          {/* Selected Count */}
          {selectedStudents.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Check className="w-4 h-4" />
              {selectedStudents.length} student(s) selected
            </div>
          )}

          {/* Students List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Students</CardTitle>
              <CardDescription>
                {isLoading ? "Loading..." : `${filteredStudents.length} student(s) available`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                        <Skeleton className="h-6 w-6" />
                      </div>
                    ))}
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchTerm ? "No students found matching your search." : "No available students to add."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedStudents.includes(student.username!) ? "bg-blue-50 border-blue-200" : ""
                        }`}
                        onClick={() => handleStudentToggle(student.username!)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>
                            {student.full_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{student.full_name}</div>
                          <div className="text-sm text-muted-foreground truncate">{student.email}</div>
                          <div className="text-xs text-muted-foreground">@{student.username}</div>
                        </div>
                        <div className="flex items-center">
                          {selectedStudents.includes(student.username!) ? (
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddStudents} disabled={selectedStudents.length === 0 || isAdding}>
            {isAdding ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add {selectedStudents.length} Student(s)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
