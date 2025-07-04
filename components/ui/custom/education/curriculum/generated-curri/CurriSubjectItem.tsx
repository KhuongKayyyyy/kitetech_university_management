import React from "react";

import { subjects } from "@/app/api/fakedata";
import { CurriculumnSubjectModel } from "@/app/api/model/CurriculumnSubjectModel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AlertCircle, BookOpen, Clock, GraduationCap, Users } from "lucide-react";

interface CurriSubjectItemProps {
  subject: CurriculumnSubjectModel;
}

export default function CurriSubjectItem({ subject }: CurriSubjectItemProps) {
  const prerequisites = subject.PrerequisiteSubjects?.slice(0, 2).map((prereq: any) => prereq.SubjectName) || [];
  const hasPrerequisites = subject.HasPrerequisite && subject.PrerequisiteSubjects?.length > 0;

  const prerequisiteSubjects = prerequisites.map((prereq: string) => {
    const subject = subjects.find((s) => s.subjectId === prereq);
    return subject;
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "group relative bg-white border-2 border-gray-200/80 rounded-2xl p-6 cursor-pointer overflow-hidden backdrop-blur-sm",
              "transition-all duration-500 ease-out",
              "hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 hover:scale-[1.02]",
              "hover:bg-gradient-to-br hover:from-white hover:via-primary/5 hover:to-primary/10",
              "focus:outline-none focus:ring-4 focus:ring-primary/30 focus:ring-offset-2",
              "active:scale-[0.98] active:shadow-lg",
            )}
          >
            {/* Floating Accent Elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-blue-400/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100"></div>

            {/* Dynamic Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-blue-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-2xl"></div>

            {/* Main Content */}
            <div className="relative z-10 space-y-4">
              {/* Header with Subject Code and Status */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative p-3 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-500 group-hover:rotate-3 group-hover:scale-110">
                    <BookOpen className="w-5 h-5 text-primary group-hover:text-primary/90" />
                    <div className="absolute inset-0 bg-primary/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  </div>
                  <div className="text-sm font-mono font-bold text-gray-800 bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-full group-hover:from-primary/20 group-hover:to-primary/30 group-hover:text-primary transition-all duration-500 shadow-sm group-hover:shadow-md">
                    {subject.SubjectID}
                  </div>
                </div>

                {/* Enhanced Required/Elective Badge */}
                <div
                  className={cn(
                    "relative text-xs font-bold px-3 py-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg",
                    subject.IsRequired
                      ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800 group-hover:from-red-200 group-hover:to-red-300 group-hover:shadow-red-200/50"
                      : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 group-hover:from-blue-200 group-hover:to-blue-300 group-hover:shadow-blue-200/50",
                  )}
                >
                  {subject.IsRequired ? "Required" : "Elective"}
                  <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              {/* Enhanced Subject Name */}
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-primary transition-all duration-300 text-xl tracking-tight">
                  {subject.SubjectName}
                </h3>
                {subject.SubjectName_EN && subject.SubjectName_EN !== subject.SubjectName && (
                  <p className="text-sm text-gray-500 italic font-medium">{subject.SubjectName_EN}</p>
                )}
              </div>

              {/* Enhanced Course Type */}
              {subject.CourseTypeName && (
                <div
                  className="text-xs px-4 py-2 rounded-full inline-flex items-center gap-2 font-semibold shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105"
                  style={{
                    backgroundColor: subject.CourseTypeColorBackground || "#f8fafc",
                    color: subject.CourseTypeColorFont || "#475569",
                  }}
                >
                  <GraduationCap className="w-3 h-3" />
                  {subject.CourseTypeName}
                </div>
              )}

              {/* Enhanced Credits and Hours Info */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t-2 border-gray-100/80 group-hover:border-primary/20 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-3 h-3 bg-gradient-to-r from-primary to-blue-400 rounded-full shadow-sm group-hover:shadow-md transition-shadow duration-300"></div>
                    <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping opacity-0 group-hover:opacity-75"></div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block font-medium uppercase tracking-wide">Credits</span>
                    <span className="font-black text-primary text-xl group-hover:text-primary/90 transition-colors duration-300">
                      {subject.TotalCredits}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Clock className="w-4 h-4 text-gray-400 group-hover:text-primary/60 transition-colors duration-300" />
                    <div className="absolute inset-0 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block font-medium uppercase tracking-wide">Hours</span>
                    <span className="font-bold text-gray-700 text-lg group-hover:text-gray-900 transition-colors duration-300">
                      {subject.LectureHours + subject.PracticeHours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Info Row */}
              <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>Semester {subject.Semester}</span>
                </div>
                <div className="font-medium">
                  {subject.LectureCredits}L + {subject.PracticeCredits}P
                </div>
              </div>
            </div>

            {/* Enhanced Prerequisite Indicator */}
            {hasPrerequisites && (
              <div className="absolute top-5 right-5 group-hover:scale-125 transition-all duration-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400/30 rounded-full animate-pulse"></div>
                  <AlertCircle className="w-6 h-6 text-yellow-600 relative z-10 drop-shadow-sm" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce shadow-sm"></div>
                </div>
              </div>
            )}

            {/* Enhanced Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none rounded-2xl"></div>

            {/* Border Glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/20 via-blue-400/20 to-purple-400/20 blur-xl -z-10"></div>
          </div>
        </TooltipTrigger>
        {hasPrerequisites && (
          <TooltipContent side="top" className="max-w-sm p-0 border-0 shadow-2xl bg-white/95 backdrop-blur-md">
            <div className="relative overflow-hidden rounded-xl z-50">
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Prerequisites Required</h4>
                    <p className="text-yellow-100 text-sm opacity-90">Complete these courses first</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {prerequisites.map((prereq: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-sm"></div>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800 text-sm">{prereq}</span>
                    </div>
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-bold text-xs">{index + 1}</span>
                    </div>
                  </div>
                ))}

                {subject.PrerequisiteSubjects?.length > 2 && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">
                        +{subject.PrerequisiteSubjects.length - 2}
                      </span>
                    </div>
                    <span className="text-blue-700 font-medium text-sm">more prerequisites required</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-600 text-center italic">
                  Ensure all prerequisites are completed before enrolling
                </p>
              </div>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
