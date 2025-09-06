import React, { useEffect, useMemo, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle, Upload, XCircle } from "lucide-react";
import * as XLSX from "xlsx";

interface CourseImportData {
  id?: string;
  subject: string;
  teacher: string;
  semester: string;
  location: string;
  schedules: string;
  start_date: string;
  end_date: string;
  status: "valid" | "warning" | "error";
  errors?: string[];
  warnings?: string[];
  rowNumber: number;
}

interface PreviewImportCourseProps {
  file: File;
  onConfirm: (validData: CourseImportData[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
  open: boolean;
}

export default function PreviewImportCourse({
  file,
  onConfirm,
  onCancel,
  isLoading = false,
  open,
}: PreviewImportCourseProps) {
  const [data, setData] = useState<CourseImportData[]>([]);
  const [parsingError, setParsingError] = useState<string | null>(null);

  useEffect(() => {
    const parseFile = async () => {
      setParsingError(null);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        // Prefer the sheet named "Classroom Template"; fallback to the first sheet
        const sampleSheetName =
          workbook.SheetNames.find((name) => name.trim().toLowerCase() === "classroom template") ||
          workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sampleSheetName];
        const json: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        // Helper function to normalize date formats
        const normalizeDate = (dateStr: string) => {
          if (!dateStr) return dateStr;
          const parts = dateStr.split(/[\/\-]/);
          if (parts.length === 3) {
            // Detect if format is DD/MM/YYYY (day > 12)
            if (parseInt(parts[0]) > 12) {
              return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
            }
            // Detect if format is MM/DD/YYYY (month > 12, day <= 12)
            else if (parseInt(parts[1]) > 12 && parseInt(parts[0]) <= 12) {
              return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`;
            }
            // Already in YYYY-MM-DD format or ambiguous case
            else if (parts[0].length === 4) {
              return dateStr; // Already in YYYY-MM-DD format
            }
            // Default to MM/DD/YYYY interpretation
            else {
              return `${parts[2]}-${parts[0].padStart(2, "0")}-${parts[1].padStart(2, "0")}`;
            }
          }
          return dateStr;
        };

        const parsed: CourseImportData[] = json.map((row, index) => {
          const subject = String(row.subject || row["Subject"] || row["course_subject"] || "").trim();
          const teacher = String(row.teacher || row["Teacher"] || row["course_teacher"] || "").trim();
          const semester = String(row.semester || row["Semester"] || row["course_semester"] || "").trim();
          const location = String(row.location || row["Location"] || row["course_location"] || "").trim();
          const schedules = String(row.schedules || row["Schedules"] || row["course_schedules"] || "").trim();
          const start_date = String(row.start_date || row["Start Date"] || row["course_start_date"] || "").trim();
          const end_date = String(row.end_date || row["End Date"] || row["course_end_date"] || "").trim();

          const errors: string[] = [];
          const warnings: string[] = [];

          // Required field validations
          if (!subject) errors.push("Subject is required");
          if (!teacher) errors.push("Teacher is required");
          if (!semester) errors.push("Semester is required");
          if (!location) errors.push("Location is required");
          if (!schedules) errors.push("Schedules is required");
          if (!start_date) errors.push("Start date is required");
          if (!end_date) errors.push("End date is required");

          // Subject validation
          if (subject && subject.length < 2) {
            warnings.push("Subject name should be at least 2 characters long");
          }

          // Teacher validation
          if (teacher && teacher.length < 2) {
            warnings.push("Teacher name should be at least 2 characters long");
          }

          // Semester format validation
          if (semester && !/^HK[12]\s\d{4}-\d{4}$/.test(semester)) {
            warnings.push("Semester should be in format 'HK1 2025-2026' or 'HK2 2025-2026'");
          }

          // Location validation
          if (location && !/^[A-D]\d{3}$/.test(location)) {
            warnings.push("Location should be in format like 'C001', 'A101', etc.");
          }

          // Schedule validation (format: 1Mon, 2Fri, etc.)
          if (schedules) {
            const schedulePattern = /^\d+[A-Za-z]{3}(,\s*\d+[A-Za-z]{3})*$/;
            if (!schedulePattern.test(schedules)) {
              errors.push("Schedules should be in format like '1Mon, 2Fri' (Section + Day)");
            } else {
              // Validate individual schedule entries
              const scheduleEntries = schedules.split(",").map((s) => s.trim());
              for (const entry of scheduleEntries) {
                const section = parseInt(entry.match(/^\d+/)?.[0] || "0");
                const day = entry.replace(/^\d+/, "");

                if (section < 1 || section > 4) {
                  errors.push(`Section must be between 1-4, found: ${section}`);
                }

                const validDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                if (!validDays.includes(day)) {
                  errors.push(`Invalid day: ${day}. Must be one of: ${validDays.join(", ")}`);
                }
              }
            }
          }

          // Date validation with normalization
          let normalizedStartDate: string | null = null;
          let normalizedEndDate: string | null = null;

          if (start_date) {
            normalizedStartDate = normalizeDate(start_date);
            const startDate = new Date(normalizedStartDate);
            if (isNaN(startDate.getTime())) {
              errors.push("Invalid start date format");
            }
          }

          if (end_date) {
            normalizedEndDate = normalizeDate(end_date);
            const endDate = new Date(normalizedEndDate);
            if (isNaN(endDate.getTime())) {
              errors.push("Invalid end date format");
            }
          }

          // Date range validation
          if (normalizedStartDate && normalizedEndDate) {
            const startDate = new Date(normalizedStartDate);
            const endDate = new Date(normalizedEndDate);
            if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate >= endDate) {
              errors.push("End date must be after start date");
            }
          }

          const status: "valid" | "warning" | "error" =
            errors.length > 0 ? "error" : warnings.length > 0 ? "warning" : "valid";

          return {
            subject,
            teacher,
            semester,
            location,
            schedules,
            start_date: normalizedStartDate || start_date,
            end_date: normalizedEndDate || end_date,
            status,
            errors: errors.length ? errors : undefined,
            warnings: warnings.length ? warnings : undefined,
            rowNumber: index + 2, // assuming headers on first row
          };
        });

        setData(parsed);
      } catch (err: any) {
        console.error("Failed to parse file", err);
        setParsingError("Unable to parse the file. Please check the template and try again.");
      }
    };

    parseFile();
  }, [file]);

  const stats = useMemo(() => {
    const valid = data.filter((item) => item.status === "valid").length;
    const warnings = data.filter((item) => item.status === "warning").length;
    const errors = data.filter((item) => item.status === "error").length;
    return { valid, warnings, errors, total: data.length };
  }, [data]);

  const validData = useMemo(() => {
    return data.filter((item) => item.status === "valid" || item.status === "warning");
  }, [data]);

  const handleConfirm = () => {
    onConfirm(validData);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Valid
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Warning
          </Badge>
        );
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Preview Course Import</DialogTitle>
        </DialogHeader>

        {parsingError && (
          <Alert>
            <AlertDescription>{parsingError}</AlertDescription>
          </Alert>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.valid}</div>
            <div className="text-sm text-green-700">Valid</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
            <div className="text-sm text-yellow-700">Warnings</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
            <div className="text-sm text-red-700">Errors</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
            <div className="text-sm text-gray-700">Total</div>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Status</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Schedules</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Issues</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index} className={item.status === "error" ? "bg-red-50" : ""}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(item.status)}
                      {getStatusBadge(item.status)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.subject}</TableCell>
                  <TableCell>{item.teacher}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.semester}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.location}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{item.schedules}</TableCell>
                  <TableCell>{formatDate(item.start_date)}</TableCell>
                  <TableCell>{formatDate(item.end_date)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {item.errors?.map((error, i) => (
                        <div key={i} className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                          {error}
                        </div>
                      ))}
                      {item.warnings?.map((warning, i) => (
                        <div key={i} className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                          {warning}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading || stats.valid === 0} className="min-w-32">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Import {stats.valid} Course{stats.valid !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
