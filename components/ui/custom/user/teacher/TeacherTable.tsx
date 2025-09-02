"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";

import { departmentData, teachers } from "@/app/api/fakedata";
import { Teacher } from "@/app/api/model/TeacherModel";
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
import { toast } from "sonner";

import ConfirmExportTeacherData from "./ConfirmExportTeacherData";

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Teacher> = (row, columnId, filterValue) => {
  const searchableRowContent = `${row.original.full_name} ${row.original.email} ${row.original.id}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<Teacher> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as boolean;
  return filterValue.includes(status ? "active" : "inactive");
};

const departmentFilterFn: FilterFn<Teacher> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true;
  const department = row.original.faculty_id;
  return filterValue.includes(department?.toString() || "");
};

const columns: ColumnDef<Teacher>[] = [
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
    header: "Teacher",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium text-foreground">{`${row.original.full_name}`}</div>
        <div className="text-sm text-muted-foreground">{row.original.id}</div>
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
    header: "Academic Info",
    accessorKey: "department_id",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium text-foreground">
          {departmentData.find((d) => d.id === row.original.faculty_id)?.name || "Unknown Department"}
        </div>
        <div className="text-sm text-muted-foreground">Teacher</div>
      </div>
    ),
    size: 220,
    filterFn: departmentFilterFn,
  },
  {
    header: "Birthday",
    accessorKey: "date_of_birth",
    cell: ({ row }) => {
      const birthDate = row.original.birth_date;
      if (!birthDate) return <div className="text-muted-foreground">-</div>;

      const formatted = new Date(birthDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      return <div className="font-medium text-foreground">{formatted}</div>;
    },
    size: 120,
  },

  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableHiding: false,
  },
];

interface TeacherTableProps {
  teachers?: Teacher[];
}

export default function TeacherTable({ teachers: teachersProps }: TeacherTableProps) {
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
      id: "name",
      desc: false,
    },
  ]);

  const [data, setData] = useState<Teacher[]>(teachersProps ?? teachers ?? []);
  useEffect(() => {
    async function fetchPosts() {
      // test fetch data
      // const res = await fetch(
      //     "https://res.cloudinary.com/dlzlfasou/raw/upload/users-01_fertyx.json",
      // );
      // const data = await res.json();
      // const data = teachers;
      // setData(data);
    }
    fetchPosts();
  }, []);

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const updatedData = data.filter((item) => !selectedRows.some((row) => String(row.original.id) === String(item.id)));
    setData(updatedData);
    table.resetRowSelection();
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

  const uniqueStatusValues = useMemo(() => {
    return ["active", "inactive"];
  }, []);

  const uniqueDepartmentValues = useMemo(() => {
    const departmentIds = Array.from(new Set(data.map((teacher) => teacher.faculty_id).filter(Boolean)));
    return departmentIds
      .map((id) => ({
        id: id?.toString(),
        name: departmentData.find((d) => d.id === id)?.name || "Unknown Department",
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("is_active")?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table.getColumn("is_active")?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  const handleDepartmentChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("department_id")?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table.getColumn("department_id")?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  const globalFilterValue = useMemo(() => {
    return (table.getColumn("name")?.getFilterValue() ?? "") as string;
  }, [table.getColumn("name")?.getFilterValue()]);

  const clearAllFilters = () => {
    table.getColumn("name")?.setFilterValue("");
    table.getColumn("is_active")?.setFilterValue(undefined);
    table.getColumn("department_id")?.setFilterValue(undefined);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const buildCsvFromTeachers = (items: Teacher[]) => {
    const headers = [
      "id",
      "full_name",
      "email",
      "phone",
      "address",
      "birth_date",
      "gender",
      "faculty_id",
      "faculty_name",
    ];
    const escapeCsv = (value: unknown) => {
      if (value === null || value === undefined) return "";
      const str = String(value);
      if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}` + `"`;
      }
      return str;
    };
    const rows = items.map((t) => [
      t.id,
      t.full_name,
      t.email,
      t.phone,
      t.address,
      t.birth_date ? new Date(t.birth_date).toISOString().split("T")[0] : "",
      t.gender,
      t.faculty_id ?? "",
      departmentData.find((d) => d.id === t.faculty_id)?.name ?? "",
    ]);
    const lines = [headers, ...rows].map((r) => r.map(escapeCsv).join(","));
    return lines.join("\n");
  };

  const handleConfirmExport = () => {
    const selected = table.getSelectedRowModel().rows.map((r) => r.original as Teacher);
    if (!selected.length) {
      toast.error("No selected teachers to export");
      return;
    }
    const csv = buildCsvFromTeachers(selected);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const ts = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const fileName = `teachers_export_${ts.getFullYear()}${pad(ts.getMonth() + 1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.csv`;
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    setExportDialogOpen(false);
    toast.success(`Exported ${selected.length} teacher${selected.length === 1 ? "" : "s"}`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Filters and Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Search teachers..."
                value={globalFilterValue}
                onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                className="pl-10"
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 border-dashed">
                  <ListFilter className="h-4 w-4" />
                  Department
                  {!!table.getColumn("department_id")?.getFilterValue() && (
                    <Badge variant="secondary" className="ml-1 px-1">
                      {(table.getColumn("department_id")?.getFilterValue() as string[])?.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="start">
                <div className="p-4 space-y-3">
                  <div className="font-medium text-sm">Filter by Department</div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {uniqueDepartmentValues.map((department) => (
                      <label key={department.id} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={
                            (table.getColumn("department_id")?.getFilterValue() as string[])?.includes(
                              department.id ?? "",
                            ) ?? false
                          }
                          onCheckedChange={(checked) => handleDepartmentChange(!!checked, department.id ?? "")}
                        />
                        <span className="text-sm">{department.name}</span>
                      </label>
                    ))}
                  </div>
                  {!!table.getColumn("department_id")?.getFilterValue() && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => table.getColumn("department_id")?.setFilterValue(undefined)}
                      className="w-full"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Clear All Filters */}
            {(!!globalFilterValue ||
              !!table.getColumn("is_active")?.getFilterValue() ||
              !!table.getColumn("department_id")?.getFilterValue()) && (
              <Button variant="ghost" onClick={clearAllFilters} className="gap-2">
                <CircleX className="h-4 w-4" />
                Clear filters
              </Button>
            )}

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
                      You are about to export {table.getSelectedRowModel().rows.length} selected teacher
                      {table.getSelectedRowModel().rows.length === 1 ? "" : "s"}. Review the list below.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <ConfirmExportTeacherData
                    teachers={table.getSelectedRowModel().rows.map((r) => r.original as Teacher)}
                  />
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
                      Delete Teachers
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {table.getSelectedRowModel().rows.length} teacher
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
                        {(() => {
                          const sortDirection = header.column.getIsSorted();
                          if (sortDirection === "asc") {
                            return <ChevronUp className="h-4 w-4" />;
                          } else if (sortDirection === "desc") {
                            return <ChevronDown className="h-4 w-4" />;
                          }
                          return null;
                        })()}
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
                    <p>No teachers found</p>
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

function RowActions({ row }: { row: Row<Teacher> }) {
  const teacher = row.original;
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
              Edit Teacher
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
            <Trash className="h-4 w-4" />
            Delete Teacher
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <TeacherDetailDialog teacher={teacher} open={viewDialogOpen} onOpenChange={setViewDialogOpen} /> */}
    </>
  );
}

export { TeacherTable as Component };
