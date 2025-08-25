import React from "react";

import { Teacher } from "@/app/api/model/TeacherModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, GraduationCap, Mail, MapPin, Phone } from "lucide-react";

import { Card } from "../../../card";
import { TeacherDetailDialog } from "./TeacherDetailDialog";

const TeacherItem = ({ teacher }: { teacher: Teacher }) => {
  const formatGender = (gender?: number) => {
    if (gender === 1) return "Male";
    if (gender === 0) return "Female";
    return "Not specified";
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
      <div className="flex flex-col gap-4 p-6 h-auto min-h-[280px]">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <Avatar className="w-16 h-16 ring-2 ring-offset-2 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
              <AvatarImage
                src="https://i.pravatar.cc/100?img=12"
                alt={`${teacher.full_name} Avatar`}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                {teacher.full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "T"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground mb-1 truncate group-hover:text-primary transition-colors">
              {teacher.full_name || "Unknown Teacher"}
            </h3>

            <div className="flex flex-wrap gap-1 mb-2">
              <Badge variant="secondary" className="text-xs bg-muted/60 text-muted-foreground">
                {formatGender(teacher.gender)}
              </Badge>
              {teacher.department && (
                <Badge variant="outline" className="text-xs">
                  {teacher.department}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {teacher.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4 shrink-0" />
              <span className="truncate">{teacher.email}</span>
            </div>
          )}

          {teacher.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4 shrink-0" />
              <span className="truncate">{teacher.phone}</span>
            </div>
          )}

          {teacher.address && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="truncate">{teacher.address}</span>
            </div>
          )}

          {teacher.qualification && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span className="truncate">{teacher.qualification}</span>
            </div>
          )}

          {teacher.faculty && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="w-4 h-4 shrink-0" />
              <span className="truncate">{teacher.faculty.name || "Faculty"}</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-2">
          <TeacherDetailDialog teacher={teacher} />
        </div>
      </div>
    </Card>
  );
};

export default TeacherItem;
