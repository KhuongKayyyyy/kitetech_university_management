import React from "react";

import { CourseDetailModel } from "@/app/api/model/Course";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Edit, MapPin, Users } from "lucide-react";

interface ClassScheduleTabProps {
  subjectClass: CourseDetailModel;
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
    if (!time) return "bg-gray-50 border-gray-200";
    if (time.includes("7:") || time.includes("8:")) return "bg-blue-50 border-blue-200";
    if (time.includes("9:")) return "bg-green-50 border-green-200";
    if (time.includes("13:") || time.includes("14:")) return "bg-yellow-50 border-yellow-200";
    if (time.includes("15:") || time.includes("16:")) return "bg-orange-50 border-orange-200";
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
            {subjectClass.schedules && subjectClass.schedules.length > 0 ? (
              subjectClass.schedules.map((schedule, index) => {
                // Parse the schedule string (e.g., "Monday 7:30-9:30")
                const scheduleParts = schedule.schedule?.split(" ") || [];
                const day = scheduleParts[0] || "";
                const time = scheduleParts.slice(1).join(" ") || "";

                return (
                  <div
                    key={schedule.id || index}
                    className={`flex items-center justify-between p-4 border rounded-lg ${getTimeSlotColor(time)}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getDayColor(day)}>{day.charAt(0).toUpperCase() + day.slice(1)}</Badge>
                          <span className="font-medium">Section {schedule.sections}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">{time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Duration: 2 hours</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Room: {subjectClass.location || "TBD"}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedule Available</h3>
                <p className="text-muted-foreground">This class doesn't have any scheduled sessions yet.</p>
              </div>
            )}
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
            <div className="text-2xl font-bold">{subjectClass.schedules?.length || 0}</div>
            <p className="text-xs text-muted-foreground">per week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(subjectClass.schedules?.length || 0) * 2}</div>
            <p className="text-xs text-muted-foreground">hours per week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Active</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(subjectClass.schedules?.map((s) => s.schedule?.split(" ")[0]) || []).size}
            </div>
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
                    <span>{subjectClass.semester}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Schedule Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Sessions:</span>
                    <span>{subjectClass.schedules?.length || 0} per week</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Hours:</span>
                    <span>{(subjectClass.schedules?.length || 0) * 2} hours/week</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days Active:</span>
                    <span>
                      {new Set(subjectClass.schedules?.map((s) => s.schedule?.split(" ")[0]) || []).size} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Enrolled Students:</span>
                    <span>{subjectClass.enrolled}</span>
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
