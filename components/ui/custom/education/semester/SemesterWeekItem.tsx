import React from "react";

import { SemesterWeekModel } from "@/app/api/model/SemesterWeekModel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";

interface SemesterWeekItemProps {
  week: SemesterWeekModel;
  onClick?: (week: SemesterWeekModel) => void;
}

export default function SemesterWeekItem({ week, onClick }: SemesterWeekItemProps) {
  const isCurrentWeek = () => {
    const now = new Date();
    const startDate = new Date(week.start_date || "");
    const endDate = new Date(week.end_date || "");
    return now >= startDate && now <= endDate;
  };

  const isPastWeek = () => {
    const now = new Date();
    const endDate = new Date(week.end_date || "");
    return now > endDate;
  };

  const getWeekStatus = () => {
    if (isCurrentWeek()) return "Current";
    if (isPastWeek()) return "Completed";
    return "Upcoming";
  };

  const getStatusVariant = () => {
    if (isCurrentWeek()) return "default";
    if (isPastWeek()) return "secondary";
    return "outline";
  };

  return (
    <div onClick={() => onClick?.(week)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card
              className={`${isCurrentWeek() ? "border-primary" : ""} hover:shadow-md transition-shadow cursor-pointer`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Week {week.week_number}</CardTitle>
                  <Badge variant={getStatusVariant()} className={isCurrentWeek() ? "animate-pulse" : ""}>
                    <Clock className="mr-1 h-3 w-3" />
                    {getWeekStatus()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {week.start_date && format(new Date(week.start_date), "MMM d")} -{" "}
                    {week.end_date && format(new Date(week.end_date), "MMM d, yyyy")}
                  </span>
                </div>
                {week.description && <p className="text-sm text-muted-foreground line-clamp-2">{week.description}</p>}
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to view week details</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
