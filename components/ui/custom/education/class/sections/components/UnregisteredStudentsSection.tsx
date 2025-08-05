import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Calendar, Clock, Mail, MessageSquare, Users } from "lucide-react";

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

interface UnregisteredStudentsSectionProps {
  students: Student[];
}

export default function UnregisteredStudentsSection({ students }: UnregisteredStudentsSectionProps) {
  const unregisteredStudents = students.filter((s) => s.registeredClasses < s.totalClasses);
  const completelyUnregistered = students.filter((s) => s.registeredClasses === 0);

  function getRegistrationStatus(registered: number, total: number): string {
    const percentage = (registered / total) * 100;
    if (percentage === 0) return "Not Registered";
    if (percentage < 50) return "Partially Registered";
    if (percentage < 100) return "Mostly Registered";
    return "Fully Registered";
  }

  function getRegistrationColor(registered: number, total: number): string {
    const percentage = (registered / total) * 100;
    if (percentage === 0) return "bg-red-100 text-red-800";
    if (percentage < 50) return "bg-orange-100 text-orange-800";
    if (percentage < 100) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unregistered Students</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{unregisteredStudents.length}</div>
            <p className="text-xs text-muted-foreground">Missing classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Registered</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{completelyUnregistered.length}</div>
            <p className="text-xs text-muted-foreground">No classes registered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Registration</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {students.length > 0
                ? Math.round(
                    (students.reduce((sum, s) => sum + s.registeredClasses / s.totalClasses, 0) / students.length) *
                      100,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Class registration rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Unregistered Students List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Unregistered Students</CardTitle>
              <CardDescription>Students who haven't registered for all available classes</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Send Reminder
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {unregisteredStudents.length > 0 ? (
              unregisteredStudents.map((student) => (
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
                    <div className="font-medium text-yellow-600">
                      {student.registeredClasses}/{student.totalClasses} classes
                    </div>
                    <Badge className={getRegistrationColor(student.registeredClasses, student.totalClasses)}>
                      {getRegistrationStatus(student.registeredClasses, student.totalClasses)}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      Missing {student.totalClasses - student.registeredClasses} classes
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All Students Registered</h3>
                <p className="text-gray-600">All students have registered for their available classes.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Registration Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Management</CardTitle>
          <CardDescription>Actions to encourage class registration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Communication Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Registration Reminders
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Schedule Registration Meetings
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Send Deadline Notifications
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Support Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Assign Registration Advisors
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Create Registration Guides
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Extend Registration Deadlines
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Insights</CardTitle>
          <CardDescription>Analysis of student registration patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Students with incomplete registration:</span>
              <span className="text-sm font-medium">{unregisteredStudents.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Students not registered at all:</span>
              <span className="text-sm font-medium">{completelyUnregistered.length}</span>
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
            <div className="flex items-center justify-between">
              <span className="text-sm">Total missing class registrations:</span>
              <span className="text-sm font-medium">
                {students.reduce((sum, s) => sum + (s.totalClasses - s.registeredClasses), 0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
