import React, { useMemo, useState } from "react";

import { CourseDetailModel } from "@/app/api/model/Course";
import { CourseScore } from "@/app/api/model/CourseScore";
import { GradingFormulaModel } from "@/app/api/model/GradingFormulaModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Filter, MoreHorizontal, Plus, Save, Search, X } from "lucide-react";

interface ScoreManagementTabProps {
  courseScores: CourseScore[];
  subjectClass: CourseDetailModel;
  gradingFormula?: GradingFormulaModel | null;
  onScoreUpdate?: (scoreId: number, updatedScore: Partial<CourseScore>) => void;
}

export default function ScoreManagementTab({
  courseScores,
  subjectClass,
  gradingFormula,
  onScoreUpdate,
}: ScoreManagementTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [editingScore, setEditingScore] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    qt1Grade: "",
    qt2Grade: "",
    midtermGrade: "",
    finalGrade: "",
  });

  // Filter and sort scores
  const filteredScores = useMemo(() => {
    let filtered = courseScores;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (score) =>
          score.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          score.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          score.user.username.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply category filter
    switch (filterBy) {
      case "high-scores":
        filtered = filtered.filter((score) => {
          const avg = parseFloat(calculateAverage(score));
          return avg >= 8.0;
        });
        break;
      case "low-scores":
        filtered = filtered.filter((score) => {
          const avg = parseFloat(calculateAverage(score));
          return avg < 5.0;
        });
        break;
      case "missing-scores":
        filtered = filtered.filter(
          (score) => !score.qt1Grade || !score.qt2Grade || !score.midtermGrade || !score.finalGrade,
        );
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.user.full_name.localeCompare(b.user.full_name);
        case "username":
          return a.user.username.localeCompare(b.user.username);
        case "average-high":
          const avgA = parseFloat(calculateAverage(a));
          const avgB = parseFloat(calculateAverage(b));
          return avgB - avgA;
        case "average-low":
          const avgA2 = parseFloat(calculateAverage(a));
          const avgB2 = parseFloat(calculateAverage(b));
          return avgA2 - avgB2;
        case "qt1":
          return parseFloat(b.qt1Grade) - parseFloat(a.qt1Grade);
        case "qt2":
          return parseFloat(b.qt2Grade) - parseFloat(a.qt2Grade);
        case "midterm":
          return parseFloat(b.midtermGrade) - parseFloat(a.midtermGrade);
        case "final":
          return parseFloat(b.finalGrade) - parseFloat(a.finalGrade);
        default:
          return 0;
      }
    });

    return filtered;
  }, [courseScores, searchTerm, filterBy, sortBy]);

  const handleEditClick = (score: CourseScore) => {
    setEditingScore(score.id);
    setEditForm({
      qt1Grade: score.qt1Grade,
      qt2Grade: score.qt2Grade,
      midtermGrade: score.midtermGrade,
      finalGrade: score.finalGrade,
    });
  };

  const handleSave = () => {
    if (editingScore && onScoreUpdate) {
      onScoreUpdate(editingScore, editForm);
    }
    setEditingScore(null);
    setEditForm({ qt1Grade: "", qt2Grade: "", midtermGrade: "", finalGrade: "" });
  };

  const handleCancel = () => {
    setEditingScore(null);
    setEditForm({ qt1Grade: "", qt2Grade: "", midtermGrade: "", finalGrade: "" });
  };

  const calculateAverage = (score: CourseScore) => {
    const qt1 = parseFloat(score.qt1Grade) || 0;
    const qt2 = parseFloat(score.qt2Grade) || 0;
    const midterm = parseFloat(score.midtermGrade) || 0;
    const final = parseFloat(score.finalGrade) || 0;

    if (gradingFormula?.gradeTypes) {
      // Use actual grading formula weights
      let totalScore = 0;
      for (const gradeType of gradingFormula.gradeTypes) {
        const weight = Number(gradeType.weight || 0) / 100; // Convert percentage to decimal
        switch (gradeType.gradeType) {
          case "QT1":
            totalScore += qt1 * weight;
            break;
          case "QT2":
            totalScore += qt2 * weight;
            break;
          case "GK":
            totalScore += midterm * weight;
            break;
          case "CK":
            totalScore += final * weight;
            break;
        }
      }
      // Scores are already on 0-10 scale, so no conversion needed
      return totalScore.toFixed(2);
    } else {
      // Fallback to simple average
      return ((qt1 + qt2 + midterm + final) / 4).toFixed(2);
    }
  };

  const getGradeColor = (average: number) => {
    if (average >= 8.0) return "bg-green-100 text-green-800";
    if (average >= 6.5) return "bg-blue-100 text-blue-800";
    if (average >= 5.0) return "bg-yellow-100 text-yellow-800";
    if (average >= 4.0) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const getGradeLetter = (average: number) => {
    if (average >= 9.0) return "A";
    if (average >= 8.0) return "B+";
    if (average >= 7.0) return "B";
    if (average >= 6.0) return "C+";
    if (average >= 5.0) return "C";
    if (average >= 4.0) return "D+";
    if (average >= 3.0) return "D";
    return "F";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Score Management</CardTitle>
            <CardDescription>View and manage student scores for all assessments</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Grading Formula Display */}
        {gradingFormula && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Grading Formula</CardTitle>
              <CardDescription>{gradingFormula.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700 mb-2">Grade Components & Weights:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {gradingFormula.gradeTypes?.map((gradeType) => (
                    <div key={gradeType.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-sm">
                        {gradeType.gradeType === "QT1"
                          ? "Quiz 1"
                          : gradeType.gradeType === "QT2"
                            ? "Quiz 2"
                            : gradeType.gradeType === "GK"
                              ? "Midterm"
                              : gradeType.gradeType === "CK"
                                ? "Final"
                                : gradeType.gradeType}
                      </span>
                      <span className="text-sm font-semibold text-blue-600">
                        {Number(gradeType.weight || 0).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
                {gradingFormula.gradeTypes && gradingFormula.gradeTypes.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-800">
                      Total Weight:{" "}
                      {gradingFormula.gradeTypes.reduce((sum, gt) => sum + Number(gt.weight || 0), 0).toFixed(0)}%
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Final Grade ={" "}
                      {gradingFormula.gradeTypes
                        .map(
                          (gt) =>
                            `${
                              gt.gradeType === "QT1"
                                ? "Quiz 1"
                                : gt.gradeType === "QT2"
                                  ? "Quiz 2"
                                  : gt.gradeType === "GK"
                                    ? "Midterm"
                                    : gt.gradeType === "CK"
                                      ? "Final"
                                      : gt.gradeType
                            } × ${Number(gt.weight || 0).toFixed(0)}%`,
                        )
                        .join(" + ")}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students by name, email, or username..."
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
              <SelectItem value="high-scores">High Scores (≥8.0)</SelectItem>
              <SelectItem value="low-scores">Low Scores (&lt;5.0)</SelectItem>
              <SelectItem value="missing-scores">Missing Scores</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="username">Username</SelectItem>
              <SelectItem value="average-high">Average (High to Low)</SelectItem>
              <SelectItem value="average-low">Average (Low to High)</SelectItem>
              <SelectItem value="qt1">Quiz 1</SelectItem>
              <SelectItem value="qt2">Quiz 2</SelectItem>
              <SelectItem value="midterm">Midterm</SelectItem>
              <SelectItem value="final">Final</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span>
              Showing {filteredScores.length} of {courseScores.length} students
            </span>
            <span className="text-muted-foreground">
              {filterBy !== "all" && `Filtered by: ${filterBy.replace("-", " ")}`}
            </span>
          </div>
        </div>

        {/* Scores Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Quiz 1</TableHead>
                <TableHead>Quiz 2</TableHead>
                <TableHead>Midterm</TableHead>
                <TableHead>Final</TableHead>
                <TableHead>Average</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScores.map((score) => {
                const average = parseFloat(calculateAverage(score));
                const isEditing = editingScore === score.id;

                return (
                  <TableRow key={score.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {score.user.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{score.user.full_name}</div>
                          <div className="text-sm text-muted-foreground">{score.user.email}</div>
                          <div className="text-xs text-muted-foreground">@{score.user.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={editForm.qt1Grade}
                          onChange={(e) => setEditForm({ ...editForm, qt1Grade: e.target.value })}
                          className="w-20"
                        />
                      ) : (
                        <span className="font-medium">{score.qt1Grade}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={editForm.qt2Grade}
                          onChange={(e) => setEditForm({ ...editForm, qt2Grade: e.target.value })}
                          className="w-20"
                        />
                      ) : (
                        <span className="font-medium">{score.qt2Grade}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={editForm.midtermGrade}
                          onChange={(e) => setEditForm({ ...editForm, midtermGrade: e.target.value })}
                          className="w-20"
                        />
                      ) : (
                        <span className="font-medium">{score.midtermGrade}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={editForm.finalGrade}
                          onChange={(e) => setEditForm({ ...editForm, finalGrade: e.target.value })}
                          className="w-20"
                        />
                      ) : (
                        <span className="font-medium">{score.finalGrade}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{calculateAverage(score)}</div>
                      <div className="text-sm text-muted-foreground">out of 10.0</div>
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <div className="flex space-x-1">
                          <Button size="sm" onClick={handleSave}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClick(score)}>Edit Scores</DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Export Student</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Remove Score</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {filteredScores.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No scores found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
