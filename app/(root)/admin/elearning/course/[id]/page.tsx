"use client";

import React, { useEffect, useMemo, useState } from "react";

import { CourseDetailModel } from "@/app/api/model/Course";
import { CourseScore, StudentScore } from "@/app/api/model/CourseScore";
import { GradingFormulaModel } from "@/app/api/model/GradingFormulaModel";
import { subjectClassService } from "@/app/api/services/courseService";
import { gradingFormulaService } from "@/app/api/services/gradingFormulaService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ClassAnalyticsCards from "@/components/ui/custom/elearning/ClassAnalyticsCards";
import ClassOverviewCards from "@/components/ui/custom/elearning/ClassOverviewCards";
import ClassScheduleTab from "@/components/ui/custom/elearning/ClassScheduleTab";
import ScoreManagementTab from "@/components/ui/custom/elearning/ScoreManagementTab";
import StudentManagementTab from "@/components/ui/custom/elearning/StudentManagementTab";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  Clock,
  Download,
  Edit,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";
import { toast, Toaster } from "sonner";

// Mock student data for demonstration
const MOCK_STUDENTS = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@student.edu",
    avatar: "",
    scores: {
      assignments: [85, 90, 88],
      quizzes: [92, 87],
      midtermExam: 89,
      finalExam: 91,
      participation: 95,
      projects: [88, 92],
    },
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@student.edu",
    avatar: "",
    scores: {
      assignments: [78, 82, 85],
      quizzes: [80, 85],
      midtermExam: 83,
      finalExam: 87,
      participation: 88,
      projects: [85, 89],
    },
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@student.edu",
    avatar: "",
    scores: {
      assignments: [92, 95, 93],
      quizzes: [94, 96],
      midtermExam: 95,
      finalExam: 94,
      participation: 98,
      projects: [95, 97],
    },
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@student.edu",
    avatar: "",
    scores: {
      assignments: [75, 78, 80],
      quizzes: [77, 79],
      midtermExam: 76,
      finalExam: 78,
      participation: 82,
      projects: [79, 81],
    },
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@student.edu",
    avatar: "",
    scores: {
      assignments: [88, 85, 87],
      quizzes: [86, 89],
      midtermExam: 88,
      finalExam: 90,
      participation: 92,
      projects: [89, 91],
    },
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily.davis@student.edu",
    avatar: "",
    scores: {
      assignments: [70, 72, 75],
      quizzes: [73, 76],
      midtermExam: 72,
      finalExam: 74,
      participation: 78,
      projects: [75, 77],
    },
  },
  {
    id: "7",
    name: "Alex Thompson",
    email: "alex.thompson@student.edu",
    avatar: "",
    scores: {
      assignments: [95, 98, 96],
      quizzes: [97, 99],
      midtermExam: 98,
      finalExam: 97,
      participation: 100,
      projects: [98, 99],
    },
  },
  {
    id: "8",
    name: "Lisa Garcia",
    email: "lisa.garcia@student.edu",
    avatar: "",
    scores: {
      assignments: [82, 85, 83],
      quizzes: [84, 86],
      midtermExam: 85,
      finalExam: 87,
      participation: 89,
      projects: [86, 88],
    },
  },
];

// Skeleton Components
const HeaderSkeleton = () => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <div>
        <Skeleton className="h-9 w-80 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>

    {/* Overview Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Analytics Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const TabContentSkeleton = () => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-80" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-6 w-8" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default function SubjectClassDetailPage() {
  const params = useParams();
  const classId = params.id as string;
  const [subjectClass, setSubjectClass] = useState<CourseDetailModel | null>(null);
  const [courseScores, setCourseScores] = useState<CourseScore[]>([]);
  const [gradingFormula, setGradingFormula] = useState<GradingFormulaModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingScores, setIsLoadingScores] = useState(false);
  const [isLoadingFormula, setIsLoadingFormula] = useState(false);

  // Fetch course scores
  const fetchCourseScores = async (courseId: number) => {
    try {
      setIsLoadingScores(true);
      const scores = await subjectClassService.getCourseScoreByCourseId(courseId);
      setCourseScores(scores);
    } catch (error) {
      console.error("Error fetching course scores:", error);
      setCourseScores([]);
    } finally {
      setIsLoadingScores(false);
    }
  };

  // Fetch grading formula
  const fetchGradingFormula = async (formulaId: number) => {
    try {
      setIsLoadingFormula(true);
      const formula = await gradingFormulaService.getGradingFormula(formulaId.toString());
      setGradingFormula(formula);
    } catch (error) {
      console.error("Error fetching grading formula:", error);
      setGradingFormula(null);
    } finally {
      setIsLoadingFormula(false);
    }
  };

  // Handle score updates
  const handleScoreUpdate = async (scoreId: number, updatedScore: Partial<CourseScore>) => {
    try {
      // Call API to update the score
      await subjectClassService.updateCourseScore(scoreId, {
        qt1Grade: updatedScore.qt1Grade,
        qt2Grade: updatedScore.qt2Grade,
        midtermGrade: updatedScore.midtermGrade,
        finalGrade: updatedScore.finalGrade,
      });

      // Update local state
      setCourseScores((prevScores) =>
        prevScores.map((score) =>
          score.id === scoreId ? { ...score, ...updatedScore, updatedAt: new Date().toISOString() } : score,
        ),
      );
      console.log("Score updated successfully:", scoreId, updatedScore);
    } catch (error) {
      console.error("Error updating score:", error);
      // You could add a toast notification here for error feedback
    }
  };

  // Fetch the course data from API
  const fetchCourse = async (showSuccessToast = false) => {
    try {
      setIsLoading(true);
      const courseData = await subjectClassService.getSubjectClass(parseInt(classId));
      setSubjectClass(courseData);

      // Fetch course scores and grading formula after getting course data
      if (courseData) {
        await fetchCourseScores(courseData.id);
        // Fetch grading formula if available
        if (courseData.subject?.gradingFormulaId) {
          await fetchGradingFormula(courseData.subject.gradingFormulaId);
        }
      }

      if (showSuccessToast) {
        toast.success("Course data refreshed successfully!");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      setSubjectClass(null);
      if (showSuccessToast) {
        toast.error("Failed to refresh course data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchCourse();
    }
  }, [classId]);

  // Calculate student statistics from real course members and scores
  const studentStats = useMemo(() => {
    if (!subjectClass?.members) {
      return {
        students: [],
        totalStudents: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        belowAverage: 0,
        aboveAverage: 0,
      };
    }

    // Get students from course members (filter by role "Student")
    const students = subjectClass.members
      .filter((member) => member.role === "Student" && member.is_active)
      .map((member) => {
        // Find the student's score data
        const studentScore = courseScores.find((score) => score.userId === member.user.id);

        let scores: StudentScore["scores"];
        let totalScore: number = 0;

        if (studentScore) {
          // Use real score data from API
          const qt1 = parseFloat(studentScore.qt1Grade) || 0;
          const qt2 = parseFloat(studentScore.qt2Grade) || 0;
          const midterm = parseFloat(studentScore.midtermGrade) || 0;
          const final = parseFloat(studentScore.finalGrade) || 0;

          // Calculate participation and projects based on other scores
          const participation = Math.min(10, (qt1 + qt2 + midterm + final) / 4 + 1);
          const projects = [qt1, qt2];

          scores = {
            assignments: [qt1, qt2],
            quizzes: [qt1, qt2],
            midtermExam: midterm,
            finalExam: final,
            participation: participation,
            projects: projects,
          };

          // Calculate total score with weights from grading formula
          let totalScore = 0;
          if (gradingFormula?.gradeTypes) {
            // Use actual grading formula weights
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
            // Convert to 0-10 scale (scores are already on 0-10 scale, weights are percentages)
            totalScore = totalScore; // No conversion needed as scores are already 0-10
          } else {
            // Fallback to default weights if no grading formula
            const assignmentAvg = (qt1 + qt2) / 2;
            const quizAvg = (qt1 + qt2) / 2;
            const projectAvg = (qt1 + qt2) / 2;

            totalScore =
              assignmentAvg * 0.25 +
              quizAvg * 0.2 +
              midterm * 0.2 +
              final * 0.25 +
              participation * 0.05 +
              projectAvg * 0.05;
          }
        } else {
          // Fallback to mock data if no score found
          const mockScores = {
            assignments: [85, 90, 88],
            quizzes: [92, 87],
            midtermExam: 89,
            finalExam: 91,
            participation: 95,
            projects: [88, 92],
          };

          const assignmentAvg = mockScores.assignments.reduce((a, b) => a + b, 0) / mockScores.assignments.length;
          const quizAvg = mockScores.quizzes.reduce((a, b) => a + b, 0) / mockScores.quizzes.length;
          const projectAvg = mockScores.projects.reduce((a, b) => a + b, 0) / mockScores.projects.length;

          totalScore =
            assignmentAvg * 0.25 +
            quizAvg * 0.2 +
            mockScores.midtermExam * 0.2 +
            mockScores.finalExam * 0.25 +
            mockScores.participation * 0.05 +
            projectAvg * 0.05;

          scores = mockScores;
        }

        return {
          id: member.user.id.toString(),
          name: member.user.full_name,
          email: member.user.email,
          avatar: "",
          scores: scores,
          totalScore: Math.round(totalScore * 100) / 100,
          letterGrade: getLetterGrade(totalScore),
          gpa: getGPA(totalScore),
        };
      });

    const totalStudents = students.length;
    const averageScore =
      totalStudents > 0 ? students.reduce((sum, student) => sum + student.totalScore, 0) / totalStudents : 0;
    const highestScore = totalStudents > 0 ? Math.max(...students.map((s) => s.totalScore)) : 0;
    const lowestScore = totalStudents > 0 ? Math.min(...students.map((s) => s.totalScore)) : 0;
    const belowAverage = students.filter((s) => s.totalScore < averageScore).length;
    const aboveAverage = students.filter((s) => s.totalScore >= averageScore).length;

    return {
      students,
      totalStudents,
      averageScore: Math.round(averageScore * 100) / 100,
      highestScore,
      lowestScore,
      belowAverage,
      aboveAverage,
    };
  }, [subjectClass, courseScores, gradingFormula]);

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <HeaderSkeleton />

        {/* Main Content Skeleton */}
        <div className="space-y-4">
          {/* Tabs Skeleton */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
          </div>

          <TabContentSkeleton />
        </div>
      </div>
    );
  }

  if (!subjectClass) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Class Not Found</h2>
          <p className="text-gray-600">The requested class could not be found.</p>
        </div>
      </div>
    );
  }

  function getLetterGrade(score: number): string {
    if (score >= 9.0) return "A";
    if (score >= 8.0) return "B+";
    if (score >= 7.0) return "B";
    if (score >= 6.0) return "C+";
    if (score >= 5.0) return "C";
    if (score >= 4.0) return "D+";
    if (score >= 3.0) return "D";
    return "F";
  }

  function getGPA(score: number): number {
    if (score >= 9.0) return 4.0;
    if (score >= 8.0) return 3.5;
    if (score >= 7.0) return 3.0;
    if (score >= 6.0) return 2.5;
    if (score >= 5.0) return 2.0;
    if (score >= 4.0) return 1.5;
    if (score >= 3.0) return 1.0;
    return 0.0;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{subjectClass.name}</h1>
            <p className="text-gray-600 mt-1">{subjectClass.subject?.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                if (subjectClass) {
                  try {
                    await fetchCourseScores(subjectClass.id);
                    toast.success("Scores refreshed successfully!");
                  } catch (error) {
                    toast.error("Failed to refresh scores");
                  }
                }
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Refresh Scores
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit Class
            </Button>
          </div>
        </div>

        {/* Class Overview Cards */}
        <ClassOverviewCards subjectClass={subjectClass} studentStats={studentStats} />

        {/* Analytics Cards */}
        <ClassAnalyticsCards studentStats={studentStats} />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="score-management">Score Management</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <StudentManagementTab
            students={studentStats.students}
            subjectClass={subjectClass}
            onStudentAdded={() => {
              toast.success("Students added successfully! Refreshing course data...");
              fetchCourse(true);
            }}
          />
        </TabsContent>

        <TabsContent value="score-management" className="space-y-4">
          {isLoadingScores ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading score management data...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ScoreManagementTab
              courseScores={courseScores}
              subjectClass={subjectClass}
              gradingFormula={gradingFormula}
              onScoreUpdate={handleScoreUpdate}
            />
          )}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <ClassScheduleTab subjectClass={subjectClass} />
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
}
