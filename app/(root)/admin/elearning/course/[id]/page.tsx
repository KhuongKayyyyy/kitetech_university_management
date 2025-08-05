"use client";

import React, { useMemo, useState } from "react";

import { MOCK_SUBJECT_CLASSES, SubjectClassModel } from "@/app/api/model/SubjectClassModel";
import { Button } from "@/components/ui/button";
import ClassAnalyticsCards from "@/components/ui/custom/elearning/ClassAnalyticsCards";
import ClassAnalyticsTab from "@/components/ui/custom/elearning/ClassAnalyticsTab";
import ClassMaterialsTab from "@/components/ui/custom/elearning/ClassMaterialsTab";
import ClassOverviewCards from "@/components/ui/custom/elearning/ClassOverviewCards";
import ClassScheduleTab from "@/components/ui/custom/elearning/ClassScheduleTab";
import StudentManagementTab from "@/components/ui/custom/elearning/StudentManagementTab";
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

export default function SubjectClassDetailPage() {
  const params = useParams();
  const classId = params.id as string;

  // Find the subject class
  const subjectClass = MOCK_SUBJECT_CLASSES.find((cls) => cls.id === classId);

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

  // Calculate student statistics
  const studentStats = useMemo(() => {
    const students = MOCK_STUDENTS.map((student) => {
      const scores = student.scores;
      const assignmentAvg = scores.assignments.reduce((a, b) => a + b, 0) / scores.assignments.length;
      const quizAvg = scores.quizzes.reduce((a, b) => a + b, 0) / scores.quizzes.length;
      const projectAvg = scores.projects.reduce((a, b) => a + b, 0) / scores.projects.length;

      const totalScore =
        assignmentAvg * 0.25 +
        quizAvg * 0.2 +
        scores.midtermExam * 0.2 +
        scores.finalExam * 0.25 +
        scores.participation * 0.05 +
        projectAvg * 0.05;

      return {
        ...student,
        totalScore: Math.round(totalScore * 100) / 100,
        letterGrade: getLetterGrade(totalScore),
        gpa: getGPA(totalScore),
      };
    });

    const totalStudents = students.length;
    const averageScore = students.reduce((sum, student) => sum + student.totalScore, 0) / totalStudents;
    const highestScore = Math.max(...students.map((s) => s.totalScore));
    const lowestScore = Math.min(...students.map((s) => s.totalScore));
    const belowAverage = students.filter((s) => s.totalScore < 5.0).length;
    const aboveAverage = students.filter((s) => s.totalScore >= 5.0).length;

    return {
      students,
      totalStudents,
      averageScore: Math.round(averageScore * 100) / 100,
      highestScore,
      lowestScore,
      belowAverage,
      aboveAverage,
    };
  }, []);

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
          <TabsTrigger value="students">Students & Scores</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <StudentManagementTab students={studentStats.students} subjectClass={subjectClass} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <ClassAnalyticsTab students={studentStats.students} studentStats={studentStats} />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <ClassScheduleTab subjectClass={subjectClass} />
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <ClassMaterialsTab subjectClass={subjectClass} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
