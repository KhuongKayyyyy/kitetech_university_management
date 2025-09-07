"use client";

import React, { useEffect, useState } from "react";

import { UserModel } from "@/app/api/model/UserModel";
import { userService } from "@/app/api/services/userService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search, UserCheck, Users } from "lucide-react";
import { toast } from "sonner";

interface AvailableStudentToAddProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onStudentsSelected: (selectedStudents: UserModel[]) => void;
  alreadySelectedStudentIds?: number[];
  title?: string;
  description?: string;
}

export default function AvailableStudentToAdd({
  isOpen,
  onOpenChange,
  onStudentsSelected,
  alreadySelectedStudentIds = [],
  title = "Select Students",
  description = "Choose students to add to the registration period",
}: AvailableStudentToAddProps) {
  const [students, setStudents] = useState<UserModel[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<UserModel[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch students when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen]);

  // Filter students based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        (student) =>
          student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredStudents(filtered);
    }
  }, [students, searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const allUsers = await userService.getUsers();

      // Filter only students and exclude already selected ones
      const studentUsers = allUsers.filter(
        (user: UserModel) =>
          user.role?.toLowerCase() === "student" &&
          user.isActive !== false &&
          !alreadySelectedStudentIds.includes(user.id || 0),
      );

      setStudents(studentUsers);
      setFilteredStudents(studentUsers);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (student: UserModel, isSelected: boolean) => {
    if (isSelected) {
      setSelectedStudents((prev) => [...prev, student]);
    } else {
      setSelectedStudents((prev) => prev.filter((s) => s.id !== student.id));
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedStudents(filteredStudents);
    } else {
      setSelectedStudents([]);
    }
  };

  const handleConfirm = () => {
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    onStudentsSelected(selectedStudents);
    setSelectedStudents([]);
    setSearchTerm("");
    onOpenChange(false);
    toast.success(`${selectedStudents.length} student(s) selected successfully!`);
  };

  const handleCancel = () => {
    setSelectedStudents([]);
    setSearchTerm("");
    onOpenChange(false);
  };

  const isAllSelected = filteredStudents.length > 0 && selectedStudents.length === filteredStudents.length;
  const isIndeterminate = selectedStudents.length > 0 && selectedStudents.length < filteredStudents.length;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-6xl max-h-[80vh] overflow-hidden flex flex-col w-[1200px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Search and Stats */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students by name, username, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <UserCheck className="h-4 w-4" />
              <span>
                {selectedStudents.length} of {filteredStudents.length} selected
              </span>
            </div>
          </div>

          {/* Students Table */}
          <div className="flex-1 overflow-auto border rounded-lg">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading students...</span>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Users className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No students found</p>
                <p className="text-sm">
                  {searchTerm ? "Try adjusting your search criteria" : "No students available to select"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        ref={(el) => {
                          if (el && el instanceof HTMLInputElement) {
                            el.indeterminate = isIndeterminate;
                          }
                        }}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all students"
                      />
                    </TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow
                      key={student.id}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        selectedStudents.some((s) => s.id === student.id) ? "bg-blue-50" : ""
                      }`}
                      onClick={() => {
                        const isSelected = selectedStudents.some((s) => s.id === student.id);
                        handleStudentSelect(student, !isSelected);
                      }}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedStudents.some((s) => s.id === student.id)}
                          onCheckedChange={(checked) => handleStudentSelect(student, !!checked)}
                          aria-label={`Select ${student.full_name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{student.full_name || "N/A"}</TableCell>
                      <TableCell className="text-gray-600">{student.username || "N/A"}</TableCell>
                      <TableCell className="text-gray-600">{student.email || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={student.isActive ? "default" : "secondary"}
                          className={
                            student.isActive
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-gray-100 text-gray-800 border-gray-200"
                          }
                        >
                          {student.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedStudents.length > 0 && (
              <span>
                {selectedStudents.length} student{selectedStudents.length !== 1 ? "s" : ""} selected
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedStudents.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Select Students ({selectedStudents.length})
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
