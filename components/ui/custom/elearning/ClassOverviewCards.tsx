import React from "react";

import { SubjectClassModel } from "@/app/api/model/SubjectClassModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users } from "lucide-react";

interface ClassOverviewCardsProps {
  subjectClass: SubjectClassModel;
  studentStats: {
    totalStudents: number;
  };
}

export default function ClassOverviewCards({ subjectClass, studentStats }: ClassOverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Teacher</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subjectClass.teacher?.name}</div>
          <p className="text-xs text-muted-foreground">{subjectClass.teacher?.email}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Semester</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subjectClass.semester}</div>
          <p className="text-xs text-muted-foreground">{subjectClass.academicYear}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Schedule</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subjectClass.schedule?.length} sessions</div>
          <p className="text-xs text-muted-foreground">per week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{studentStats.totalStudents}</div>
          <p className="text-xs text-muted-foreground">of {subjectClass.maxStudents} max</p>
        </CardContent>
      </Card>
    </div>
  );
}
