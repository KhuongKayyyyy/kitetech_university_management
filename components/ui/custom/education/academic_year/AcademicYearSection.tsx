"use client";

import * as React from "react";

import { AcademicYearModel } from "@/app/api/model/AcademicYearModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Grid, List, Search } from "lucide-react";

import AcademicYearItem from "./AcademicYearItem";
import { AcademicYearTable } from "./AcademicYearTable";

interface AcademicYearSectionProps {
  academicYears: AcademicYearModel[];
  onAcademicYearClick?: (academicYear: AcademicYearModel) => void;
}

export default function AcademicYearSection({ academicYears, onAcademicYearClick }: AcademicYearSectionProps) {
  const [viewType, setViewType] = React.useState<"card" | "table">("card");
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredAcademicYears = React.useMemo(() => {
    if (!searchTerm) return academicYears;

    return academicYears.filter(
      (academicYear) =>
        academicYear.year.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        academicYear.status.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [academicYears, searchTerm]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-2xl font-semibold">Academic Years</CardTitle>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search academic years..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewType === "card" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("card")}
              >
                <Grid className="h-4 w-4 mr-2" />
                Card View
              </Button>
              <Button
                variant={viewType === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("table")}
              >
                <List className="h-4 w-4 mr-2" />
                Table View
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Content */}
        {viewType === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAcademicYears.map((academicYear) => (
              <AcademicYearItem key={academicYear.id} academicYear={academicYear} />
            ))}
          </div>
        ) : (
          <AcademicYearTable academicYears={filteredAcademicYears} />
        )}

        {filteredAcademicYears.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "No academic years found matching your search." : "No academic years found."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
