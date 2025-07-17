import React, { useMemo, useState } from "react";

import { SemesterModel } from "@/app/api/model/SemesterModel";
import { SemesterWeekModel } from "@/app/api/model/SemesterWeekModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, LayoutGrid, List, Plus, Search } from "lucide-react";

import AddNewSemesterWeekDialog from "./AddNewSemesterWeekDialog";
import SemesterWeekItem from "./SemesterWeekItem";
import SemesterWeekTable from "./SemesterWeekTable";

interface SemesterWeekSectionProps {
  weeks: SemesterWeekModel[];
  semesters: SemesterModel[];
  onWeekClick?: (week: SemesterWeekModel) => void;
  onEditWeek?: (week: SemesterWeekModel) => void;
  onDeleteWeek?: (week: SemesterWeekModel) => void;
  onDeleteWeeks?: (weeks: SemesterWeekModel[]) => void;
}

export default function SemesterWeekSection({
  weeks,
  semesters,
  onWeekClick,
  onEditWeek,
  onDeleteWeek,
  onDeleteWeeks,
}: SemesterWeekSectionProps) {
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("all");
  const [isAddingWeek, setIsAddingWeek] = useState(false);

  // Centralized filtering logic
  const filteredWeeks = useMemo(() => {
    return weeks.filter((week) => {
      // Filter by semester
      const semesterMatch = selectedSemesterId === "all" || week.semester_id?.toString() === selectedSemesterId;

      // Filter by search query
      const searchMatch =
        searchQuery === "" ||
        week.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `week ${week.week_number}`.toLowerCase().includes(searchQuery.toLowerCase());

      return semesterMatch && searchMatch;
    });
  }, [weeks, selectedSemesterId, searchQuery]);

  const getSemesterName = (semesterId: number) => {
    const semester = semesters.find((s) => s.id === semesterId);
    return semester?.name || "Unknown Semester";
  };

  const groupedWeeks = useMemo(() => {
    const grouped: { [key: number]: SemesterWeekModel[] } = {};
    filteredWeeks.forEach((week) => {
      if (week.semester_id !== undefined && !grouped[week.semester_id]) {
        grouped[week.semester_id] = [];
      }
      if (week.semester_id !== undefined) {
        grouped[week.semester_id].push(week);
      }
    });

    // Sort weeks within each semester by week number
    Object.keys(grouped).forEach((semesterId) => {
      grouped[Number(semesterId)].sort((a, b) => (a.week_number ?? 0) - (b.week_number ?? 0));
    });

    return grouped;
  }, [filteredWeeks]);

  const getWeekStatus = (week: SemesterWeekModel) => {
    const now = new Date();
    const startDate = new Date(week.start_date || "");
    const endDate = new Date(week.end_date || "");

    if (now >= startDate && now <= endDate) return "Current";
    if (now > endDate) return "Completed";
    return "Upcoming";
  };

  const getStatusVariant = (status: string) => {
    if (status === "Current") return "default";
    if (status === "Completed") return "secondary";
    return "outline";
  };

  const handleAddSemesterWeek = async (week: any) => {
    try {
      setIsAddingWeek(false);
    } catch (error) {
      console.error("Failed to add semester week:", error);
    }
  };

  const renderCardView = () => (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {Object.keys(groupedWeeks).length === 0 ? (
              <div className="py-8">
                <div className="text-center text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2" />
                  <p>No weeks found matching your criteria.</p>
                </div>
              </div>
            ) : (
              Object.entries(groupedWeeks).map(([semesterId, semesterWeeks]) => {
                const semester = semesters.find((s) => s.id === Number(semesterId));
                return (
                  <div key={semesterId} className="space-y-4">
                    {/* Semester Header */}
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">{getSemesterName(Number(semesterId))}</h3>
                      {semester && (
                        <Badge variant={semester.status === "Active" ? "default" : "secondary"}>
                          {semester.status}
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {semesterWeeks.length} week{semesterWeeks.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Week Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {semesterWeeks.map((week) => (
                        <SemesterWeekItem key={week.id} week={week} onClick={onWeekClick} />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <AddNewSemesterWeekDialog
        isOpen={isAddingWeek}
        onOpenChange={setIsAddingWeek}
        onSemesterWeekAdd={handleAddSemesterWeek}
        semesters={semesters}
      />
    </>
  );

  const renderTableView = () => (
    <Card>
      <CardContent className="p-6">
        <SemesterWeekTable
          weeks={filteredWeeks}
          semesters={semesters}
          onWeekClick={onWeekClick}
          onEditWeek={onEditWeek}
          onDeleteWeek={onDeleteWeek}
          onDeleteWeeks={onDeleteWeeks}
        />
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Centralized Header with Search, Filter, and View Toggle */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <CardTitle>Semester Weeks</CardTitle>
              <Badge variant="outline">{filteredWeeks.length} weeks found</Badge>
              {selectedSemesterId !== "all" && (
                <Badge variant="secondary">Filtered by: {getSemesterName(Number(selectedSemesterId))}</Badge>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "card" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("card")}
                className="flex items-center gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
                Card View
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                Table View
              </Button>
              <Button variant="default" size="sm" onClick={() => setIsAddingWeek(true)}>
                <Plus className="h-4 w-4" />
                Add Week
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search weeks by description or week number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-64">
              <Select value={selectedSemesterId} onValueChange={setSelectedSemesterId}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesters.map((semester) => (
                    <SelectItem key={semester.id} value={semester.id.toString()}>
                      {semester.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content based on view mode */}
      {viewMode === "card" ? renderCardView() : renderTableView()}
    </div>
  );
}
