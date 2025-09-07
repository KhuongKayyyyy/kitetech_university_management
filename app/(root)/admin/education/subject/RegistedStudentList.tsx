"use client";

import React, { useEffect, useState } from "react";

import { RegisteredStudent } from "@/app/api/model/RegistrationPeriodModel";
import { subjectClassService } from "@/app/api/services/courseService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Mail, User, Users, X } from "lucide-react";
import { toast } from "sonner";

interface RegistedStudentListProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  availableCourseId: string;
  courseName: string;
}

export default function RegistedStudentList({
  isOpen,
  onOpenChange,
  availableCourseId,
  courseName,
}: RegistedStudentListProps) {
  const [students, setStudents] = useState<RegisteredStudent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && availableCourseId) {
      fetchRegisteredStudents();
    }
  }, [isOpen, availableCourseId]);

  const fetchRegisteredStudents = async () => {
    try {
      setLoading(true);
      const data = await subjectClassService.getRegistedStudentList(availableCourseId);
      setStudents(data || []);
    } catch (error) {
      console.error("Error fetching registered students:", error);
      toast.error("Failed to load registered students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (isActive: boolean) => {
    if (isActive) {
      return "bg-green-100 text-green-800 border-green-200";
    } else {
      return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Registered Students - {courseName}
          </DialogTitle>
          <DialogDescription>View students registered for this course</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No students registered for this course yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Registration Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {students.filter((s) => s.isActive).length}
                      </div>
                      <div className="text-sm text-gray-600">Active Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {students.filter((s) => !s.isActive).length}
                      </div>
                      <div className="text-sm text-gray-600">Inactive Students</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Students Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Student List</CardTitle>
                  <CardDescription>
                    {students.length} student{students.length !== 1 ? "s" : ""} registered
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto max-h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Created At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <div>
                                  <div className="font-medium">{student.full_name}</div>
                                  <div className="text-sm text-gray-500">@{student.username}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{student.username}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-gray-400" />
                                {student.email}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(student.isActive)}>
                                {student.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{student.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                {formatDate(student.created_at)}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
