import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Star, Target, TrendingUp, Trophy, Users } from "lucide-react";

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

interface TopPerformersSectionProps {
  students: Student[];
}

export default function TopPerformersSection({ students }: TopPerformersSectionProps) {
  const topPerformers = students.filter((s) => s.averageScore >= 8.0);
  const excellentStudents = students.filter((s) => s.averageScore >= 9.0);

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
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{topPerformers.length}</div>
            <p className="text-xs text-muted-foreground">Students ≥ 8.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excellent Students</CardTitle>
            <Trophy className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{excellentStudents.length}</div>
            <p className="text-xs text-muted-foreground">Students ≥ 9.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {topPerformers.length > 0
                ? (topPerformers.reduce((sum, s) => sum + s.averageScore, 0) / topPerformers.length).toFixed(1)
                : "0.0"}
            </div>
            <p className="text-xs text-muted-foreground">Top performers average</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Top Performing Students</CardTitle>
              <CardDescription>Students with scores of 8.0 or higher</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Award className="w-4 h-4 mr-2" />
              Award Recognition
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.length > 0 ? (
              topPerformers.map((student, index) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-yellow-800">{index + 1}</span>
                    </div>
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
                    <div className="font-medium text-green-600">{student.averageScore}</div>
                    <Badge className={getGradeColor(student.grade)}>{student.grade}</Badge>
                    <div className="text-xs text-muted-foreground mt-1">GPA: {student.gpa}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Top Performers</h3>
                <p className="text-gray-600">No students have achieved the 8.0 threshold yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recognition Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Recognition & Awards</CardTitle>
          <CardDescription>Actions to recognize and reward top performers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Recognition Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Award className="w-4 h-4 mr-2" />
                  Award Certificates
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Trophy className="w-4 h-4 mr-2" />
                  Honor Roll Recognition
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Academic Excellence Awards
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Support Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Advanced Course Recommendations
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Mentorship Opportunities
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Research Opportunities
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
          <CardDescription>Analysis of top-performing students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Students with scores ≥ 8.0:</span>
              <span className="text-sm font-medium">{topPerformers.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Students with scores ≥ 9.0:</span>
              <span className="text-sm font-medium">{excellentStudents.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Average attendance of top performers:</span>
              <span className="text-sm font-medium">
                {topPerformers.length > 0
                  ? Math.round(topPerformers.reduce((sum, s) => sum + s.attendance, 0) / topPerformers.length)
                  : 0}
                %
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Students with perfect assignment completion:</span>
              <span className="text-sm font-medium">
                {topPerformers.filter((s) => s.assignmentsCompleted === s.totalAssignments).length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
