import React, { useMemo, useState } from "react";

import { CourseDetailModel } from "@/app/api/model/Course";
import { FacultyModel } from "@/app/api/model/model";
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

const CourseItem = ({
  course,
  department,
  onUpdate,
}: {
  course?: CourseDetailModel;
  department?: FacultyModel;
  onUpdate?: (updatedCourse: CourseDetailModel) => Promise<void>;
}) => {
  // Use a stable property like course ID to ensure consistent color assignment
  const { bg, text, border } = useMemo(() => {
    // Generate a deterministic color index based on the course ID
    const colorIndex = course?.id ? course.id % iconColors.length : 0;
    return iconColors[colorIndex];
  }, [course?.id]);

  // Randomly select an icon based on course ID for consistency
  const Icon = useMemo(() => {
    if (!course) return Book;
    const iconIndex = course.id ? course.id % icons.length : 0;
    return icons[iconIndex];
  }, [course?.id]);

  const [open, setOpen] = useState(false);

  // Format date for display
  const dateText = useMemo(() => {
    if (!course?.start_date || !course?.end_date) {
      return "No schedule";
    }

    const startDate = new Date(course.start_date).toLocaleDateString();
    const endDate = new Date(course.end_date).toLocaleDateString();
    return `${startDate} - ${endDate}`;
  }, [course?.start_date, course?.end_date]);

  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/admin/elearning/course/${course?.id}`)}
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
              {course?.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{course?.subject?.name}</p>
          </div>

          <div className="space-y-2">
            {/* Teacher and Credits */}
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">
                {course?.instructor || "No instructor assigned"}
              </span>
              {course?.credits && (
                <Badge variant="outline" className="text-xs ml-auto">
                  {course.credits} credits
                </Badge>
              )}
            </div>

            {/* Schedule */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">{dateText}</span>
            </div>

            {/* Enrollment */}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{course?.enrolled || 0} students enrolled</span>
            </div>

            {/* Semester and Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{course?.semester}</span>
              </div>

              <Badge variant={course?.is_active ? "default" : "secondary"} className="text-xs">
                {course?.is_active ? "Active" : "Inactive"}
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

export { CourseItem as SubjectClassItem };
