import React, { useMemo, useState } from "react";

import { SubjectClassModel } from "@/app/api/model/SubjectClassModel";
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
import { Filter, MoreHorizontal, Plus, Search } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  scores: {
    assignments: number[];
    quizzes: number[];
    midtermExam: number;
    finalExam: number;
    participation: number;
    projects: number[];
  };
  totalScore: number;
  letterGrade: string;
  gpa: number;
}

interface StudentManagementTabProps {
  students: Student[];
  subjectClass: SubjectClassModel;
}

export default function StudentManagementTab({ students, subjectClass }: StudentManagementTabProps) {
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
      case "highest":
        const highestScore = Math.max(...students.map((s) => s.totalScore));
        filtered = filtered.filter((student) => student.totalScore === highestScore);
        break;
      case "lowest":
        const lowestScore = Math.min(...students.map((s) => s.totalScore));
        filtered = filtered.filter((student) => student.totalScore === lowestScore);
        break;
      case "below-average":
        filtered = filtered.filter((student) => student.totalScore < 5.0);
        break;
      case "above-average":
        filtered = filtered.filter((student) => student.totalScore >= 5.0);
        break;
      case "failing":
        filtered = filtered.filter((student) => student.totalScore < 4.0);
        break;
      case "excellent":
        filtered = filtered.filter((student) => student.totalScore >= 8.0);
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "score-high":
          return b.totalScore - a.totalScore;
        case "score-low":
          return a.totalScore - b.totalScore;
        case "name":
          return a.name.localeCompare(b.name);
        case "gpa":
          return b.gpa - a.gpa;
        case "grade":
          return a.letterGrade.localeCompare(b.letterGrade);
        default:
          return 0;
      }
    });

    return filtered;
  }, [students, searchTerm, filterBy, sortBy]);

  function getGradeColor(grade: string): string {
    switch (grade) {
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
            <CardTitle>Student Management</CardTitle>
            <CardDescription>View and manage student scores and performance</CardDescription>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Student
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
              <SelectItem value="highest">Highest Score</SelectItem>
              <SelectItem value="lowest">Lowest Score</SelectItem>
              <SelectItem value="below-average">Below Average (&lt;5.0)</SelectItem>
              <SelectItem value="above-average">Above Average (≥5.0)</SelectItem>
              <SelectItem value="failing">Failing (&lt;4.0)</SelectItem>
              <SelectItem value="excellent">Excellent (≥8.0)</SelectItem>
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
              <SelectItem value="grade">Grade</SelectItem>
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
                <TableHead>Total Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>GPA</TableHead>
                <TableHead>Performance</TableHead>
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
                    <div className="font-medium">{student.totalScore}</div>
                    <div className="text-sm text-muted-foreground">out of 10.0</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getGradeColor(student.letterGrade)}>{student.letterGrade}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{student.gpa}</div>
                    <div className="text-sm text-muted-foreground">4.0 scale</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${student.totalScore * 10}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{student.totalScore * 10}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.totalScore >= 8.0 ? (
                      <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                    ) : student.totalScore >= 5.0 ? (
                      <Badge className="bg-blue-100 text-blue-800">Passing</Badge>
                    ) : student.totalScore >= 4.0 ? (
                      <Badge className="bg-yellow-100 text-yellow-800">At Risk</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Failing</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Scores</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem>View Progress</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Remove Student</DropdownMenuItem>
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
