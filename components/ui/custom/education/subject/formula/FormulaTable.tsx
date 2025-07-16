"use client";

import * as React from "react";

import { GradingFormulaModel } from "@/app/api/model/GradingFormulaModel";
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
import { ArrowUpDown, Calculator, ChevronDown, Copy, Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import AddFormulaDialog from "./AddFormulaDialog";
import ConfirmDeleteFormulaDialog from "./ConfirmDeleteFormulaDialog";

interface FormulaTableProps {
  formulas: GradingFormulaModel[];
  onEditFormula?: (formula: GradingFormulaModel) => void;
  onDeleteFormula?: (formulaId: number) => Promise<void>;
  onAddFormula?: (formula: GradingFormulaModel) => Promise<void>;
}

export const formulaColumns: ColumnDef<GradingFormulaModel>[] = [
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
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 font-semibold text-gray-700 hover:bg-gray-100"
      >
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-mono text-sm font-medium text-gray-900">#{row.getValue("id")}</div>,
    size: 80,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 font-semibold text-gray-700 hover:bg-gray-100"
      >
        Formula Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-gray-900 max-w-xs">
        <div className="truncate">{row.getValue("name")}</div>
      </div>
    ),
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
      <div className="text-gray-600 max-w-sm">
        <div className="truncate">{row.getValue("description") || "No description available"}</div>
      </div>
    ),
  },
  {
    accessorKey: "gradeTypes",
    header: "Grade Types",
    cell: ({ row }) => {
      const gradeTypes = row.getValue("gradeTypes") as GradingFormulaModel["gradeTypes"];

      if (!gradeTypes || gradeTypes.length === 0) {
        return <div className="text-gray-400 text-sm">No grade types</div>;
      }

      const displayedGradeTypes = gradeTypes.slice(0, 2);
      const remainingCount = gradeTypes.length - 2;

      return (
        <TooltipProvider>
          <div className="flex flex-wrap gap-1">
            {displayedGradeTypes.map((gradeType, index) => {
              const colors = [
                "bg-blue-100 text-blue-700 border-blue-200",
                "bg-green-100 text-green-700 border-green-200",
                "bg-purple-100 text-purple-700 border-purple-200",
                "bg-orange-100 text-orange-700 border-orange-200",
              ];
              const color = colors[index % colors.length];

              return (
                <Tooltip key={gradeType.id}>
                  <TooltipTrigger asChild>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border cursor-help ${color}`}
                    >
                      {gradeType.gradeType}: {gradeType.weight}%
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="text-xs">
                      <div className="font-semibold">{gradeType.gradeType}</div>
                      <div>Weight: {gradeType.weight}%</div>
                      {gradeType.description && <div className="mt-1 text-gray-300">{gradeType.description}</div>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}

            {remainingCount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 cursor-help">
                    +{remainingCount} more
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-sm">
                  <div className="text-xs space-y-1">
                    <div className="font-semibold mb-2">Additional Grade Types:</div>
                    {gradeTypes.slice(2).map((gradeType) => (
                      <div key={gradeType.id} className="flex justify-between">
                        <span className="font-medium">{gradeType.gradeType}:</span>
                        <span>{gradeType.weight}%</span>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "totalWeight",
    header: "Total Weight",
    cell: ({ row }) => {
      const gradeTypes = row.getValue("gradeTypes") as GradingFormulaModel["gradeTypes"];
      const totalWeight = gradeTypes.reduce((sum, gt) => sum + (Number(gt.weight) || 0), 0);
      const isValid = totalWeight === 100;

      return (
        <div
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            isValid
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {totalWeight.toFixed(1)}%
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 font-semibold text-gray-700 hover:bg-gray-100"
      >
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      if (!date) return <div className="text-gray-400">-</div>;

      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      return <div className="text-gray-600 text-sm">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    size: 100,
    cell: ({ row, table }) => {
      const formula = row.original;
      // Access the table meta to get our custom functions
      const { onEditFormula, onDeleteFormula } = (table.options.meta as any) || {};

      return (
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
              onClick={() => navigator.clipboard.writeText(formula.name)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Formula Name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEditFormula?.(formula)} className="cursor-pointer hover:bg-gray-50">
              <Edit className="mr-2 h-4 w-4" />
              Edit Formula
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteFormula?.(formula.id)}
              className="cursor-pointer hover:bg-red-50 text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Formula
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function FormulaTable({ formulas, onEditFormula, onDeleteFormula, onAddFormula }: FormulaTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const table = useReactTable({
    data: formulas,
    columns: formulaColumns,
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
    meta: {
      onEditFormula,
      onDeleteFormula,
    },
  });

  const isAnyRowSelected = Object.keys(rowSelection).length > 0;
  const selectedFormulas = React.useMemo(() => {
    return table.getFilteredSelectedRowModel().rows.map((row) => row.original);
  }, [table, rowSelection]);

  return (
    <div className="w-full space-y-4 p-5">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-1">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search formulas..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
              className="pl-10 border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Column Visibility Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50 shadow-sm">
                <ChevronDown className="mr-2 h-4 w-4" />
                Columns
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
                    {column.id === "gradeTypes" ? "Grade Types" : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add Formula Button */}
          <AddFormulaDialog
            onAddFormula={onAddFormula}
            trigger={
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Formula
              </Button>
            }
          />

          {/* Delete Selected Button */}
          {isAnyRowSelected && (
            <Button
              variant="destructive"
              size="sm"
              className="shadow-sm hover:bg-red-600 transition-colors text-white"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({Object.keys(rowSelection).length})
            </Button>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDeleteFormulaDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        formulas={selectedFormulas}
        onConfirm={async () => {
          setIsDeleting(true);
          try {
            const deletePromises = selectedFormulas.map(async (formula) => {
              try {
                await onDeleteFormula?.(formula.id);
                return { success: true, formula };
              } catch (error) {
                console.error(`Failed to delete formula ${formula.name}:`, error);
                return { success: false, formula, error };
              }
            });

            const results = await Promise.all(deletePromises);
            const successful = results.filter((r) => r.success);
            const failed = results.filter((r) => !r.success);

            if (successful.length > 0) {
              setRowSelection({});
              if (failed.length === 0) {
                toast.success(`${successful.length} formula${successful.length > 1 ? "s" : ""} deleted successfully!`);
              } else {
                toast.success(`${successful.length} formula${successful.length > 1 ? "s" : ""} deleted successfully.`);
              }
            }

            if (failed.length > 0) {
              toast.error(
                `Failed to delete ${failed.length} formula${failed.length > 1 ? "s" : ""}. Please try again.`,
              );
            }

            setShowDeleteConfirm(false);
          } catch (error) {
            console.error("Failed to delete formulas:", error);
            toast.error("Failed to delete formulas. Please try again.");
          } finally {
            setIsDeleting(false);
          }
        }}
        onCancel={() => {
          setShowDeleteConfirm(false);
        }}
        isDeleting={isDeleting}
      />

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
                <TableCell colSpan={formulaColumns.length} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
                    <Calculator className="h-8 w-8 text-gray-400" />
                    <p className="text-lg font-medium">No formulas found</p>
                    <p className="text-sm">Try adjusting your search criteria</p>
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
