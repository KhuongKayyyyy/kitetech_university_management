import React from "react";

import { AcademicYearModel } from "@/app/api/model/AcademicYearModel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Check, Clock } from "lucide-react";

interface AcademicYearItemProps {
  academicYear: AcademicYearModel;
}

export default function AcademicYearItem({ academicYear }: AcademicYearItemProps) {
  const isActive = academicYear.status === "active";

  return (
    <Card className={`${isActive ? "border-primary" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{academicYear.year}</CardTitle>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? <Check className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
            {academicYear.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(academicYear.start_date), "MMM d, yyyy")} -{" "}
            {format(new Date(academicYear.end_date), "MMM d, yyyy")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
