"use client";

import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Award, BarChart3, BookOpen, Calendar, Target, TrendingUp, Users } from "lucide-react";

import LowPerformersSection from "./components/LowPerformersSection";
// Import specialized components
import PerformanceMetricsCards from "./components/PerformanceMetricsCards";
import StudentAnalyticsSection from "./components/StudentAnalyticsSection";
import StudentQueryManager from "./components/StudentQueryManager";
import TopPerformersSection from "./components/TopPerformersSection";
import UnregisteredStudentsSection from "./components/UnregisteredStudentsSection";

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

interface PerformanceSectionProps {
  classId: string;
}

export default function PerformanceSection({ classId }: PerformanceSectionProps) {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock student data with comprehensive information
  const students: Student[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@student.edu",
      avatar: "",
      averageScore: 8.5,
      totalClasses: 6,
      registeredClasses: 6,
      lastActivity: "2024-01-15",
      status: "excellent",
      grade: "A",
      gpa: 3.8,
      attendance: 95,
      assignmentsCompleted: 12,
      totalAssignments: 12,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@student.edu",
      avatar: "",
      averageScore: 4.2,
      totalClasses: 6,
      registeredClasses: 4,
      lastActivity: "2024-01-10",
      status: "warning",
      grade: "D",
      gpa: 1.8,
      attendance: 65,
      assignmentsCompleted: 8,
      totalAssignments: 12,
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@student.edu",
      avatar: "",
      averageScore: 9.1,
      totalClasses: 6,
      registeredClasses: 6,
      lastActivity: "2024-01-16",
      status: "excellent",
      grade: "A+",
      gpa: 4.0,
      attendance: 98,
      assignmentsCompleted: 12,
      totalAssignments: 12,
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah.wilson@student.edu",
      avatar: "",
      averageScore: 3.8,
      totalClasses: 6,
      registeredClasses: 2,
      lastActivity: "2024-01-08",
      status: "warning",
      grade: "F",
      gpa: 0.8,
      attendance: 45,
      assignmentsCompleted: 4,
      totalAssignments: 12,
    },
    {
      id: "5",
      name: "David Brown",
      email: "david.brown@student.edu",
      avatar: "",
      averageScore: 7.2,
      totalClasses: 6,
      registeredClasses: 5,
      lastActivity: "2024-01-14",
      status: "active",
      grade: "B",
      gpa: 3.2,
      attendance: 88,
      assignmentsCompleted: 10,
      totalAssignments: 12,
    },
    {
      id: "6",
      name: "Emily Davis",
      email: "emily.davis@student.edu",
      avatar: "",
      averageScore: 6.8,
      totalClasses: 6,
      registeredClasses: 6,
      lastActivity: "2024-01-12",
      status: "active",
      grade: "C+",
      gpa: 2.8,
      attendance: 82,
      assignmentsCompleted: 11,
      totalAssignments: 12,
    },
    {
      id: "7",
      name: "Alex Thompson",
      email: "alex.thompson@student.edu",
      avatar: "",
      averageScore: 4.9,
      totalClasses: 6,
      registeredClasses: 3,
      lastActivity: "2024-01-09",
      status: "warning",
      grade: "D+",
      gpa: 1.5,
      attendance: 58,
      assignmentsCompleted: 6,
      totalAssignments: 12,
    },
    {
      id: "8",
      name: "Lisa Garcia",
      email: "lisa.garcia@student.edu",
      avatar: "",
      averageScore: 8.8,
      totalClasses: 6,
      registeredClasses: 6,
      lastActivity: "2024-01-15",
      status: "excellent",
      grade: "A",
      gpa: 3.7,
      attendance: 92,
      assignmentsCompleted: 12,
      totalAssignments: 12,
    },
  ];

  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    const totalStudents = students.length;
    const averageGrade = students.reduce((sum, s) => sum + s.averageScore, 0) / totalStudents;
    const passRate = (students.filter((s) => s.averageScore >= 5.0).length / totalStudents) * 100;
    const lowPerformers = students.filter((s) => s.averageScore < 5.0).length;
    const unregisteredStudents = students.filter((s) => s.registeredClasses < s.totalClasses).length;
    const excellentStudents = students.filter((s) => s.averageScore >= 8.0).length;
    const atRiskStudents = students.filter((s) => s.averageScore < 4.0).length;

    return {
      totalStudents,
      averageGrade: Math.round(averageGrade * 100) / 100,
      passRate: Math.round(passRate * 100) / 100,
      lowPerformers,
      unregisteredStudents,
      excellentStudents,
      atRiskStudents,
    };
  }, [students]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
              <p className="text-gray-600">Comprehensive student performance insights and management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Export Report
            </Button>
            <Button size="sm" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              View Details
            </Button>
          </div>
        </div>

        {/* Enhanced Performance Metrics */}
        <PerformanceMetricsCards performanceMetrics={performanceMetrics} />
      </div>

      {/* Student Management Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="query">Query Students</TabsTrigger>
          <TabsTrigger value="low-performers">Low Performers</TabsTrigger>
          <TabsTrigger value="unregistered">Unregistered</TabsTrigger>
          <TabsTrigger value="top-performers">Top Students</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Key performance indicators and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{performanceMetrics.excellentStudents}</div>
                  <div className="text-sm text-green-600">Excellent Students</div>
                  <div className="text-xs text-green-500">Score ≥ 8.0</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{performanceMetrics.passRate}%</div>
                  <div className="text-sm text-blue-600">Passing Rate</div>
                  <div className="text-xs text-blue-500">Score ≥ 5.0</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{performanceMetrics.atRiskStudents}</div>
                  <div className="text-sm text-red-600">At Risk</div>
                  <div className="text-xs text-red-500">Score &lt; 4.0</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="query" className="space-y-4">
          <StudentQueryManager students={students} />
        </TabsContent>

        <TabsContent value="low-performers" className="space-y-4">
          <LowPerformersSection students={students} />
        </TabsContent>

        <TabsContent value="unregistered" className="space-y-4">
          <UnregisteredStudentsSection students={students} />
        </TabsContent>

        <TabsContent value="top-performers" className="space-y-4">
          <TopPerformersSection students={students} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <StudentAnalyticsSection students={students} performanceMetrics={performanceMetrics} />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Bulk actions for student management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Send Bulk Warning
            </Button>
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Send Registration Reminder
            </Button>
            <Button variant="outline" size="sm">
              <Award className="w-4 h-4 mr-2" />
              Award Top Performers
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Export Performance Report
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Parent Meetings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
