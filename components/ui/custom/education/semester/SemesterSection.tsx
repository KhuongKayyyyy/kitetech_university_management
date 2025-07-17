"use client";

import * as React from "react";

import { SemesterModel } from "@/app/api/model/SemesterModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Grid, List, Plus, Search } from "lucide-react";

import AddNewSemesterDialog from "./AddNewSemesterDialog";
import SemesterItem from "./SemesterItem";
import { SemesterTable } from "./SemesterTable";

interface SemesterSectionProps {
  semesters: SemesterModel[];
  onSemesterClick?: (semester: SemesterModel) => void;
}

export default function SemesterSection({ semesters, onSemesterClick }: SemesterSectionProps) {
  const [isAddingSemester, setIsAddingSemester] = React.useState(false);
  const [viewType, setViewType] = React.useState<"card" | "table">("card");
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredSemesters = React.useMemo(() => {
    if (!searchTerm) return semesters;

    return semesters.filter(
      (semester) =>
        semester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        semester.academic_year_id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        semester.status.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [semesters, searchTerm]);

  const handleAddSemester = async (semester: any) => {
    try {
      setIsAddingSemester(false);
    } catch (error) {
      console.error("Failed to add semester:", error);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-2xl font-semibold">Semesters</CardTitle>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search semesters..."
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
                <Button size="sm" onClick={() => setIsAddingSemester(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Semester
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Content */}
          {viewType === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSemesters.map((semester) => (
                <SemesterItem key={semester.id} semester={semester} onClick={onSemesterClick} />
              ))}
            </div>
          ) : (
            <SemesterTable semesters={filteredSemesters} />
          )}

          {filteredSemesters.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "No semesters found matching your search." : "No semesters found."}
            </div>
          )}
        </CardContent>
      </Card>

      <AddNewSemesterDialog
        isOpen={isAddingSemester}
        onOpenChange={setIsAddingSemester}
        onSemesterAdd={handleAddSemester}
      />
    </>
  );
}
