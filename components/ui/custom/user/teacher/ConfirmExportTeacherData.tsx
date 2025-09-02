"use client";

import React from "react";

import { departmentData } from "@/app/api/fakedata";
import { Teacher } from "@/app/api/model/TeacherModel";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ConfirmExportTeacherDataProps {
  teachers: Teacher[];
}

export default function ConfirmExportTeacherData({ teachers }: ConfirmExportTeacherDataProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Teachers to Export</h3>
        <Badge variant="secondary" className="px-3 py-1">
          {teachers.length} teacher{teachers.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="rounded-lg border bg-card max-h-96 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="h-12 text-sm font-medium">Teacher</TableHead>
              <TableHead className="h-12 text-sm font-medium">Contact</TableHead>
              <TableHead className="h-12 text-sm font-medium">Academic Info</TableHead>
              <TableHead className="h-12 text-sm font-medium">Birthday</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <TableRow key={teacher.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="py-4">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{teacher.full_name}</div>
                      <div className="text-sm text-muted-foreground">{teacher.id}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{teacher.email}</div>
                      <div className="text-sm text-muted-foreground">{teacher.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">
                        {departmentData.find((d) => d.id === teacher.faculty_id)?.name || "Unknown Department"}
                      </div>
                      <div className="text-sm text-muted-foreground">Teacher</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {teacher.birth_date ? (
                      <div className="font-medium text-foreground">
                        {new Date(teacher.birth_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">-</div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <p>No teachers selected for export</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
