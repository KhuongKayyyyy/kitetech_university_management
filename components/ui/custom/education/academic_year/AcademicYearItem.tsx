import React from "react";

import { AcademicYearModel } from "@/app/api/model/AcademicYearModel";
import { SemesterModel } from "@/app/api/model/SemesterModel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSemestersByAcademicYear } from "@/hooks/useSemester";
import { format } from "date-fns";
import { Calendar, Check, Clock, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";

interface AcademicYearItemProps {
  academicYear: AcademicYearModel;
}

export default function AcademicYearItem({ academicYear }: AcademicYearItemProps) {
  const router = useRouter();
  const isActive = academicYear.status === "Active";
  const { semesters } = useSemestersByAcademicYear(academicYear.id + "");

  return (
    <div
    // onClick={() =>
    //   router.push(`${APP_ROUTES.ADMIN}/education/${academicYear.id}?name=${"Academic Year " + academicYear.year}`)
    // }
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className={`${isActive ? "border-primary" : ""} hover:shadow-md transition-shadow`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">{academicYear.year}</CardTitle>
                  <Badge variant={isActive ? "default" : "secondary"} className="animate-pulse">
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
          </TooltipTrigger>
          <TooltipContent className="p-4 max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b pb-3">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold">Semesters Overview</span>
              </div>
              <div className="flex flex-col gap-3">
                {semesters.map((semester: SemesterModel) => (
                  <div
                    key={semester.id}
                    className="flex items-center justify-between bg-secondary/20 hover:bg-secondary/30 p-3 rounded-lg transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-base text-black">{semester.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(semester.start_date), "MMM d")} -{" "}
                        {format(new Date(semester.end_date), "MMM d, yyyy")}
                      </span>
                    </div>
                    <Badge
                      variant={semester.status === "Active" ? "default" : "secondary"}
                      className={`text-xs px-3 py-1 ${semester.status === "Active" ? "animate-pulse" : ""}`}
                    >
                      {semester.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
