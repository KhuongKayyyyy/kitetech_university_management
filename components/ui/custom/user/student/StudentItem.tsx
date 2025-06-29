import React from "react";

import { Student } from "@/app/api/model/model";
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
import { Calendar, Edit, GraduationCap, Mail, MapPin, MoreHorizontal, Trash2, User } from "lucide-react";

interface StudentItemProps {
  student: Student;
  onEdit?: (student: Student) => void;
  onDelete?: (student: Student) => void;
}

export default function StudentItem({ student, onEdit, onDelete }: StudentItemProps) {
  const getStatusBadge = (isActivated: boolean) => {
    return isActivated ? (
      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-500 hover:bg-gray-600 text-white">
        Inactive
      </Badge>
    );
  };

  return (
    <Card className="w-full shadow-sm border hover:shadow-xl transition-all duration-300 hover:border-primary/40 hover:scale-[1.02] group cursor-pointer hover:bg-gradient-to-br hover:from-white hover:to-gray-50/50">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary group-hover:scale-105 transition-all duration-200">
                {student.name}
              </h3>
              {getStatusBadge(student.isActivated)}
            </div>
            {student.username && <p className="text-sm text-gray-600 mb-1">@{student.username}</p>}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-3 h-3" />
              <span>ID: {student.studentId}</span>
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
              <DropdownMenuItem onClick={() => onEdit?.(student)} className="cursor-pointer hover:bg-primary/10">
                <Edit className="w-4 h-4 mr-2" />
                Edit Student
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(student)}
                className="cursor-pointer text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Student
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-primary" />
            <span className="truncate">{student.studentEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{student.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{new Date(student.birthday).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Academic Information */}
        <div className="pt-2 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <span className="font-medium">Class ID:</span>
              <p className="text-gray-800">{student.classId}</p>
            </div>
            <div>
              <span className="font-medium">Major ID:</span>
              <p className="text-gray-800">{student.majorId}</p>
            </div>
            <div className="col-span-2">
              <span className="font-medium">Department ID:</span>
              <p className="text-gray-800">{student.departmentId}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
