"use client";

import React from "react";

import { MajorModel } from "@/app/api/model/model";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ConfirmExportMajorProps {
  majors: MajorModel[];
}

export default function ConfirmExportMajor({ majors }: ConfirmExportMajorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Majors to Export</h3>
        <Badge variant="secondary" className="px-3 py-1">
          {majors.length} major{majors.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="rounded-lg border bg-card max-h-96 overflow-auto w-full">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="h-12 text-sm font-medium w-32">Major Code</TableHead>
              <TableHead className="h-12 text-sm font-medium w-64">Major Name</TableHead>
              <TableHead className="h-12 text-sm font-medium flex-1">Description</TableHead>
              <TableHead className="h-12 text-sm font-medium w-48">Department</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {majors.length > 0 ? (
              majors.map((major) => (
                <TableRow key={major.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="py-4 w-32">
                    <div className="font-mono text-sm font-medium text-foreground uppercase">
                      {major.code || "No code"}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 w-64">
                    <div className="font-medium text-foreground capitalize">{major.name}</div>
                  </TableCell>
                  <TableCell className="py-4 flex-1">
                    <div className="text-muted-foreground">{major.description || "No description available"}</div>
                  </TableCell>
                  <TableCell className="py-4 w-48">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {major.faculty?.name || "Unknown Faculty"}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No majors to export
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
