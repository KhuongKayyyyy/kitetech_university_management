import React, { useMemo, useState } from "react";

import { CourseDetailModel } from "@/app/api/model/Course";
import { StudentScore } from "@/app/api/model/CourseScore";
import { subjectClassService } from "@/app/api/services/courseService";
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
import { API_CONFIG } from "@/constants/api_config";
import { Download, Filter, MoreHorizontal, Plus, Search, Upload } from "lucide-react";
import { toast } from "sonner";

import AddStudentToCourseDialog from "./AddStudentToCourseDialog";
import PreviewImportStudentToCourse from "./PreviewImportStudentToCourse";

interface StudentManagementTabProps {
  students: StudentScore[];
  subjectClass: CourseDetailModel;
  showScores?: boolean;
  onStudentAdded?: () => void;
}

interface StudentToCourseImportData {
  id?: string;
  username: string;
  fullName: string;
  email: string;
  studentCode: string;
  status: "valid" | "warning" | "error";
  errors?: string[];
  warnings?: string[];
  rowNumber: number;
}

export default function StudentManagementTab({
  students,
  subjectClass,
  showScores = false,
  onStudentAdded,
}: StudentManagementTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [selectedImportFile, setSelectedImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);

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
      case "recent":
        // Filter students who joined in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter((student) => {
          const studentMember = subjectClass.members?.find(
            (member) => member.user.id.toString() === student.id && member.role === "Student",
          );
          return studentMember?.joined_at && new Date(studentMember.joined_at) > thirtyDaysAgo;
        });
        break;
      case "active":
        // Filter active students (is_active = true)
        filtered = filtered.filter((student) => {
          const studentMember = subjectClass.members?.find(
            (member) => member.user.id.toString() === student.id && member.role === "Student",
          );
          return studentMember?.is_active;
        });
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
        case "joined-date":
          const aMember = subjectClass.members?.find(
            (member) => member.user.id.toString() === a.id && member.role === "Student",
          );
          const bMember = subjectClass.members?.find(
            (member) => member.user.id.toString() === b.id && member.role === "Student",
          );
          const aDate = aMember?.joined_at ? new Date(aMember.joined_at) : new Date(0);
          const bDate = bMember?.joined_at ? new Date(bMember.joined_at) : new Date(0);
          return bDate.getTime() - aDate.getTime(); // Most recent first
        case "email":
          return a.email.localeCompare(b.email);
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

  const downloadStudentsTemplate = async () => {
    try {
      const downloadResponse = await fetch(API_CONFIG.DOWNLOAD_STUDENTS_TO_COURSE_TEMPLATE(subjectClass.id.toString()));
      if (!downloadResponse.ok) {
        throw new Error("Failed to download template");
      }

      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "students_template.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error("Failed to download template");
    }
  };

  const handleImportStudents = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".xlsx,.xls,.csv";
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          setImportLoading(true);
          toast.info("Processing file...");
          setSelectedImportFile(file);
          setShowImportPreview(true);
          toast.success("File processed successfully");
        } catch (error) {
          console.error("Error processing file:", error);
          toast.error("Failed to process file");
        } finally {
          setImportLoading(false);
        }
      }
    };
    fileInput.click();
  };

  const handleConfirmImport = async (validData: StudentToCourseImportData[]) => {
    try {
      setImportLoading(true);
      toast.info("Importing students to course...");

      // Extract usernames from valid data
      const usernames = validData.map((student) => student.username);

      // Call the API to add students to course
      await subjectClassService.addStudentsToCourse(subjectClass.id, usernames);

      toast.success(`Successfully imported ${usernames.length} student(s) to the course`);
      setShowImportPreview(false);
      setSelectedImportFile(null);
      onStudentAdded?.();
    } catch (error) {
      console.error("Error importing students to course:", error);
      toast.error("Failed to import students to course");
    } finally {
      setImportLoading(false);
    }
  };

  const handleCancelImport = () => {
    setShowImportPreview(false);
    setSelectedImportFile(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{showScores ? "Student Scores" : "Student Management"}</CardTitle>
            <CardDescription>
              {showScores ? "View and manage student scores and performance" : "View and manage enrolled students"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {showScores ? (
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Score
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={downloadStudentsTemplate}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
                <Button variant="outline" onClick={handleImportStudents} disabled={importLoading}>
                  <Upload className="w-4 h-4 mr-2" />
                  {importLoading ? "Processing..." : "Import"}
                </Button>
                <AddStudentToCourseDialog courseId={subjectClass.id} onStudentAdded={onStudentAdded} />
              </>
            )}
          </div>
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
              {showScores && (
                <>
                  <SelectItem value="highest">Highest Score</SelectItem>
                  <SelectItem value="lowest">Lowest Score</SelectItem>
                  <SelectItem value="below-average">Below Average (&lt;5.0)</SelectItem>
                  <SelectItem value="above-average">Above Average (≥5.0)</SelectItem>
                  <SelectItem value="failing">Failing (&lt;4.0)</SelectItem>
                  <SelectItem value="excellent">Excellent (≥8.0)</SelectItem>
                </>
              )}
              {!showScores && (
                <>
                  <SelectItem value="recent">Recently Joined</SelectItem>
                  <SelectItem value="active">Active Students</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              {showScores && (
                <>
                  <SelectItem value="score-high">Score (High to Low)</SelectItem>
                  <SelectItem value="score-low">Score (Low to High)</SelectItem>
                  <SelectItem value="gpa">GPA</SelectItem>
                  <SelectItem value="grade">Grade</SelectItem>
                </>
              )}
              {!showScores && (
                <>
                  <SelectItem value="joined-date">Joined Date</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </>
              )}
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
                {showScores && (
                  <>
                    <TableHead>Total Score</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>GPA</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                  </>
                )}
                <TableHead>Joined Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                // Find the student member data from the API to get joined date
                const studentMember = subjectClass.members?.find(
                  (member) => member.user.id.toString() === student.id && member.role === "Student",
                );

                return (
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
                    {showScores && (
                      <>
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
                      </>
                    )}
                    <TableCell>
                      <div className="text-sm">
                        {studentMember?.joined_at ? new Date(studentMember.joined_at).toLocaleDateString() : "N/A"}
                      </div>
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
                          {showScores && <DropdownMenuItem>Edit Scores</DropdownMenuItem>}
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          <DropdownMenuItem>View Progress</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Remove Student</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No students found matching your criteria.</p>
          </div>
        )}
      </CardContent>

      {/* Import Preview Dialog */}
      {selectedImportFile && (
        <PreviewImportStudentToCourse
          open={showImportPreview}
          file={selectedImportFile}
          onConfirm={handleConfirmImport}
          onCancel={handleCancelImport}
          isLoading={importLoading}
        />
      )}
    </Card>
  );
}
