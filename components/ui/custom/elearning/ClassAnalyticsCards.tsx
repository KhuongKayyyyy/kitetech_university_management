import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, BarChart3, TrendingDown, TrendingUp } from "lucide-react";

interface ClassAnalyticsCardsProps {
  studentStats: {
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    belowAverage: number;
    aboveAverage: number;
  };
}

export default function ClassAnalyticsCards({ studentStats }: ClassAnalyticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{studentStats.averageScore}</div>
          <p className="text-xs text-muted-foreground">out of 10.0</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{studentStats.highestScore}</div>
          <p className="text-xs text-muted-foreground">top performer</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lowest Score</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{studentStats.lowestScore}</div>
          <p className="text-xs text-muted-foreground">needs attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Above Average</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{studentStats.aboveAverage}</div>
          <p className="text-xs text-muted-foreground">above class average</p>
        </CardContent>
      </Card>
    </div>
  );
}
