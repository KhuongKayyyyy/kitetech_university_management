import React, { useMemo, useState } from "react";

import { DepartmentModel, Major } from "@/app/api/model/model";
import {
  Book,
  Calculator,
  DraftingCompass,
  GraduationCap,
  LampWallDown,
  ScanEyeIcon,
  TextSearchIcon,
} from "lucide-react";

import { Badge } from "../../../badge";
import { Card, CardContent } from "../../../card";
import { MajorDetailDialog } from "./ MajorDetailDialog";

// Enhanced color palette with more sophisticated gradients
const iconColors = [
  { bg: "bg-gradient-to-br from-red-50 to-red-100", icon: "text-red-600", border: "border-red-200" },
  { bg: "bg-gradient-to-br from-amber-50 to-amber-100", icon: "text-amber-600", border: "border-amber-200" },
  { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100", icon: "text-emerald-600", border: "border-emerald-200" },
  { bg: "bg-gradient-to-br from-blue-50 to-blue-100", icon: "text-blue-600", border: "border-blue-200" },
  { bg: "bg-gradient-to-br from-purple-50 to-purple-100", icon: "text-purple-600", border: "border-purple-200" },
  { bg: "bg-gradient-to-br from-pink-50 to-pink-100", icon: "text-pink-600", border: "border-pink-200" },
  { bg: "bg-gradient-to-br from-teal-50 to-teal-100", icon: "text-teal-600", border: "border-teal-200" },
  { bg: "bg-gradient-to-br from-orange-50 to-orange-100", icon: "text-orange-600", border: "border-orange-200" },
];

// Icon map for major departments
const iconMap = {
  Calculator,
  DraftingCompass,
  LampWallDown,
  ScanEyeIcon,
  TextSearchIcon,
  Book,
  GraduationCap,
};

const MajorItem = ({ major, department }: { major?: Major; department?: DepartmentModel }) => {
  // Use a stable property like department ID to ensure consistent color assignment
  const colorScheme = useMemo(() => {
    // Generate a deterministic color index based on the department's ID
    const colorIndex = department ? department.id % iconColors.length : 0;
    return iconColors[colorIndex];
  }, [department?.id]);

  // Resolve the icon from the department's icon key
  const Icon = department ? iconMap[department.icon as keyof typeof iconMap] : GraduationCap;

  const [open, setOpen] = useState(false);

  return (
    <Card
      onClick={() => setOpen(true)}
      className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out border-0 shadow-md bg-gradient-to-br from-white to-gray-50/50"
    >
      <CardContent className="p-0">
        <div className="flex items-center gap-4 p-6">
          {/* Icon Container */}
          <div
            className={`relative flex items-center justify-center w-16 h-16 rounded-2xl border-2 ${colorScheme.bg} ${colorScheme.border} shadow-sm group-hover:shadow-md transition-shadow duration-300`}
          >
            <Icon className={`w-7 h-7 ${colorScheme.icon}`} strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Major Name */}
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900 leading-tight truncate group-hover:text-gray-700 transition-colors duration-200">
                {major?.name || "Untitled Major"}
              </h3>
              {department && (
                <Badge variant="secondary" className="shrink-0 text-xs font-medium bg-gray-100 text-gray-600 border-0">
                  {department.name}
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 group-hover:text-gray-500 transition-colors duration-200">
              {major?.description || "No description available for this major."}
            </p>
          </div>

          {/* Hover Arrow Indicator */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </CardContent>
      <MajorDetailDialog major={major!} open={open} onOpenChange={setOpen} />
    </Card>
  );
};

export default MajorItem;
