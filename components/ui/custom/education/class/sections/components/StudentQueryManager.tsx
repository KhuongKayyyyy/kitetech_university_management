import React, { useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Eye, Filter, Mail, MessageSquare, MoreHorizontal, Search } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  averageScore: number;
  totalClasses: number;
  registeredClasses: number;
  lastActivity: string;
  status: "active" | "inactive" | "warning" | "excellent";
  grade: string;
  gpa: number;
  attendance: number;
  assignmentsCompleted: number;
  totalAssignments: number;
}

interface StudentQueryManagerProps {
  students: Student[];
}

export default function StudentQueryManager({ students }: StudentQueryManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let filtered = students;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply category filter
    switch (filterBy) {
      case "low-score":
        filtered = filtered.filter((student) => student.averageScore < 5.0);
        break;
      case "excellent":
        filtered = filtered.filter((student) => student.averageScore >= 8.0);
        break;
      case "at-risk":
        filtered = filtered.filter((student) => student.averageScore < 4.0);
        break;
      case "unregistered":
        filtered = filtered.filter((student) => student.registeredClasses < student.totalClasses);
        break;
      case "low-attendance":
        filtered = filtered.filter((student) => student.attendance < 70);
        break;
      case "incomplete-assignments":
        filtered = filtered.filter((student) => student.assignmentsCompleted < student.totalAssignments);
        break;
      case "warning":
        filtered = filtered.filter((student) => student.status === "warning");
        break;
      case "excellent-status":
        filtered = filtered.filter((student) => student.status === "excellent");
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "score-high":
          return b.averageScore - a.averageScore;
        case "score-low":
          return a.averageScore - b.averageScore;
        case "name":
          return a.name.localeCompare(b.name);
        case "gpa":
          return b.gpa - a.gpa;
        case "attendance":
          return b.attendance - a.attendance;
        case "registration":
          return b.registeredClasses / b.totalClasses - a.registeredClasses / a.totalClasses;
        default:
          return 0;
      }
    });

    return filtered;
  }, [students, searchTerm, filterBy, sortBy]);

  function getStatusColor(status: string): string {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getGradeColor(grade: string): string {
    switch (grade) {
      case "A+":
        return "bg-green-100 text-green-800";
      case "A":
        return "bg-green-100 text-green-800";
      case "B+":
        return "bg-blue-100 text-blue-800";
      case "B":
        return "bg-blue-100 text-blue-800";
      case "C+":
        return "bg-yellow-100 text-yellow-800";
      case "C":
        return "bg-yellow-100 text-yellow-800";
      case "D+":
        return "bg-orange-100 text-orange-800";
      case "D":
        return "bg-orange-100 text-orange-800";
      case "F":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Student Query Manager</CardTitle>
            <CardDescription>Advanced filtering and querying for student management</CardDescription>
          </div>
          <Button>
            <Mail className="w-4 h-4 mr-2" />
            Send Bulk Message
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              <SelectItem value="low-score">Low Score (&lt;5.0)</SelectItem>
              <SelectItem value="excellent">Excellent (≥8.0)</SelectItem>
              <SelectItem value="at-risk">At Risk (&lt;4.0)</SelectItem>
              <SelectItem value="unregistered">Unregistered</SelectItem>
              <SelectItem value="low-attendance">Low Attendance (&lt;70%)</SelectItem>
              <SelectItem value="incomplete-assignments">Incomplete Assignments</SelectItem>
              <SelectItem value="warning">Warning Status</SelectItem>
              <SelectItem value="excellent-status">Excellent Status</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="score-high">Score (High to Low)</SelectItem>
              <SelectItem value="score-low">Score (Low to High)</SelectItem>
              <SelectItem value="gpa">GPA</SelectItem>
              <SelectItem value="attendance">Attendance</SelectItem>
              <SelectItem value="registration">Registration Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span>
              Showing {filteredStudents.length} of {students.length} students
            </span>
            <span className="text-muted-foreground">
              {filterBy !== "all" && `Filtered by: ${filterBy.replace("-", " ")}`}
            </span>
          </div>
        </div>

        {/* Students Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Average Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Registration</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{student.averageScore}</div>
                    <div className="text-sm text-muted-foreground">GPA: {student.gpa}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getGradeColor(student.grade)}>{student.grade}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {student.registeredClasses}/{student.totalClasses}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round((student.registeredClasses / student.totalClasses) * 100)}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{student.attendance}%</div>
                    <div className="text-sm text-muted-foreground">
                      {student.assignmentsCompleted}/{student.totalAssignments} assignments
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Schedule Meeting
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Send Warning
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No students found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
