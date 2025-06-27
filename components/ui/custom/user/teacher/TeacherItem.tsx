import React from "react";

import { Teacher } from "@/app/api/model/model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { Card } from "../../../card";
import { TeacherDetailDialog } from "./TeacherDetailDialog";

const TeacherItem = ({ teacher }: { teacher: Teacher }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
      <div className="flex items-center gap-6 p-6 h-[180px] md:h-[200px]">
        <div className="shrink-0">
          <Avatar className="w-20 h-20 ring-2 ring-offset-2 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
            <AvatarImage
              src="https://i.pravatar.cc/100?img=12"
              alt={`${teacher.name} Avatar`}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-lg">
              {teacher.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "T"}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-col justify-center items-start flex-1 min-w-0">
          <h3 className="text-xl font-bold text-foreground mb-2 truncate w-full group-hover:text-primary transition-colors">
            {teacher.name}
          </h3>

          <Badge variant="secondary" className="mb-3 bg-muted/60 text-muted-foreground">
            Senior Lecturer
          </Badge>

          <div className="w-full">
            <TeacherDetailDialog teacher={teacher} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TeacherItem;
