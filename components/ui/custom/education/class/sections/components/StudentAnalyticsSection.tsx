import React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BarChart3, Star, Target, TrendingDown, TrendingUp, Users } from "lucide-react";

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

interface PerformanceMetrics {
  totalStudents: number;
  averageGrade: number;
  passRate: number;
  lowPerformers: number;
  unregisteredStudents: number;
  excellentStudents: number;
  atRiskStudents: number;
}

interface StudentAnalyticsSectionProps {
  students: Student[];
  performanceMetrics: PerformanceMetrics;
}

export default function StudentAnalyticsSection({ students, performanceMetrics }: StudentAnalyticsSectionProps) {
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
      if (student.averageScore >= 9.0) distribution.A++;
      else if (student.averageScore >= 7.0) distribution.B++;
      else if (student.averageScore >= 5.0) distribution.C++;
      else if (student.averageScore >= 4.0) distribution.D++;
      else distribution.F++;
    });

    return distribution;
  }, [students]);

  const attendanceAnalysis = React.useMemo(() => {
    const highAttendance = students.filter((s) => s.attendance >= 90).length;
    const mediumAttendance = students.filter((s) => s.attendance >= 70 && s.attendance < 90).length;
    const lowAttendance = students.filter((s) => s.attendance < 70).length;

    return { highAttendance, mediumAttendance, lowAttendance };
  }, [students]);

  const assignmentCompletion = React.useMemo(() => {
    const perfectCompletion = students.filter((s) => s.assignmentsCompleted === s.totalAssignments).length;
    const partialCompletion = students.filter(
      (s) => s.assignmentsCompleted > 0 && s.assignmentsCompleted < s.totalAssignments,
    ).length;
    const noCompletion = students.filter((s) => s.assignmentsCompleted === 0).length;

    return { perfectCompletion, partialCompletion, noCompletion };
  }, [students]);

  const passingRate = Math.round(
    ((performanceMetrics.excellentStudents +
      students.filter((s) => s.averageScore >= 5.0 && s.averageScore < 8.0).length) /
      performanceMetrics.totalStudents) *
      100,
  );

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
              {students.filter((s) => s.averageScore >= 5.0).length} of {performanceMetrics.totalStudents} students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.averageGrade}</div>
            <p className="text-xs text-muted-foreground">out of 10.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{performanceMetrics.excellentStudents}</div>
            <p className="text-xs text-muted-foreground">students ≥ 8.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{performanceMetrics.atRiskStudents}</div>
            <p className="text-xs text-muted-foreground">students &lt; 4.0</p>
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
                    ({Math.round((gradeDistribution.A / performanceMetrics.totalStudents) * 100)}%)
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
                    ({Math.round((gradeDistribution.B / performanceMetrics.totalStudents) * 100)}%)
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
                    ({Math.round((gradeDistribution.C / performanceMetrics.totalStudents) * 100)}%)
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
                    ({Math.round((gradeDistribution.D / performanceMetrics.totalStudents) * 100)}%)
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
                    ({Math.round((gradeDistribution.F / performanceMetrics.totalStudents) * 100)}%)
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
                  {students.find((s) => s.averageScore === Math.max(...students.map((s) => s.averageScore)))?.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Class Average:</span>
                <span className="text-sm font-medium">{performanceMetrics.averageGrade}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-green-500" />
                <span className="text-sm">Passing Rate:</span>
                <span className="text-sm font-medium">{passingRate}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">Excellent Students:</span>
                <span className="text-sm font-medium">{performanceMetrics.excellentStudents}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-sm">At Risk Students:</span>
                <span className="text-sm font-medium">{performanceMetrics.atRiskStudents}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Analysis</CardTitle>
          <CardDescription>Student attendance patterns and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{attendanceAnalysis.highAttendance}</div>
              <div className="text-sm text-green-600">High Attendance</div>
              <div className="text-xs text-green-500">≥90%</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{attendanceAnalysis.mediumAttendance}</div>
              <div className="text-sm text-yellow-600">Medium Attendance</div>
              <div className="text-xs text-yellow-500">70-89%</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{attendanceAnalysis.lowAttendance}</div>
              <div className="text-sm text-red-600">Low Attendance</div>
              <div className="text-xs text-red-500">&lt;70%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Completion */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Completion</CardTitle>
          <CardDescription>Analysis of student assignment completion rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{assignmentCompletion.perfectCompletion}</div>
              <div className="text-sm text-green-600">Perfect Completion</div>
              <div className="text-xs text-green-500">100% assignments</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{assignmentCompletion.partialCompletion}</div>
              <div className="text-sm text-yellow-600">Partial Completion</div>
              <div className="text-xs text-yellow-500">1-99% assignments</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{assignmentCompletion.noCompletion}</div>
              <div className="text-sm text-red-600">No Completion</div>
              <div className="text-xs text-red-500">0% assignments</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Analysis</CardTitle>
          <CardDescription>Student class registration patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Fully registered students:</span>
              <span className="text-sm font-medium">
                {students.filter((s) => s.registeredClasses === s.totalClasses).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Partially registered students:</span>
              <span className="text-sm font-medium">
                {students.filter((s) => s.registeredClasses > 0 && s.registeredClasses < s.totalClasses).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Unregistered students:</span>
              <span className="text-sm font-medium">{students.filter((s) => s.registeredClasses === 0).length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Average registration rate:</span>
              <span className="text-sm font-medium">
                {students.length > 0
                  ? Math.round(
                      (students.reduce((sum, s) => sum + s.registeredClasses / s.totalClasses, 0) / students.length) *
                        100,
                    )
                  : 0}
                %
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
