"use client";

import * as React from "react";

import { SemesterModel } from "@/app/api/model/SemesterModel";
import { SemesterWeekModel } from "@/app/api/model/SemesterWeekModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { AlertTriangle, ArrowUpDown, ChevronDown, Clock, Edit, MoreHorizontal, TrashIcon } from "lucide-react";
import { toast } from "sonner";

export const semesterWeekColumns: ColumnDef<SemesterWeekModel>[] = [
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
    accessorKey: "week_number",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Week Number <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center font-medium">Week {row.getValue("week_number")}</div>,
  },
  {
    accessorKey: "semester_id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Semester <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row, table }) => {
      const semesterId = row.getValue("semester_id") as number;
      const { semesters } = table.options.meta as { semesters: SemesterModel[] };
      const semester = semesters?.find((s) => s.id === semesterId);
      return (
        <div className="flex items-center gap-2">
          <span className="max-w-xs truncate">{semester?.name || "Unknown Semester"}</span>
          {semester && (
            <Badge variant={semester.status === "Active" ? "default" : "secondary"} className="text-xs">
              {semester.status}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Start Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const startDate = row.getValue("start_date") as string;
      return <div>{startDate ? format(new Date(startDate), "MMM d, yyyy") : "N/A"}</div>;
    },
  },
  {
    accessorKey: "end_date",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        End Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const endDate = row.getValue("end_date") as string;
      return <div>{endDate ? format(new Date(endDate), "MMM d, yyyy") : "N/A"}</div>;
    },
  },
  {
    id: "status",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Status <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const week = row.original;
      const now = new Date();
      const startDate = new Date(week.start_date || "");
      const endDate = new Date(week.end_date || "");

      let status = "Upcoming";
      let variant: "default" | "secondary" | "outline" = "outline";

      if (now >= startDate && now <= endDate) {
        status = "Current";
        variant = "default";
      } else if (now > endDate) {
        status = "Completed";
        variant = "secondary";
      }

      return (
        <Badge variant={variant} className={status === "Current" ? "animate-pulse" : ""}>
          <Clock className="mr-1 h-3 w-3" />
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Description <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="max-w-xs truncate">{row.getValue("description") || "No description"}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const week = row.original;
      const { onEditWeek, onDeleteWeek } = table.options.meta as {
        semesters: SemesterModel[];
        onEditWeek?: (week: SemesterWeekModel) => void;
        onDeleteWeek?: (week: SemesterWeekModel) => void;
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`Week ${week.week_number}`)}>
              Copy Week Number
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEditWeek?.(week)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Week
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDeleteWeek?.(week)} className="text-red-600 focus:text-red-600">
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete Week
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface SemesterWeekTableProps {
  weeks: SemesterWeekModel[];
  semesters: SemesterModel[];
  onWeekClick?: (week: SemesterWeekModel) => void;
  onEditWeek?: (week: SemesterWeekModel) => void;
  onDeleteWeek?: (week: SemesterWeekModel) => void;
  onDeleteWeeks?: (weeks: SemesterWeekModel[]) => void;
}

export default function SemesterWeekTable({
  weeks,
  semesters,
  onWeekClick,
  onEditWeek,
  onDeleteWeek,
  onDeleteWeeks,
}: SemesterWeekTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const table = useReactTable({
    data: weeks,
    columns: semesterWeekColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      semesters,
      onEditWeek,
      onDeleteWeek,
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedWeeks = selectedRows.map((row) => row.original);
  const isAnyRowSelected = selectedRows.length > 0;

  const handleDeleteSelected = async () => {
    if (!onDeleteWeeks || selectedWeeks.length === 0) return;

    setIsDeleting(true);
    try {
      await onDeleteWeeks(selectedWeeks);
      setRowSelection({});
      setShowDeleteDialog(false);
      toast.success(`${selectedWeeks.length} week${selectedWeeks.length > 1 ? "s" : ""} deleted successfully.`);
    } catch (error) {
      toast.error("Failed to delete weeks. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getSemesterName = (semesterId: number) => {
    const semester = semesters.find((s) => s.id === semesterId);
    return semester?.name || "Unknown Semester";
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center py-4 gap-4">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shadow-md">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
                    {column.id === "semester_id" ? "semester" : column.id.replace("_", " ")}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {isAnyRowSelected && (
            <Button
              variant="destructive"
              size="sm"
              className="text-white shadow-md"
              onClick={() => setShowDeleteDialog(true)}
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete Selected ({selectedRows.length})
            </Button>
          )}
        </div>

        {isAnyRowSelected && (
          <div className="text-sm text-muted-foreground">
            {selectedRows.length} of {table.getFilteredRowModel().rows.length} week
            {selectedRows.length !== 1 ? "s" : ""} selected
          </div>
        )}
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={(e) => {
                      // Don't trigger row click if clicking on checkbox or action buttons
                      if (
                        (e.target as HTMLElement).closest("button") ||
                        (e.target as HTMLElement).closest('[role="checkbox"]')
                      ) {
                        return;
                      }
                      onWeekClick?.(row.original);
                    }}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={semesterWeekColumns.length} className="h-24 text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">No semester weeks found.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between py-4 mt-auto">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} week
          {table.getFilteredRowModel().rows.length !== 1 ? "s" : ""} selected.
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-primary">Rows per page:</span>
            <select
              className="text-sm border rounded px-2 py-1"
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
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              Last
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedWeeks.length} week{selectedWeeks.length > 1 ? "s" : ""}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-60 overflow-y-auto">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Weeks to be deleted:</h4>
              <div className="grid gap-2">
                {selectedWeeks.map((week) => (
                  <div key={week.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <span className="font-medium">Week {week.week_number}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({getSemesterName(week.semester_id || 0)})
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {week.start_date && week.end_date
                        ? `${format(new Date(week.start_date), "MMM d")} - ${format(new Date(week.end_date), "MMM d")}`
                        : "No dates"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSelected} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : `Delete ${selectedWeeks.length} Week${selectedWeeks.length > 1 ? "s" : ""}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
