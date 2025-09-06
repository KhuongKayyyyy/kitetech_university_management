"use client";

import * as React from "react";

import { RegistrationPeriod } from "@/app/api/model/RegistrationPeriodModel";
import { registrationPeriodService } from "@/app/api/services/registrationPeriodService";
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
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RegisPeriodStatus } from "@/constants/enum/RegisPeriodStatus";
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
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpDown,
  CheckCircle,
  ChevronDown,
  Clock,
  MoreHorizontal,
  TrashIcon,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import ConfirmDeleteRegistrationPeriodDialog from "./ConfirmDeleteRegistrationPeriodDialog";

export const createRegistrationPeriodColumns = (
  onDelete: (period: RegistrationPeriod) => void,
): ColumnDef<RegistrationPeriod>[] => [
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
    accessorKey: "semester_id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Semester <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">Semester {row.getValue("semester_id")}</div>,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Description <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("description") || "No description"}</div>,
  },
  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Start Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("start_date"));
      return (
        <div className="font-medium">
          {date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
        </div>
      );
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
      const date = new Date(row.getValue("end_date"));
      return (
        <div className="font-medium">
          {date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Status <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as RegisPeriodStatus;

      const getStatusColor = (status: RegisPeriodStatus) => {
        switch (status) {
          case RegisPeriodStatus.Open:
            return "bg-green-100 text-green-800 border-green-200";
          case RegisPeriodStatus.Closed:
            return "bg-gray-100 text-gray-800 border-gray-200";
          case RegisPeriodStatus.Cancelled:
            return "bg-red-100 text-red-800 border-red-200";
          default:
            return "bg-gray-100 text-gray-800 border-gray-200";
        }
      };

      const getStatusIcon = (status: RegisPeriodStatus) => {
        switch (status) {
          case RegisPeriodStatus.Open:
            return <CheckCircle className="h-3 w-3" />;
          case RegisPeriodStatus.Closed:
            return <XCircle className="h-3 w-3" />;
          case RegisPeriodStatus.Cancelled:
            return <AlertCircle className="h-3 w-3" />;
          default:
            return <Clock className="h-3 w-3" />;
        }
      };

      return (
        <div
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}
        >
          {getStatusIcon(status)}
          {status}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const period = row.original;

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(period.description || "")}>
              Copy Description
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Period</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => onDelete(period)}>
              Delete Period
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function RegistrationPeriodTable({
  periods,
  onDeletePeriod,
}: {
  periods: RegistrationPeriod[];
  onDeletePeriod: (period: RegistrationPeriod) => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [periodToDelete, setPeriodToDelete] = React.useState<RegistrationPeriod | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = React.useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = React.useState(false);

  const handleDeleteClick = (period: RegistrationPeriod) => {
    setPeriodToDelete(period);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!periodToDelete) return;

    try {
      setIsDeleting(true);
      await registrationPeriodService.deleteRegistrationPeriod(periodToDelete.id);
      onDeletePeriod(periodToDelete);
      toast.success("Registration period deleted successfully!");
      setDeleteDialogOpen(false);
      setPeriodToDelete(null);
    } catch (error) {
      console.error("Error deleting registration period:", error);
      toast.error("Failed to delete registration period. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setPeriodToDelete(null);
  };

  const handleBulkDeleteClick = () => {
    setBulkDeleteDialogOpen(true);
  };

  const handleConfirmBulkDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedPeriods = selectedRows.map((row) => row.original);

    try {
      setIsBulkDeleting(true);

      // Delete all selected periods
      await Promise.all(selectedPeriods.map((period) => registrationPeriodService.deleteRegistrationPeriod(period.id)));

      // Update parent component
      selectedPeriods.forEach((period) => onDeletePeriod(period));

      // Clear selection
      setRowSelection({});

      toast.success(`${selectedPeriods.length} registration period(s) deleted successfully!`);
      setBulkDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting registration periods:", error);
      toast.error("Failed to delete some registration periods. Please try again.");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleCancelBulkDelete = () => {
    setBulkDeleteDialogOpen(false);
  };

  const table = useReactTable({
    data: periods,
    columns: createRegistrationPeriodColumns(handleDeleteClick),
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

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Filter registration periods..."
          value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("description")?.setFilterValue(event.target.value)}
          className="max-w-sm shadow-md"
        />
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shadow-md">
                Filters <ChevronDown className="ml-2 h-4 w-4" />
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
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {isAnyRowSelected && (
            <Button variant="destructive" size="sm" className="text-white shadow-md" onClick={handleBulkDeleteClick}>
              <TrashIcon className="w-4 h-4 mr-2" /> Delete Selected
            </Button>
          )}
        </div>
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
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={createRegistrationPeriodColumns(handleDeleteClick).length}
                    className="h-24 text-center"
                  >
                    No registration periods found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between py-4 mt-auto">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} selected.
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

      <ConfirmDeleteRegistrationPeriodDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        registrationPeriod={periodToDelete}
        isDeleting={isDeleting}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Selected Registration Periods
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the selected registration periods? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">
                <div className="font-medium mb-2">
                  {table.getFilteredSelectedRowModel().rows.length} registration period(s) will be deleted:
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {table.getFilteredSelectedRowModel().rows.map((row) => (
                    <div key={row.id} className="text-xs text-gray-500">
                      • {row.original.description || `Period ID: ${row.original.id}`}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancelBulkDelete} disabled={isBulkDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmBulkDelete}
              disabled={isBulkDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              {isBulkDeleting ? "Deleting..." : `Delete ${table.getFilteredSelectedRowModel().rows.length} Period(s)`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
