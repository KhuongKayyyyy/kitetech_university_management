import React from "react";

import { SubjectClassModel } from "@/app/api/model/SubjectClassModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Edit, MapPin, Users } from "lucide-react";

interface ClassScheduleTabProps {
  subjectClass: SubjectClassModel;
}

export default function ClassScheduleTab({ subjectClass }: ClassScheduleTabProps) {
  const getDayColor = (day: string) => {
    switch (day.toLowerCase()) {
      case "monday":
        return "bg-blue-100 text-blue-800";
      case "tuesday":
        return "bg-purple-100 text-purple-800";
      case "wednesday":
        return "bg-green-100 text-green-800";
      case "thursday":
        return "bg-orange-100 text-orange-800";
      case "friday":
        return "bg-red-100 text-red-800";
      case "saturday":
        return "bg-gray-100 text-gray-800";
      case "sunday":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTimeSlotColor = (time: string) => {
    if (time.includes("7h") || time.includes("8h")) return "bg-blue-50 border-blue-200";
    if (time.includes("9h")) return "bg-green-50 border-green-200";
    if (time.includes("13h") || time.includes("14h")) return "bg-yellow-50 border-yellow-200";
    if (time.includes("15h") || time.includes("16h")) return "bg-orange-50 border-orange-200";
    return "bg-gray-50 border-gray-200";
  };

  return (
    <div className="space-y-6">
      {/* Schedule Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Class Schedule</CardTitle>
              <CardDescription>Weekly class schedule and time slots</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectClass.schedule?.map((session, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 border rounded-lg ${getTimeSlotColor(session.time_of_sheet)}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getDayColor(session.date)}>
                        {session.date.charAt(0).toUpperCase() + session.date.slice(1)}
                      </Badge>
                      <span className="font-medium">{session.sheet}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{session.time_of_sheet}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Duration: 2.5 hours</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Room: TBD</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjectClass.schedule?.length}</div>
            <p className="text-xs text-muted-foreground">per week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(subjectClass.schedule?.length || 0) * 2.5}</div>
            <p className="text-xs text-muted-foreground">hours per week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Active</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(subjectClass.schedule?.map((s) => s.date) || []).size}</div>
            <p className="text-xs text-muted-foreground">different days</p>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Details */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Details</CardTitle>
          <CardDescription>Detailed information about class scheduling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Class Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subject:</span>
                    <span>{subjectClass.subject?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credits:</span>
                    <span>{subjectClass.subject?.credits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Semester:</span>
                    <span>{subjectClass.semester}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Academic Year:</span>
                    <span>{subjectClass.academicYear}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Schedule Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Sessions:</span>
                    <span>{subjectClass.schedule?.length} per week</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Hours:</span>
                    <span>{(subjectClass.schedule?.length || 0) * 2.5} hours/week</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days Active:</span>
                    <span>{new Set(subjectClass.schedule?.map((s) => s.date) || []).size} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Students:</span>
                    <span>{subjectClass.maxStudents}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage class schedule and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Schedule
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Export Schedule
            </Button>
            <Button variant="outline" size="sm">
              <MapPin className="w-4 h-4 mr-2" />
              Assign Rooms
            </Button>
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Manage Capacity
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
