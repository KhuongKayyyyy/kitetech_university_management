import React, { useMemo, useState } from "react";

import { FacultyModel, MajorModel, Subject } from "@/app/api/model/model";
import { Badge } from "@/components/ui/badge";
import { Book, Calculator, DraftingCompass, LampWallDown, ScanEyeIcon, TextSearchIcon } from "lucide-react";

import { Card } from "../../../card";
import { SubjectDetailDialog } from "./SubjectDetailDialog";

// Icon colors array
const iconColors = [
  { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
  { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
  { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
  { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
  { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200" },
  { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
];

// Icon map for major departments
const iconMap = {
  Calculator,
  DraftingCompass,
  LampWallDown,
  ScanEyeIcon,
  TextSearchIcon,
  Book, // default fallback
};

const SubjectItem = ({ subject, department }: { subject?: Subject; department?: FacultyModel }) => {
  // Use a stable property like department ID to ensure consistent color assignment
  const { bg, text, border } = useMemo(() => {
    // Generate a deterministic color index based on the department's ID
    const colorIndex = department ? department.id % iconColors.length : 0;
    return iconColors[colorIndex];
  }, [department?.id]);

  // Resolve the icon from the department's icon key
  const Icon = department ? iconMap[department.icon as keyof typeof iconMap] || Book : Book;
  const [open, setOpen] = useState(false);

  return (
    <Card
      onClick={() => setOpen(true)}
      className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden"
    >
      <div className="flex items-center gap-4 p-6 h-[140px] md:h-[160px]">
        <div
          className={`flex items-center justify-center w-16 h-16 rounded-xl shrink-0 border-2 ${bg} ${border} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`w-8 h-8 ${text}`} strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground leading-tight truncate group-hover:text-primary transition-colors">
              {subject?.name}
            </h3>
            {department && (
              <Badge variant="secondary" className="text-xs bg-muted/60 text-muted-foreground">
                {department.name}
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {subject?.description || "No description available"}
          </p>
        </div>
      </div>
      <SubjectDetailDialog subject={subject!} open={open} onOpenChange={setOpen} />
    </Card>
  );
};

export default SubjectItem;
