import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Mail, MessageSquare, Target, TrendingDown } from "lucide-react";

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

interface LowPerformersSectionProps {
  students: Student[];
}

export default function LowPerformersSection({ students }: LowPerformersSectionProps) {
  const lowPerformers = students.filter((s) => s.averageScore < 5.0);
  const atRiskStudents = students.filter((s) => s.averageScore < 4.0);

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
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Performers</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowPerformers.length}</div>
            <p className="text-xs text-muted-foreground">Students &lt; 5.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{atRiskStudents.length}</div>
            <p className="text-xs text-muted-foreground">Students &lt; 4.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {lowPerformers.length > 0
                ? (lowPerformers.reduce((sum, s) => sum + s.averageScore, 0) / lowPerformers.length).toFixed(1)
                : "0.0"}
            </div>
            <p className="text-xs text-muted-foreground">Low performers average</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Performers List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Low Performing Students</CardTitle>
              <CardDescription>Students with scores below 5.0 who need attention</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Send Warning
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lowPerformers.length > 0 ? (
              lowPerformers.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
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
                      <div className="text-xs text-muted-foreground">Last activity: {student.lastActivity}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-red-600">{student.averageScore}</div>
                    <Badge className={getGradeColor(student.grade)}>{student.grade}</Badge>
                    <div className="text-xs text-muted-foreground mt-1">Attendance: {student.attendance}%</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <TrendingDown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Low Performers</h3>
                <p className="text-gray-600">All students are performing above the 5.0 threshold.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Intervention Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Intervention Actions</CardTitle>
          <CardDescription>Actions to help low-performing students improve</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Immediate Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Warning Emails
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Schedule Parent Meetings
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Create Improvement Plans
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Support Resources</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Assign Academic Advisors
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Recommend Tutoring
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Monitor Progress
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>Analysis of low-performing students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Students with scores &lt; 5.0:</span>
              <span className="text-sm font-medium">{lowPerformers.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Students with scores &lt; 4.0:</span>
              <span className="text-sm font-medium">{atRiskStudents.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Average attendance of low performers:</span>
              <span className="text-sm font-medium">
                {lowPerformers.length > 0
                  ? Math.round(lowPerformers.reduce((sum, s) => sum + s.attendance, 0) / lowPerformers.length)
                  : 0}
                %
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Students with incomplete assignments:</span>
              <span className="text-sm font-medium">
                {lowPerformers.filter((s) => s.assignmentsCompleted < s.totalAssignments).length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
