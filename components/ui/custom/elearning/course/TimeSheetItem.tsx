import React from "react";

import { TimeSheetModel } from "@/app/api/model/TimeSheet";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

export default function TimeSheetItem({
  timeSheet,
  compact = false,
}: {
  timeSheet: TimeSheetModel;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="font-medium capitalize">{timeSheet.date}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-600">
          <Clock className="h-3 w-3" />
          <span>{timeSheet.time_of_sheet}</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border border-gray-200">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 capitalize text-sm">{timeSheet.date}</h3>
              <p className="text-xs text-gray-600">{timeSheet.sheet}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-700">
            <Clock className="h-3 w-3" />
            <span className="text-xs font-medium">{timeSheet.time_of_sheet}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
