import React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BarChart3, Star, Target, TrendingDown, TrendingUp, Users } from "lucide-react";

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

interface StudentStats {
  students: Student[];
  totalStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  belowAverage: number;
  aboveAverage: number;
}

interface ClassAnalyticsTabProps {
  students: Student[];
  studentStats: StudentStats;
}

export default function ClassAnalyticsTab({ students, studentStats }: ClassAnalyticsTabProps) {
  // Calculate additional analytics
  const gradeDistribution = React.useMemo(() => {
    const distribution = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      F: 0,
    };

    students.forEach((student) => {
      if (student.totalScore >= 9.0) distribution.A++;
      else if (student.totalScore >= 7.0) distribution.B++;
      else if (student.totalScore >= 5.0) distribution.C++;
      else if (student.totalScore >= 4.0) distribution.D++;
      else distribution.F++;
    });

    return distribution;
  }, [students]);

  const topPerformers = React.useMemo(() => {
    return students
      .filter((s) => s.totalScore >= 8.0)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 3);
  }, [students]);

  const atRiskStudents = React.useMemo(() => {
    return students.filter((s) => s.totalScore < 5.0).sort((a, b) => a.totalScore - b.totalScore);
  }, [students]);

  const passingRate = Math.round((studentStats.aboveAverage / studentStats.totalStudents) * 100);

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passing Rate</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{passingRate}%</div>
            <p className="text-xs text-muted-foreground">
              {studentStats.aboveAverage} of {studentStats.totalStudents} students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentStats.averageScore}</div>
            <p className="text-xs text-muted-foreground">out of 10.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{topPerformers.length}</div>
            <p className="text-xs text-muted-foreground">students ≥ 8.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{atRiskStudents.length}</div>
            <p className="text-xs text-muted-foreground">students &lt; 5.0</p>
          </CardContent>
        </Card>
      </div>

      {/* Grade Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Distribution of student grades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">A (9.0-10.0)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{gradeDistribution.A} students</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round((gradeDistribution.A / studentStats.totalStudents) * 100)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">B (7.0-8.9)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{gradeDistribution.B} students</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round((gradeDistribution.B / studentStats.totalStudents) * 100)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">C (5.0-6.9)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{gradeDistribution.C} students</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round((gradeDistribution.C / studentStats.totalStudents) * 100)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">D (4.0-4.9)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{gradeDistribution.D} students</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round((gradeDistribution.D / studentStats.totalStudents) * 100)}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">F (&lt;4.0)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{gradeDistribution.F} students</span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round((gradeDistribution.F / studentStats.totalStudents) * 100)}%)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>Key performance metrics and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Top Performer:</span>
                <span className="text-sm font-medium">
                  {students.find((s) => s.totalScore === studentStats.highestScore)?.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Class Average:</span>
                <span className="text-sm font-medium">{studentStats.averageScore}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-green-500" />
                <span className="text-sm">Passing Rate:</span>
                <span className="text-sm font-medium">{passingRate}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">Excellent Students:</span>
                <span className="text-sm font-medium">{topPerformers.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-sm">At Risk Students:</span>
                <span className="text-sm font-medium">{atRiskStudents.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      {topPerformers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Students with scores of 8.0 or higher</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((student, index) => (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-yellow-800">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">{student.totalScore}</div>
                    <Badge className="bg-green-100 text-green-800">{student.letterGrade}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* At Risk Students */}
      {atRiskStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Students at Risk</CardTitle>
            <CardDescription>Students with scores below 5.0 who need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {atRiskStudents.map((student, index) => (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-red-800">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-red-600">{student.totalScore}</div>
                    <Badge className="bg-red-100 text-red-800">{student.letterGrade}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
