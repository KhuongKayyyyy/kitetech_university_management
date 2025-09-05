import React, { useEffect, useMemo, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle, Upload, XCircle } from "lucide-react";
import * as XLSX from "xlsx";

interface SubjectImportData {
  id?: string;
  name: string;
  credits: string;
  description: string;
  faculty: string;
  grading_formula: string;
  status: "valid" | "warning" | "error";
  errors?: string[];
  warnings?: string[];
  rowNumber: number;
}

interface PreviewImportSubjectProps {
  file: File;
  onConfirm: (validData: SubjectImportData[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
  open: boolean;
}

export default function PreviewImportSubject({
  file,
  onConfirm,
  onCancel,
  isLoading = false,
  open,
}: PreviewImportSubjectProps) {
  const [data, setData] = useState<SubjectImportData[]>([]);
  const [parsingError, setParsingError] = useState<string | null>(null);

  useEffect(() => {
    const parseFile = async () => {
      setParsingError(null);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        // Prefer the sheet named "Subject Template"; fallback to the first sheet
        const sampleSheetName =
          workbook.SheetNames.find((name) => name.trim().toLowerCase() === "subject template") ||
          workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sampleSheetName];
        const json: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const parsed: SubjectImportData[] = json.map((row, index) => {
          const name = String(row.name || row["Name"] || row["subject_name"] || "").trim();
          const credits = String(row.credits || row["Credits"] || row["subject_credits"] || "").trim();
          const description = String(row.description || row["Description"] || row["subject_description"] || "").trim();
          const faculty = String(row.faculty || row["Faculty"] || row["subject_faculty"] || "").trim();
          const grading_formula = String(
            row.grading_formula || row["Grading Formula"] || row["subject_grading_formula"] || "",
          ).trim();

          const errors: string[] = [];
          const warnings: string[] = [];

          if (!name) errors.push("Subject name is required");
          if (!credits) errors.push("Credits is required");
          if (!description) errors.push("Description is required");
          if (!faculty) errors.push("Faculty is required");
          if (!grading_formula) errors.push("Grading formula is required");

          // Validate credits is a number
          if (credits) {
            const creditsNum = parseFloat(credits);
            if (isNaN(creditsNum) || creditsNum <= 0) {
              errors.push("Credits must be a positive number");
            } else if (creditsNum > 10) {
              warnings.push("Credits seem unusually high (>10)");
            }
          }

          // Validate name length
          if (name && name.length < 2) {
            warnings.push("Subject name should be at least 2 characters long");
          }

          // Validate description length
          if (description && description.length < 10) {
            warnings.push("Description should be at least 10 characters long");
          }

          const status: "valid" | "warning" | "error" =
            errors.length > 0 ? "error" : warnings.length > 0 ? "warning" : "valid";

          return {
            name,
            credits,
            description,
            faculty,
            grading_formula,
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
          <DialogTitle>Preview Subject Import</DialogTitle>
        </DialogHeader>

        {parsingError && (
          <Alert>
            <AlertDescription>{parsingError}</AlertDescription>
          </Alert>
        )}

        <div className="max-h-[60vh] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Grading Formula</TableHead>
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
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.credits}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.faculty}</TableCell>
                  <TableCell>{item.grading_formula}</TableCell>
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
          <Button onClick={handleConfirm} disabled={isLoading} className="min-w-32">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Confirm
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
