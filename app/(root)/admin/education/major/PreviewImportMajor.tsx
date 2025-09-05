import React, { useEffect, useMemo, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle, Upload, XCircle } from "lucide-react";
import * as XLSX from "xlsx";

interface MajorImportData {
  id?: string;
  name: string;
  code: string;
  description: string;
  faculty: string;
  status: "valid" | "warning" | "error";
  errors?: string[];
  warnings?: string[];
  rowNumber: number;
}

interface PreviewImportMajorProps {
  file: File;
  onConfirm: (validData: MajorImportData[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
  open: boolean;
}

export default function PreviewImportMajor({
  file,
  onConfirm,
  onCancel,
  isLoading = false,
  open,
}: PreviewImportMajorProps) {
  const [data, setData] = useState<MajorImportData[]>([]);
  const [parsingError, setParsingError] = useState<string | null>(null);

  useEffect(() => {
    const parseFile = async () => {
      setParsingError(null);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        // Prefer the sheet named "Major Template"; fallback to the first sheet
        const sampleSheetName =
          workbook.SheetNames.find((name) => name.trim().toLowerCase() === "major template") || workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sampleSheetName];
        const json: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const parsed: MajorImportData[] = json.map((row, index) => {
          const name = String(row.name || row["Name"] || row["major_name"] || "").trim();
          const code = String(row.code || row["Code"] || row["major_code"] || "").trim();
          const description = String(row.description || row["Description"] || row["major_description"] || "").trim();
          const faculty = String(row.faculty || row["Faculty"] || row["major_faculty"] || "").trim();

          const errors: string[] = [];
          const warnings: string[] = [];

          if (!name) errors.push("Major name is required");
          if (!code) errors.push("Major code is required");
          if (!description) errors.push("Description is required");
          if (!faculty) errors.push("Faculty is required");

          // Validate code format (should be alphanumeric and uppercase)
          if (code) {
            const codeRegex = /^[A-Z0-9]+$/;
            if (!codeRegex.test(code)) {
              warnings.push("Major code should contain only uppercase letters and numbers");
            }
          }

          // Validate name length
          if (name && name.length < 2) {
            warnings.push("Major name should be at least 2 characters long");
          }

          // Validate description length
          if (description && description.length < 10) {
            warnings.push("Description should be at least 10 characters long");
          }

          const status: "valid" | "warning" | "error" =
            errors.length > 0 ? "error" : warnings.length > 0 ? "warning" : "valid";

          return {
            name,
            code,
            description,
            faculty,
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
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Preview Major Import</DialogTitle>
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
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Faculty</TableHead>
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
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.faculty}</TableCell>
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
