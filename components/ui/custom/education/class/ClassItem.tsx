"use client";

import React from "react";

import { ClassModel } from "@/app/api/model/ClassModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { BookOpen, Calendar, Edit, GraduationCap, MoreHorizontal, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface ClassItemProps {
  classData: ClassModel;
  onEdit?: (classData: ClassModel) => void;
  onDelete?: (classData: ClassModel) => void;
  onViewDetails?: (classData: ClassModel) => void;
}

export default function ClassItem({ classData, onEdit, onDelete, onViewDetails }: ClassItemProps) {
  const handleEdit = () => {
    onEdit?.(classData);
  };

  const handleDelete = () => {
    onDelete?.(classData);
  };

  const handleViewDetails = () => {
    onViewDetails?.(classData);
  };

  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`${APP_ROUTES.CLASS}/${classData.id}?name=Class${classData.classCode}`)}
      className="group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:shadow-blue-500/25 group-hover:scale-110 transition-all duration-300">
                <GraduationCap className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-blue-600 transition-colors duration-300">
                  {classData.classCode}
                </h3>
                <Badge
                  variant="secondary"
                  className="text-xs font-medium bg-blue-100 text-blue-700 border-0 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  #{classData.id}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                {classData.description || "No description available"}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                <Edit className="w-4 h-4 mr-2" />
                Edit Class
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleViewDetails} className="cursor-pointer">
                <Users className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Class
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center p-3 rounded-xl bg-orange-50 border border-orange-100 dark:bg-orange-900/20 dark:border-orange-800/30 group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-4 h-4 text-orange-600 dark:text-orange-400 mb-1" />
              <span className="text-xs font-medium text-orange-700 dark:text-orange-300">Major</span>
              <span className="text-sm font-bold text-orange-800 dark:text-orange-200">{classData.majorId}</span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-xl bg-green-50 border border-green-100 dark:bg-green-900/20 dark:border-green-800/30 group-hover:scale-105 transition-transform duration-200">
              <Calendar className="w-4 h-4 text-green-600 dark:text-green-400 mb-1" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">Year</span>
              <span className="text-sm font-bold text-green-800 dark:text-green-200">{classData.academicYearId}</span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-xl bg-purple-50 border border-purple-100 dark:bg-purple-900/20 dark:border-purple-800/30 group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-1" />
              <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Curriculum</span>
              <span className="text-sm font-bold text-purple-800 dark:text-purple-200">{classData.curriculumId}</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="w-full opacity-0 group-hover:opacity-100 transition-all duration-300 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Users className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
