import React from "react";

import { SemesterModel } from "@/app/api/model/SemesterModel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Calendar, Check, Clock, Eye } from "lucide-react";

interface SemesterItemProps {
  semester: SemesterModel;
  onClick?: (semester: SemesterModel) => void;
}

export default function SemesterItem({ semester, onClick }: SemesterItemProps) {
  const isActive = semester.status === "Active";
  const isExamPeriod = semester.status === "ExamPeriod";
  const isClosed = semester.status === "Closed";

  const getStatusIcon = () => {
    if (isActive) return <Check className="mr-1 h-3 w-3" />;
    if (isExamPeriod) return <Eye className="mr-1 h-3 w-3" />;
    return <Clock className="mr-1 h-3 w-3" />;
  };

  const getStatusVariant = () => {
    if (isActive) return "default";
    if (isExamPeriod) return "outline";
    return "secondary";
  };

  return (
    <div onClick={() => onClick?.(semester)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className={`${isActive ? "border-primary" : ""} hover:shadow-md transition-shadow cursor-pointer`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">{semester.name}</CardTitle>
                  <Badge variant={getStatusVariant()} className={isActive ? "animate-pulse" : ""}>
                    {getStatusIcon()}
                    {semester.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(semester.start_date), "MMM d, yyyy")} -{" "}
                    {format(new Date(semester.end_date), "MMM d, yyyy")}
                  </span>
                </div>
                {semester.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{semester.description}</p>
                )}
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to view semester details</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
