import React, { useMemo, useState } from "react";

import { FacultyModel } from "@/app/api/model/model";
import { SubjectClassModel } from "@/app/api/model/SubjectClassModel";
import { Badge } from "@/components/ui/badge";
import {
  Book,
  Calculator,
  Calendar,
  Clock,
  DraftingCompass,
  GraduationCap,
  LampWallDown,
  ScanEyeIcon,
  TextSearchIcon,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Card } from "../../../card";

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

// Icon array for random selection
const icons = [Calculator, DraftingCompass, LampWallDown, ScanEyeIcon, TextSearchIcon, Book];

const SubjectClassItem = ({
  subjectClass,
  department,
  onUpdate,
}: {
  subjectClass?: SubjectClassModel;
  department?: FacultyModel;
  onUpdate?: (updatedSubjectClass: SubjectClassModel) => Promise<void>;
}) => {
  // Use a stable property like subject class ID to ensure consistent color assignment
  const { bg, text, border } = useMemo(() => {
    // Generate a deterministic color index based on the subject class ID
    const colorIndex = subjectClass?.id ? parseInt(subjectClass.id) % iconColors.length : 0;
    return iconColors[colorIndex];
  }, [subjectClass?.id]);

  // Randomly select an icon based on subject class ID for consistency
  const Icon = useMemo(() => {
    if (!subjectClass) return Book;
    const iconIndex = subjectClass.id ? parseInt(subjectClass.id) % icons.length : 0;
    return icons[iconIndex];
  }, [subjectClass?.id]);

  const [open, setOpen] = useState(false);

  // Format schedule times for display
  const scheduleText = useMemo(() => {
    if (!subjectClass?.schedule || subjectClass.schedule.length === 0) {
      return "No schedule";
    }

    const days = subjectClass.schedule.map(
      (slot) => `${slot.date.charAt(0).toUpperCase() + slot.date.slice(1)} ${slot.time_of_sheet}`,
    );

    return days.length > 2 ? `${days.slice(0, 2).join(", ")} +${days.length - 2}` : days.join(", ");
  }, [subjectClass?.schedule]);

  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/admin/elearning/course/${subjectClass?.id}`)}
      className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden"
    >
      <div className="flex items-center gap-4 p-6 h-[180px] md:h-[200px]">
        <div
          className={`flex items-center justify-center w-16 h-16 rounded-xl shrink-0 border-2 ${bg} ${border} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`w-8 h-8 ${text}`} strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground leading-tight truncate group-hover:text-primary transition-colors">
              {subjectClass?.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{subjectClass?.subject?.name}</p>
          </div>

          <div className="space-y-2">
            {/* Teacher and Credits */}
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">
                {subjectClass?.teacher?.name || "No teacher assigned"}
              </span>
              {subjectClass?.subject?.credits && (
                <Badge variant="outline" className="text-xs ml-auto">
                  {subjectClass.subject.credits} credits
                </Badge>
              )}
            </div>

            {/* Schedule */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">{scheduleText}</span>
            </div>

            {/* Enrollment */}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {subjectClass?.enrolledStudents?.length || 0}/{subjectClass?.maxStudents || 0} students
              </span>
            </div>

            {/* Semester and Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{subjectClass?.semester}</span>
              </div>

              <Badge variant={subjectClass?.isActive ? "default" : "secondary"} className="text-xs">
                {subjectClass?.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          {department && (
            <Badge variant="secondary" className="text-xs bg-muted/60 text-muted-foreground">
              {department.name}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

export { SubjectClassItem };
