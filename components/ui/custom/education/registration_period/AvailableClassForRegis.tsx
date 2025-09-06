"use client";

import * as React from "react";

import { ClassModel, mockClasses } from "@/app/api/model/ClassModel";
import { registrationPeriodService } from "@/app/api/services/registrationPeriodService";
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
import { ArrowUpDown, ChevronDown, MoreHorizontal, TrashIcon } from "lucide-react";
import { toast } from "sonner";

import ConfirmRemoveClassDialog from "./ConfirmRemoveClassDialog";

const createAvailableClassColumns = (
  onEditClass?: (classItem: ClassModel) => void,
  onViewDetails?: (classItem: ClassModel) => void,
  onRegisterClass?: (classItem: ClassModel) => void,
  onRemoveClass?: (classItem: ClassModel) => void,
): ColumnDef<ClassModel>[] => [
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
    accessorKey: "id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Class ID <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "class_code",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Class Code <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("class_code")}</div>,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Description <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("description")}</div>,
  },
  {
    accessorKey: "major",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Major <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const major = row.getValue("major") as any;
      return (
        <div className="text-center">
          <div className="font-medium">{major?.name || "N/A"}</div>
          {major?.code && <div className="text-xs text-gray-500">({major.code})</div>}
        </div>
      );
    },
  },
  {
    accessorKey: "academic_year",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Academic Year <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("academic_year")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const classItem = row.original;

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText((classItem.id || 0).toString())}>
              Copy Class ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEditClass?.(classItem)}>Edit Class</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewDetails?.(classItem)}>View Details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRegisterClass?.(classItem)}>Register for Class</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onRemoveClass?.(classItem)} className="text-red-600 focus:text-red-600">
              Remove from Registration Period
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface AvailableClassTableProps {
  availableClasses?: ClassModel[];
  registrationPeriodId?: string;
  onEditClass?: (classItem: ClassModel) => void;
  onViewDetails?: (classItem: ClassModel) => void;
  onRegisterClass?: (classItem: ClassModel) => void;
  onDeleteClass?: (classItem: ClassModel) => void;
  onClassRemoved?: (classItem: ClassModel) => void;
}

export default function AvailableClassForRegis({
  availableClasses = mockClasses,
  registrationPeriodId,
  onEditClass,
  onViewDetails,
  onRegisterClass,
  onDeleteClass,
  onClassRemoved,
}: AvailableClassTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);
  const [selectedClassForRemoval, setSelectedClassForRemoval] = React.useState<ClassModel | null>(null);
  const [isRemoving, setIsRemoving] = React.useState(false);

  const handleRemoveClass = (classItem: ClassModel) => {
    setSelectedClassForRemoval(classItem);
    setRemoveDialogOpen(true);
  };

  const table = useReactTable({
    data: availableClasses,
    columns: createAvailableClassColumns(onEditClass, onViewDetails, onRegisterClass, handleRemoveClass),
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

  const handleConfirmRemove = async () => {
    if (!selectedClassForRemoval || !registrationPeriodId) return;

    try {
      setIsRemoving(true);
      await registrationPeriodService.removeAvailableClass(registrationPeriodId, [selectedClassForRemoval.id || 0]);
      toast.success(`Class ${selectedClassForRemoval.class_code} removed successfully!`);
      onClassRemoved?.(selectedClassForRemoval);
      setRemoveDialogOpen(false);
      setSelectedClassForRemoval(null);
    } catch (error) {
      console.error("Error removing class:", error);
      toast.error("Failed to remove class from registration period");
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCancelRemove = () => {
    setRemoveDialogOpen(false);
    setSelectedClassForRemoval(null);
  };

  const handleBulkRemove = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedClasses = selectedRows.map((row) => row.original);

    if (!registrationPeriodId) return;

    try {
      setIsRemoving(true);
      const classIds = selectedClasses.map((cls) => cls.id || 0);
      await registrationPeriodService.removeAvailableClass(registrationPeriodId, classIds);
      toast.success(`${selectedClasses.length} class(es) removed successfully!`);

      // Notify parent component about removed classes
      selectedClasses.forEach((cls) => onClassRemoved?.(cls));

      setRowSelection({});
    } catch (error) {
      console.error("Error removing classes:", error);
      toast.error("Failed to remove some classes. Please try again.");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Filter available classes..."
          value={(table.getColumn("class_code")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("class_code")?.setFilterValue(event.target.value)}
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
            <Button
              variant="destructive"
              size="sm"
              className="text-white shadow-md"
              onClick={handleBulkRemove}
              disabled={isRemoving}
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              {isRemoving ? "Removing..." : `Remove ${table.getFilteredSelectedRowModel().rows.length} Selected`}
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
                  <TableCell colSpan={createAvailableClassColumns().length} className="h-24 text-center">
                    No available classes found.
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

      {/* Remove Class Confirmation Dialog */}
      <ConfirmRemoveClassDialog
        open={removeDialogOpen}
        onClose={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        classItem={selectedClassForRemoval}
        isRemoving={isRemoving}
      />
    </div>
  );
}
