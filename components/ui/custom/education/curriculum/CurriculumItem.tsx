import React from "react";

import { CurriculumModel } from "@/app/api/model/CurriculumModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Award, BookOpen, Building2, Calendar, Copy, Edit, GraduationCap, MoreHorizontal, Trash2 } from "lucide-react";

interface CurriculumItemProps {
  curriculum: CurriculumModel & { status?: string };
  onEdit?: (curriculum: any) => void;
  onDelete?: (curriculum: any) => void;
}

export default function CurriculumItem({ curriculum, onEdit, onDelete }: CurriculumItemProps) {
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="secondary" className="bg-gray-500 hover:bg-gray-600 text-white">
            Inactive
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            Draft
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full shadow-sm border hover:shadow-xl transition-all duration-300 hover:border-primary/40 hover:scale-[1.02] group cursor-pointer hover:bg-gradient-to-br hover:from-white hover:to-gray-50/50">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary group-hover:scale-105 transition-all duration-200">
                {curriculum.name}
              </h3>
              {curriculum.status && getStatusBadge(curriculum.status)}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary/10 hover:scale-110"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="font-semibold">Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(curriculum.name)}
                className="cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Curriculum Name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onEdit?.(curriculum)}
                className="cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Curriculum
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(curriculum)}
                className="cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Curriculum
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100 group-hover:bg-blue-100 group-hover:border-blue-200 transition-all duration-200 group-hover:shadow-sm">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-200">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-blue-600 font-medium uppercase tracking-wide group-hover:text-blue-700 transition-colors">
                  Academic Year
                </p>
                <p className="text-sm font-semibold text-blue-900 group-hover:text-blue-800 transition-colors">
                  {curriculum.academicYear}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100 group-hover:bg-purple-100 group-hover:border-purple-200 transition-all duration-200 group-hover:shadow-sm">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-200">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-purple-600 font-medium uppercase tracking-wide group-hover:text-purple-700 transition-colors">
                  Department
                </p>
                <p className="text-sm font-semibold text-purple-900 truncate group-hover:text-purple-800 transition-colors">
                  {curriculum.department}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-100 group-hover:bg-green-100 group-hover:border-green-200 transition-all duration-200 group-hover:shadow-sm">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors duration-200">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-green-600 font-medium uppercase tracking-wide group-hover:text-green-700 transition-colors">
                  Major
                </p>
                <p className="text-sm font-semibold text-green-900 truncate group-hover:text-green-800 transition-colors">
                  {curriculum.major}
                </p>
              </div>
            </div>

            {(curriculum.totalCredits || curriculum.totalCourses) && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 border border-orange-100 group-hover:bg-orange-100 group-hover:border-orange-200 transition-all duration-200 group-hover:shadow-sm">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-200">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-orange-600 font-medium uppercase tracking-wide mb-1 group-hover:text-orange-700 transition-colors">
                    Summary
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    {curriculum.totalCredits && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3 text-orange-600 group-hover:text-orange-700 transition-colors" />
                        <span className="text-orange-900 group-hover:text-orange-800 transition-colors">
                          <strong>{curriculum.totalCredits}</strong> Credits
                        </span>
                      </div>
                    )}
                    {curriculum.totalCourses && (
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-3 w-3 text-orange-600 group-hover:text-orange-700 transition-colors" />
                        <span className="text-orange-900 group-hover:text-orange-800 transition-colors">
                          <strong>{curriculum.totalCourses}</strong> Courses
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
