"use client";

import * as React from "react";

import { CourseDetailModel } from "@/app/api/model/Course";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
import { ArrowUpDown, Calendar, ChevronDown, Clock, MoreHorizontal, TrashIcon, Users } from "lucide-react";

interface SubjectClassTableProps {
  subjectClasses: CourseDetailModel[];
  onUpdate?: (updatedSubjectClass: CourseDetailModel) => Promise<void>;
  onDelete?: (subjectClassIds: string[]) => Promise<void>;
}

export function SubjectClassTable({ subjectClasses, onUpdate, onDelete }: SubjectClassTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  // Create columns with access to the onUpdate function
  const subjectClassColumns: ColumnDef<CourseDetailModel>[] = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "order",
        header: "Order",
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          return <div className="w-6 text-center">{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Class Name <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="font-medium">{row.getValue("name")}</div>
            <div className="text-sm text-muted-foreground">{row.original.subject?.name}</div>
          </div>
        ),
      },
      {
        accessorKey: "instructor",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Teacher <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div className="capitalize font-medium">{row.original.instructor || "-"}</div>,
      },
      {
        accessorKey: "semester",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Semester <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {row.getValue("semester")}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "schedules",
        header: "Schedule",
        cell: ({ row }) => {
          const schedules = row.original.schedules;
          if (!schedules || schedules.length === 0) {
            return <div className="text-center text-muted-foreground">-</div>;
          }

          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate max-w-32">
                      {schedules.length} session{schedules.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-1">
                    {schedules.map((s, index) => (
                      <div key={index} className="text-sm">
                        <strong>{s.schedule}</strong>: {s.sections} section{s.sections > 1 ? "s" : ""}
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "enrolled",
        header: "Enrollment",
        cell: ({ row }) => {
          const enrolled = row.original.enrolled || 0;
          const max = 50; // Default max students, you might want to add this to the model
          const percentage = max > 0 ? (enrolled / max) * 100 : 0;

          return (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {enrolled}/{max}
              </span>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "location",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Location <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{row.getValue("location") || "-"}</span>
          </div>
        ),
      },
      {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.getValue("is_active") ? "default" : "secondary"} className="text-xs">
            {row.getValue("is_active") ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const subjectClass = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(subjectClass.name || "")}>
                  Copy Class Name
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-blue-600">Edit Class</DropdownMenuItem>
                <DropdownMenuItem className="text-green-600">View Details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [onUpdate],
  );

  const table = useReactTable({
    data: subjectClasses,
    columns: subjectClassColumns,
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

  // Get selected subject classes
  const selectedSubjectClasses = React.useMemo(() => {
    return table.getFilteredSelectedRowModel().rows.map((row) => row.original);
  }, [table, rowSelection]);

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!onDelete) return;

    try {
      const selectedIds = selectedSubjectClasses.map((subjectClass) => subjectClass.id.toString());
      await onDelete(selectedIds);
      setRowSelection({});
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Delete failed:", error);
      // Error is already handled in the parent component with toast
    }
  };

  return (
    <>
      <div className="w-full flex flex-col bg-white rounded-lg shadow-sm border">
        <div className="flex items-center py-4 px-6 gap-4 border-b bg-gray-50/50">
          <Input
            placeholder="Filter classes..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm shadow-sm border-gray-200"
          />
          <div className="flex items-center gap-2 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shadow-sm border-gray-200">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
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

            {isAnyRowSelected && (
              <Button
                variant="destructive"
                size="sm"
                className="text-white shadow-sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete Selected ({Object.keys(rowSelection).length})
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="min-w-full">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b border-gray-100 bg-gray-50/30">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-gray-700 font-medium">
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
                      className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/20"
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={subjectClassColumns.length} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="text-lg font-medium mb-1">No subject classes found</div>
                        <div className="text-sm">Try adjusting your search filters</div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex items-center justify-between py-4 px-6 border-t bg-gray-50/50">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select
                className="text-sm border border-gray-200 rounded px-3 py-1 bg-white shadow-sm"
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

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="border-gray-200"
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="border-gray-200"
              >
                Previous
              </Button>
              <span className="text-sm px-2 py-1 bg-gray-100 rounded">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="border-gray-200"
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="border-gray-200"
              >
                Last
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
