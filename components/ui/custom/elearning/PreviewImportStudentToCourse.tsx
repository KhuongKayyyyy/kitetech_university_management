import React, { useEffect, useMemo, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle, Upload, X, XCircle } from "lucide-react";
import * as XLSX from "xlsx";

interface StudentToCourseImportData {
  id?: string;
  username: string;
  fullName: string;
  email: string;
  studentCode: string;
  status: "valid" | "warning" | "error";
  errors?: string[];
  warnings?: string[];
  rowNumber: number;
}

interface PreviewImportStudentToCourseProps {
  file: File;
  onConfirm: (validData: StudentToCourseImportData[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
  open: boolean;
}

export default function PreviewImportStudentToCourse({
  file,
  onConfirm,
  onCancel,
  isLoading = false,
  open,
}: PreviewImportStudentToCourseProps) {
  const [data, setData] = useState<StudentToCourseImportData[]>([]);
  const [parsingError, setParsingError] = useState<string | null>(null);

  useEffect(() => {
    const parseFile = async () => {
      setParsingError(null);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        // Prefer the sheet named "Student Template"; fallback to the first sheet
        const sampleSheetName =
          workbook.SheetNames.find((name) => name.trim().toLowerCase().includes("student")) || workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sampleSheetName];
        const json: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const parsed: StudentToCourseImportData[] = json.map((row, index) => {
          const username = String(row.username || row["Username"] || row["user_name"] || "").trim();
          const fullName = String(row.fullName || row["Full Name"] || row["full_name"] || "").trim();
          const email = String(row.email || row["Email"] || row["email_address"] || "").trim();
          const studentCode = String(row.studentCode || row["Student Code"] || row["student_code"] || "").trim();

          const errors: string[] = [];
          const warnings: string[] = [];

          // Required field validations
          if (!username) errors.push("Username is required");
          if (!fullName) errors.push("Full name is required");
          if (!email) {
            errors.push("Email is required");
          } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) errors.push("Invalid email format");
          }
          if (!studentCode) errors.push("Student code is required");

          // Username validation
          if (username && username.length < 3) {
            warnings.push("Username should be at least 3 characters long");
          }

          // Username format validation (alphanumeric and underscores only)
          if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
            warnings.push("Username should only contain letters, numbers, and underscores");
          }

          // Full name validation
          if (fullName && fullName.length < 2) {
            warnings.push("Full name should be at least 2 characters long");
          }

          // Student code validation
          if (studentCode && studentCode.length < 3) {
            warnings.push("Student code should be at least 3 characters long");
          }

          const status: "valid" | "warning" | "error" =
            errors.length > 0 ? "error" : warnings.length > 0 ? "warning" : "valid";

          return {
            username,
            fullName,
            email,
            studentCode,
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

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Preview Student Import to Course</DialogTitle>
        </DialogHeader>

        {parsingError && (
          <Alert>
            <AlertDescription>{parsingError}</AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-green-600">{stats.valid}</div>
                <div className="text-sm text-muted-foreground">Valid</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-h-[60vh] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Status</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Student Code</TableHead>
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
                  <TableCell className="font-mono text-sm">{item.username}</TableCell>
                  <TableCell>{item.fullName}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell className="font-mono text-sm">{item.studentCode}</TableCell>
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
          <Button onClick={handleConfirm} disabled={isLoading || validData.length === 0} className="min-w-32">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Import {validData.length} Student{validData.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
