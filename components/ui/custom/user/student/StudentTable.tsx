"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";

import { departmentData, students } from "@/app/api/fakedata";
import { Student } from "@/app/api/model/StudentModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, getMajorNameById } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleX,
  Columns3,
  Download,
  Edit,
  Eye,
  Filter,
  ListFilter,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
  UserPlus,
} from "lucide-react";
import { toast, Toaster } from "sonner";

import StudentDetailDialog from "./StudentDetailDialog";

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Student> = (row, filterValue) => {
  const searchableRowContent =
    `${row.original.full_name} ${row.original.email} ${row.original.phone} ${row.original.address}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const genderFilterFn: FilterFn<Student> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true;
  const gender = row.original.gender;
  return filterValue.includes(gender?.toString() || "");
};

const classFilterFn: FilterFn<Student> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true;
  const classCode = row.original.classes?.class_code || "";
  return filterValue.includes(classCode);
};

const majorFilterFn: FilterFn<Student> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true;
  const majorId = row.original.classes?.major?.id?.toString() || "";
  return filterValue.includes(majorId);
};

const columns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    size: 40,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Student",
    accessorKey: "full_name",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium text-foreground">{row.original.full_name}</div>
        <div className="text-sm text-muted-foreground">ID: {row.original.id}</div>
      </div>
    ),
    size: 200,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: "Contact",
    accessorKey: "email",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium text-foreground">{row.original.email}</div>
        <div className="text-sm text-muted-foreground">{row.original.phone}</div>
      </div>
    ),
    size: 250,
  },
  {
    header: "Address",
    accessorKey: "address",
    cell: ({ row }) => <div className="font-medium text-foreground">{row.original.address}</div>,
    size: 200,
  },
  {
    header: "Major",
    accessorKey: "majorId",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">{row.original.classes?.major?.name}</div>
      </div>
    ),
    size: 220,
    filterFn: majorFilterFn,
  },
  {
    header: "Class",
    accessorKey: "classCode",
    cell: ({ row }) => <div className="font-medium text-foreground">{row.original.classes?.class_code || ""}</div>,
    size: 120,
    filterFn: classFilterFn,
  },
  {
    header: "Birthday",
    accessorKey: "birth_date",
    cell: ({ row }) => {
      const birthDate = row.original.birth_date;
      const formattedDate = birthDate ? new Date(birthDate).toLocaleDateString() : "";
      return <div className="font-medium text-foreground">{formattedDate}</div>;
    },
    size: 120,
  },
  {
    header: "Gender",
    accessorKey: "gender",
    cell: ({ row }) => {
      const gender = row.original.gender;
      const genderText = gender === 1 ? "Male" : gender === 0 ? "Female" : "Other";
      return (
        <Badge
          variant="outline"
          className={cn(
            gender === 1
              ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
              : gender === 0
                ? "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800"
                : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700",
          )}
        >
          {genderText}
        </Badge>
      );
    },
    size: 100,
    filterFn: genderFilterFn,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableHiding: false,
  },
];

interface StudentDatabaseProps {
  students?: Student[];
  onStudentUpdated?: () => void;
}

export default function StudentTable({ students, onStudentUpdated }: StudentDatabaseProps) {
  const id = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "full_name",
      desc: false,
    },
  ]);

  const [data, setData] = useState<Student[]>(students ?? []);
  useEffect(() => {
    async function fetchPosts() {
      // test fetch data
      // const res = await fetch(
      //     "https://res.cloudinary.com/dlzlfasou/raw/upload/users-01_fertyx.json",
      // );
      // const data = await res.json();
      // const data = students;
      // setData(data);
    }
    fetchPosts();
  }, []);

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const updatedData = data.filter((item) => !selectedRows.some((row) => String(row.original.id) === String(item.id)));
    setData(updatedData);
    table.resetRowSelection();
    onStudentUpdated?.();
    toast.success(`${selectedRows.length} student${selectedRows.length === 1 ? "" : "s"} deleted successfully`);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  const uniqueGenderValues = useMemo(() => {
    const genders = new Set<string>();
    data.forEach((student) => {
      if (student.gender !== undefined && student.gender !== null) {
        genders.add(student.gender.toString());
      }
    });
    return Array.from(genders).sort();
  }, [data]);

  const uniqueClassValues = useMemo(() => {
    const classes = new Set<string>();
    data.forEach((student) => {
      if (student.classes?.class_code) {
        classes.add(student.classes.class_code);
      }
    });
    return Array.from(classes).sort();
  }, [data]);

  const uniqueMajorValues = useMemo(() => {
    const majors = new Set<string>();
    data.forEach((student) => {
      if (student.classes?.major?.id) {
        majors.add(student.classes.major.id.toString());
      }
    });
    return Array.from(majors).sort();
  }, [data]);

  const selectedGenders = useMemo(() => {
    const filterValue = table.getColumn("gender")?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn("gender")?.getFilterValue()]);

  const selectedClasses = useMemo(() => {
    const filterValue = table.getColumn("classCode")?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn("classCode")?.getFilterValue()]);

  const selectedMajors = useMemo(() => {
    const filterValue = table.getColumn("majorId")?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn("majorId")?.getFilterValue()]);

  const handleGenderChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("gender")?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table.getColumn("gender")?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  const handleClassChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("classCode")?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table.getColumn("classCode")?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  const handleMajorChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("majorId")?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table.getColumn("majorId")?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  const globalFilterValue = useMemo(() => {
    return (table.getColumn("full_name")?.getFilterValue() ?? "") as string;
  }, [table.getColumn("full_name")?.getFilterValue()]);

  const hasActiveFilters = useMemo(() => {
    return globalFilterValue || selectedGenders.length > 0 || selectedClasses.length > 0 || selectedMajors.length > 0;
  }, [globalFilterValue, selectedGenders.length, selectedClasses.length, selectedMajors.length]);

  const clearAllFilters = () => {
    table.getColumn("full_name")?.setFilterValue("");
    table.getColumn("gender")?.setFilterValue(undefined);
    table.getColumn("classCode")?.setFilterValue(undefined);
    table.getColumn("majorId")?.setFilterValue(undefined);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const buildCsvFromStudents = (items: Student[]) => {
    const headers = ["id", "full_name", "email", "phone", "address", "birth_date", "gender", "class_code", "major_id"];
    const escapeCsv = (value: unknown) => {
      if (value === null || value === undefined) return "";
      const str = String(value);
      if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}` + `"`;
      }
      return str;
    };
    const rows = items.map((s) => [
      s.id,
      s.full_name,
      s.email,
      s.phone,
      s.address,
      s.birth_date ? new Date(s.birth_date).toISOString().split("T")[0] : "",
      s.gender,
      s.classes?.class_code ?? "",
      s.classes?.major?.id ?? "",
    ]);
    const lines = [headers, ...rows].map((r) => r.map(escapeCsv).join(","));
    return lines.join("\n");
  };

  const handleConfirmExport = () => {
    const selected = table.getSelectedRowModel().rows.map((r) => r.original as Student);
    if (!selected.length) {
      toast.error("No selected students to export");
      return;
    }
    const csv = buildCsvFromStudents(selected);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const ts = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const fileName = `students_export_${ts.getFullYear()}${pad(ts.getMonth() + 1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.csv`;
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    setExportDialogOpen(false);
    toast.success(`Exported ${selected.length} student${selected.length === 1 ? "" : "s"}`);
  };

  const getGenderText = (gender: number | undefined) => {
    if (gender === 1) return "Male";
    if (gender === 0) return "Female";
    return "Other";
  };

  return (
    <div className="space-y-6 p-6">
      <Toaster />
      {/* Filters and Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Gender Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Gender
                  {selectedGenders.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                      {selectedGenders.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-3" align="start">
                <div className="space-y-3">
                  <div className="text-sm font-medium">Filter by gender</div>
                  <div className="space-y-2">
                    {uniqueGenderValues.map((value) => (
                      <div key={value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`gender-${value}`}
                          checked={selectedGenders.includes(value)}
                          onCheckedChange={(checked: boolean) => handleGenderChange(checked, value)}
                        />
                        <Label htmlFor={`gender-${value}`} className="flex-1 text-sm font-normal capitalize">
                          {getGenderText(parseInt(value))}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Class Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Class
                  {selectedClasses.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                      {selectedClasses.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-3" align="start">
                <div className="space-y-3">
                  <div className="text-sm font-medium">Filter by class</div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uniqueClassValues.map((value) => (
                      <div key={value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`class-${value}`}
                          checked={selectedClasses.includes(value)}
                          onCheckedChange={(checked: boolean) => handleClassChange(checked, value)}
                        />
                        <Label htmlFor={`class-${value}`} className="flex-1 text-sm font-normal">
                          {value}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Major Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Major
                  {selectedMajors.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                      {selectedMajors.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="start">
                <div className="space-y-3">
                  <div className="text-sm font-medium">Filter by major</div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uniqueMajorValues.map((value) => (
                      <div key={value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`major-${value}`}
                          checked={selectedMajors.includes(value)}
                          onCheckedChange={(checked: boolean) => handleMajorChange(checked, value)}
                        />
                        <Label htmlFor={`major-${value}`} className="flex-1 text-sm font-normal text-black">
                          {getMajorNameById(value)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Column Visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Columns3 className="h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearAllFilters} className="gap-2">
                <CircleX className="h-4 w-4" />
                Clear filters
              </Button>
            )}
          </div>

          {/* Bulk Actions */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{table.getSelectedRowModel().rows.length} selected</span>
              <AlertDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Review Export
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to export {table.getSelectedRowModel().rows.length} selected student
                      {table.getSelectedRowModel().rows.length === 1 ? "" : "s"}. Review the list below.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="max-h-64 overflow-auto rounded-md border p-3 text-sm">
                    {table.getSelectedRowModel().rows.map((r) => (
                      <div key={String((r.original as Student).id)} className="flex items-center justify-between py-1">
                        <span className="font-medium text-foreground">{(r.original as Student).full_name}</span>
                        <span className="text-muted-foreground">{(r.original as Student).email}</span>
                      </div>
                    ))}
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmExport}>Confirm Export</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-2">
                    <Trash className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <CircleAlert className="h-5 w-5 text-destructive" />
                      Delete Students
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {table.getSelectedRowModel().rows.length} student
                      {table.getSelectedRowModel().rows.length === 1 ? "" : "s"}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteRows}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: `${header.getSize()}px` }} className="h-12">
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className={cn(
                          "flex cursor-pointer select-none items-center gap-2 text-sm font-medium",
                          "hover:text-foreground transition-colors",
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ChevronUp className="h-4 w-4" />,
                          desc: <ChevronDown className="h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    ) : (
                      <div className="text-sm font-medium">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Search className="h-8 w-8" />
                    <p>No students found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Label htmlFor={`${id}-pagesize`} className="text-sm">
            Show
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger id={`${id}-pagesize`} className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">entries</span>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length,
              )}
            </span>{" "}
            of <span className="font-medium text-foreground">{table.getFilteredRowModel().rows.length}</span> entries
          </p>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="gap-1"
                >
                  <ChevronFirst className="h-4 w-4" />
                  First
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  className="gap-1"
                >
                  Last
                  <ChevronLast className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

function RowActions({ row }: { row: Row<Student> }) {
  const student = row.original;
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setViewDialogOpen(true)} className="gap-2">
              <Eye className="h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditDialogOpen(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Student
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
            <Trash className="h-4 w-4" />
            Delete Student
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <StudentDetailDialog student={student} open={viewDialogOpen} onOpenChange={setViewDialogOpen} />
    </>
  );
}

export { StudentTable as Component };
