import React, { useMemo, useState } from "react";

import { CourseDetailModel } from "@/app/api/model/Course";
import { CourseScore, StudentScore } from "@/app/api/model/CourseScore";
import { GradingFormulaModel } from "@/app/api/model/GradingFormulaModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, BookOpen, Download, FileSpreadsheet, Users } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface ExportDataDialogProps {
  open: boolean;
  onClose: () => void;
  subjectClass: CourseDetailModel;
  courseScores: CourseScore[];
  gradingFormula: GradingFormulaModel | null;
  studentStats: {
    students: StudentScore[];
    totalStudents: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    belowAverage: number;
    aboveAverage: number;
  };
}

export default function ExportDataDialog({
  open,
  onClose,
  subjectClass,
  courseScores,
  gradingFormula,
  studentStats,
}: ExportDataDialogProps) {
  const [isExporting, setIsExporting] = useState(false);

  // Helper function to safely convert values to strings
  const safeStringify = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toString();
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch {
        return "N/A";
      }
    }
    return String(value);
  };

  // Prepare class information data
  const classInformationData = useMemo(() => {
    return {
      "Class ID": subjectClass.id,
      "Class Name": safeStringify(subjectClass.name),
      Description: safeStringify(subjectClass.description),
      Credits: subjectClass.credits,
      Location: safeStringify(subjectClass.location),
      Enrolled: subjectClass.enrolled,
      "Is Active": subjectClass.is_active ? "Yes" : "No",
      "Allow Grade Editing": (subjectClass as any).allow_grade_editing ? "Yes" : "No",
      Semester: safeStringify(subjectClass.semester),
      Type: safeStringify(subjectClass.type),
      Instructor: safeStringify(subjectClass.instructor),
      "Start Date": subjectClass.start_date ? new Date(subjectClass.start_date).toLocaleDateString() : "N/A",
      "End Date": subjectClass.end_date ? new Date(subjectClass.end_date).toLocaleDateString() : "N/A",
      "Created At": subjectClass.created_at ? new Date(subjectClass.created_at).toLocaleDateString() : "N/A",
      "Updated At": subjectClass.updated_at ? new Date(subjectClass.updated_at).toLocaleDateString() : "N/A",
      "Subject Name": safeStringify(subjectClass.subject?.name),
      "Subject Credits": subjectClass.subject?.credits || "N/A",
      "Subject Description": safeStringify(subjectClass.subject?.description),
      "Subject Faculty ID": subjectClass.subject?.faculty_id || "N/A",
      "Total Students": studentStats.totalStudents,
      "Average Score": studentStats.averageScore.toFixed(2),
      "Highest Score": studentStats.highestScore.toFixed(2),
      "Lowest Score": studentStats.lowestScore.toFixed(2),
      "Above Average": studentStats.aboveAverage,
      "Below Average": studentStats.belowAverage,
      "Grading Formula": safeStringify(gradingFormula?.name),
    };
  }, [subjectClass, studentStats, gradingFormula]);

  // Prepare class members data
  const classMembersData = useMemo(() => {
    if (!subjectClass.members) return [];

    return subjectClass.members
      .filter((member) => member.role === "Student" && member.is_active)
      .map((member) => {
        const studentScore = courseScores.find((score) => score.userId === member.user.id);
        return {
          "Member ID": member.id,
          "Classroom ID": member.classroom_id,
          "User ID": member.user.id,
          Username: safeStringify(member.user.username),
          "Full Name": safeStringify(member.user.full_name),
          Email: safeStringify(member.user.email),
          Role: safeStringify(member.user.role),
          "Is Active": member.user.isActive ? "Yes" : "No",
          "Is Deleted": member.user.isDeleted ? "Yes" : "No",
          "Faculty ID": member.user.faculty_id,
          "User Created At": member.user.created_at ? new Date(member.user.created_at).toLocaleDateString() : "N/A",
          "User Updated At": member.user.updated_at ? new Date(member.user.updated_at).toLocaleDateString() : "N/A",
          "Joined Date": member.joined_at ? new Date(member.joined_at).toLocaleDateString() : "N/A",
          "Member Status": member.is_active ? "Active" : "Inactive",
          "Member Role": safeStringify(member.role),
        };
      });
  }, [subjectClass.members, courseScores]);

  // Prepare class scores data
  const classScoresData = useMemo(() => {
    if (!subjectClass.members) return [];

    return subjectClass.members
      .filter((member) => member.role === "Student" && member.is_active)
      .map((member) => {
        const studentScore = courseScores.find((score) => score.userId === member.user.id);
        const studentStat = studentStats.students.find((s) => s.id === member.user.id.toString());

        return {
          "Member ID": member.id,
          "User ID": member.user.id,
          Username: safeStringify(member.user.username),
          "Full Name": safeStringify(member.user.full_name),
          Email: safeStringify(member.user.email),
          "QT1 Grade": safeStringify(studentScore?.qt1Grade),
          "QT2 Grade": safeStringify(studentScore?.qt2Grade),
          "Midterm Grade": safeStringify(studentScore?.midtermGrade),
          "Final Grade": safeStringify(studentScore?.finalGrade),
          "Last Updated": studentScore?.updatedAt ? new Date(studentScore.updatedAt).toLocaleDateString() : "N/A",
        };
      });
  }, [subjectClass.members, courseScores, studentStats.students]);

  const exportToExcel = async (data: any[], filename: string, sheetName: string) => {
    try {
      setIsExporting(true);

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

      // Create blob and download
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.xlsx`;
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);

      toast.success(`${filename} exported successfully!`);
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAllData = async () => {
    try {
      setIsExporting(true);

      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Add Class Information sheet
      const classInfoSheet = XLSX.utils.json_to_sheet([classInformationData]);
      XLSX.utils.book_append_sheet(workbook, classInfoSheet, "Class Information");

      // Add Class Members sheet
      const membersSheet = XLSX.utils.json_to_sheet(classMembersData);
      XLSX.utils.book_append_sheet(workbook, membersSheet, "Class Members");

      // Add Class Scores sheet
      const scoresSheet = XLSX.utils.json_to_sheet(classScoresData);
      XLSX.utils.book_append_sheet(workbook, scoresSheet, "Class Scores");

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

      // Create blob and download
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${subjectClass.name.replace(/[^a-z0-9]/gi, "_")}_Complete_Data.xlsx`;
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);

      toast.success("Complete course data exported successfully!");
    } catch (error) {
      console.error("Error exporting all data:", error);
      toast.error("Failed to export complete data");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Export Course Data</DialogTitle>
          <DialogDescription>
            Export class information, member details, and student scores to Excel files.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="class-info" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="class-info" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Class Information
              </TabsTrigger>
              <TabsTrigger value="class-members" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Class Members
              </TabsTrigger>
              <TabsTrigger value="class-scores" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Class Scores
              </TabsTrigger>
            </TabsList>

            <TabsContent value="class-info" className="mt-4 h-full overflow-hidden">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Class Information</CardTitle>
                  <CardDescription>Basic information about the class, subject, and statistics</CardDescription>
                </CardHeader>
                <CardContent className="overflow-auto">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(classInformationData).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b">
                          <span className="font-medium text-gray-600">{key}:</span>
                          <span className="text-gray-900">{safeStringify(value)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4">
                      <Button
                        onClick={() =>
                          exportToExcel(
                            [classInformationData],
                            `${subjectClass.name}_Class_Information`,
                            "Class Information",
                          )
                        }
                        disabled={isExporting}
                        className="w-full"
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Export Class Information
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="class-members" className="mt-4 h-full overflow-hidden">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Class Members</CardTitle>
                  <CardDescription>Detailed information about all enrolled students</CardDescription>
                </CardHeader>
                <CardContent className="overflow-auto">
                  <div className="space-y-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User ID</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Faculty ID</TableHead>
                            <TableHead>Joined Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {classMembersData.map((member, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-mono text-sm">{safeStringify(member["User ID"])}</TableCell>
                              <TableCell className="font-mono text-sm">{safeStringify(member["Username"])}</TableCell>
                              <TableCell>{safeStringify(member["Full Name"])}</TableCell>
                              <TableCell>{safeStringify(member["Email"])}</TableCell>
                              <TableCell>{safeStringify(member["Role"])}</TableCell>
                              <TableCell>{safeStringify(member["Faculty ID"])}</TableCell>
                              <TableCell>{safeStringify(member["Joined Date"])}</TableCell>
                              <TableCell>
                                <Badge variant={member["Member Status"] === "Active" ? "default" : "secondary"}>
                                  {safeStringify(member["Member Status"])}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="pt-4">
                      <Button
                        onClick={() =>
                          exportToExcel(classMembersData, `${subjectClass.name}_Class_Members`, "Class Members")
                        }
                        disabled={isExporting}
                        className="w-full"
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Export Class Members
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="class-scores" className="mt-4 h-full overflow-hidden">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Class Scores</CardTitle>
                  <CardDescription>Student performance data including grades and scores</CardDescription>
                </CardHeader>
                <CardContent className="overflow-auto">
                  <div className="space-y-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User ID</TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>QT1</TableHead>
                            <TableHead>QT2</TableHead>
                            <TableHead>Midterm</TableHead>
                            <TableHead>Final</TableHead>
                            <TableHead>Last Updated</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {classScoresData.map((score, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-mono text-sm">{safeStringify(score["User ID"])}</TableCell>
                              <TableCell>{safeStringify(score["Full Name"])}</TableCell>
                              <TableCell>{safeStringify(score["QT1 Grade"])}</TableCell>
                              <TableCell>{safeStringify(score["QT2 Grade"])}</TableCell>
                              <TableCell>{safeStringify(score["Midterm Grade"])}</TableCell>
                              <TableCell>{safeStringify(score["Final Grade"])}</TableCell>
                              <TableCell>{safeStringify(score["Last Updated"])}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="pt-4">
                      <Button
                        onClick={() =>
                          exportToExcel(classScoresData, `${subjectClass.name}_Class_Scores`, "Class Scores")
                        }
                        disabled={isExporting}
                        className="w-full"
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Export Class Scores
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={exportAllData} disabled={isExporting} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? "Exporting..." : "Export All Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
