"use client";

import React from "react";

import { FacultyModel } from "@/app/api/model/model";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ConfirmExportDepartProps {
  departments: FacultyModel[];
}

export default function ConfirmExportDepart({ departments }: ConfirmExportDepartProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Departments to Export</h3>
        <Badge variant="secondary" className="px-3 py-1">
          {departments.length} department{departments.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="rounded-lg border bg-card max-h-96 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="h-12 text-sm font-medium">Department</TableHead>
              <TableHead className="h-12 text-sm font-medium">Contact Info</TableHead>
              <TableHead className="h-12 text-sm font-medium">Dean</TableHead>
              <TableHead className="h-12 text-sm font-medium">Majors</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.length > 0 ? (
              departments.map((department) => (
                <TableRow key={department.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="py-4">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{department.name}</div>
                      <div className="text-sm text-muted-foreground">{department.code || "No code"}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="font-medium text-foreground">{department.contact_info || "No contact info"}</div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="font-medium text-foreground">{department.dean || "Not assigned"}</div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="secondary" className="font-medium">
                      {department.majors?.length || 0} major{department.majors?.length !== 1 ? "s" : ""}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No departments to export
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
