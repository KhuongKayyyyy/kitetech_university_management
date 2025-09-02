"use client";

import * as React from "react";

import { MajorModel } from "@/app/api/model/model";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Download, Eye, Filter, MoreHorizontal, Pencil, TrashIcon, X } from "lucide-react";
import { toast } from "sonner";

import { MajorDetailDialog } from "./ MajorDetailDialog";
import ConfirmDeleteMajorDialog from "./ConfirmDeleteMajorDialog";
import ConfirmExportMajor from "./ConfirmExportMajor";
import { NewMajorDialog } from "./NewMajorDialog";

export const majorColumns: ColumnDef<MajorModel>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-gray-300"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-gray-300"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    id: "order",
    header: "No.",
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      const rowNumber = pageIndex * pageSize + row.index + 1;

      return <div className="w-12 text-center font-medium text-gray-600">{rowNumber}</div>;
    },
    enableSorting: false,
    enableHiding: false,
    size: 60,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 font-semibold text-gray-700 hover:bg-gray-100"
      >
        Code
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium text-gray-900 uppercase">{row.getValue("code") || "N/A"}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 font-semibold text-gray-700 hover:bg-gray-100"
      >
        Major Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium text-gray-900 capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 font-semibold text-gray-700 hover:bg-gray-100"
      >
        Description
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-gray-600 max-w-xs truncate">{row.getValue("description") || "No description available"}</div>
    ),
  },
  {
    accessorKey: "faculty.name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 font-semibold text-gray-700 hover:bg-gray-100"
      >
        Department
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
        {row.original.faculty?.name || "Unknown Faculty"}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    size: 100,
    cell: ({ row }) => {
      const department = row.original;
      const [openDialog, setOpenDialog] = React.useState(false);

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-gray-100 focus:ring-2 focus:ring-primary focus:ring-offset-1"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-semibold">Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(department.name)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <Eye className="mr-2 h-4 w-4" />
                Copy Major Name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOpenDialog(true)} className="cursor-pointer hover:bg-gray-50">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Major
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <MajorDetailDialog major={department} open={openDialog} onOpenChange={setOpenDialog} />
        </>
      );
    },
  },
];

interface MajorTableProps {
  majors: MajorModel[];
  onMajorsDeleted?: (deletedMajors: MajorModel[]) => void;
}

export function MajorTable({ majors, onMajorsDeleted }: MajorTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [departmentFilter, setDepartmentFilter] = React.useState("");

  const [openAddMajor, setOpenAddMajor] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  const [exportAllDialogOpen, setExportAllDialogOpen] = React.useState(false);

  // Get unique departments for filter
  const uniqueDepartments = React.useMemo(() => {
    const departments = majors
      .map((major) => major.faculty?.name)
      .filter((name): name is string => !!name)
      .filter((name, index, array) => array.indexOf(name) === index)
      .sort();
    return departments;
  }, [majors]);

  // Filter data based on department selection
  const filteredMajors = React.useMemo(() => {
    if (!departmentFilter || departmentFilter === "all") {
      return majors;
    }
    return majors.filter((major) => major.faculty?.name === departmentFilter);
  }, [majors, departmentFilter]);

  const table = useReactTable({
    data: filteredMajors,
    columns: majorColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const isAnyRowSelected = Object.keys(rowSelection).length > 0;

  // Get selected majors
  const selectedMajors = React.useMemo(() => {
    return table.getFilteredSelectedRowModel().rows.map((row) => row.original);
  }, [table, rowSelection]);

  const handleDelete = async () => {
    try {
      if (onMajorsDeleted) {
        onMajorsDeleted(selectedMajors);
      }
      setRowSelection({});
    } catch (error) {
      console.error("Failed to delete majors:", error);
    }
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const clearDepartmentFilter = () => {
    setDepartmentFilter("");
  };

  const clearAllFilters = () => {
    setDepartmentFilter("");
    setColumnFilters([]);
  };

  const hasActiveFilters = departmentFilter || columnFilters.length > 0;

  const buildCsvFromMajors = (items: MajorModel[]) => {
    const headers = ["id", "code", "name", "description", "faculty_name"];
    const escapeCsv = (value: unknown) => {
      if (value === null || value === undefined) return "";
      const str = String(value);
      if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    const rows = items.map((m) => [m.id, m.code || "", m.name, m.description || "", m.faculty?.name || ""]);
    const lines = [headers, ...rows].map((r) => r.map(escapeCsv).join(","));
    return lines.join("\n");
  };

  const handleConfirmExport = () => {
    const selected = table.getSelectedRowModel().rows.map((r) => r.original as MajorModel);
    if (!selected.length) {
      toast.error("No selected majors to export");
      return;
    }
    const csv = buildCsvFromMajors(selected);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const ts = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const fileName = `majors_export_${ts.getFullYear()}${pad(ts.getMonth() + 1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.csv`;
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    setExportDialogOpen(false);
    toast.success(`Exported ${selected.length} major${selected.length === 1 ? "" : "s"}`);
  };

  return (
    <div className="w-full space-y-4 p-5">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-1">
        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-48 border-gray-300">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {uniqueDepartments.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {departmentFilter && departmentFilter !== "all" && (
            <Button variant="ghost" size="sm" onClick={clearDepartmentFilter} className="h-8 px-2 hover:bg-gray-100">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Clear All Filters */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearAllFilters} className="border-gray-300 hover:bg-gray-50">
            Clear Filters
          </Button>
        )}
      </div>

      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-1">
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Column Visibility Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50 shadow-sm">
                <Filter className="mr-2 h-4 w-4" />
                Columns
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-semibold">Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize cursor-pointer"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id === "faculty.name" ? "Department" : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add Major Button */}
          <NewMajorDialog open={openAddMajor} setOpen={setOpenAddMajor} />

          {/* Export All Button */}
          <AlertDialog open={exportAllDialogOpen} onOpenChange={setExportAllDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export All Majors
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to export all {filteredMajors.length} majors. Review the list below.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <ConfirmExportMajor majors={filteredMajors} />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    const csv = buildCsvFromMajors(filteredMajors);
                    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    const ts = new Date();
                    const pad = (n: number) => String(n).padStart(2, "0");
                    const fileName = `majors_export_all_${ts.getFullYear()}${pad(ts.getMonth() + 1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.csv`;
                    a.href = url;
                    a.download = fileName;
                    a.click();
                    URL.revokeObjectURL(url);
                    setExportAllDialogOpen(false);
                    toast.success(`Exported all ${filteredMajors.length} majors`);
                  }}
                >
                  Confirm Export All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Delete Selected Button */}
          {isAnyRowSelected && (
            <>
              <AlertDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export ({Object.keys(rowSelection).length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Review Export
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to export {table.getSelectedRowModel().rows.length} selected major
                      {table.getSelectedRowModel().rows.length === 1 ? "" : "s"}. Review the list below.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <ConfirmExportMajor majors={table.getSelectedRowModel().rows.map((r) => r.original as MajorModel)} />
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmExport}>Confirm Export</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                variant="destructive"
                size="sm"
                className="shadow-sm hover:bg-red-600 transition-colors text-white"
                onClick={handleDeleteClick}
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete ({Object.keys(rowSelection).length})
              </Button>
            </>
          )}

          <ConfirmDeleteMajorDialog
            open={openDeleteDialog}
            onOpenChange={setOpenDeleteDialog}
            majors={selectedMajors}
            onConfirm={handleDelete}
            onCancel={() => setOpenDeleteDialog(false)}
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-sm font-medium text-gray-600">Active filters:</span>
          {departmentFilter && departmentFilter !== "all" && (
            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Department: {departmentFilter}
              <button onClick={clearDepartmentFilter} className="ml-1 hover:bg-green-200 rounded-full p-0.5">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50/50 border-gray-200">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold text-gray-700 border-gray-200">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`
                    border-gray-200 hover:bg-gray-50/50 transition-colors
                    ${row.getIsSelected() ? "bg-blue-50 border-blue-200" : ""}
                    ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 border-gray-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={majorColumns.length} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
                    <p className="text-lg font-medium">No majors found</p>
                    <p className="text-sm">Try adjusting your filter criteria</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
        <div className="text-sm text-gray-600">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Rows per page */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Rows per page:</span>
            <select
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>
            <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded-md min-w-[100px] text-center">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
