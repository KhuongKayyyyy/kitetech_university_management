"use client";

import * as React from "react";

import { SubjectModel } from "@/app/api/model/model";
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
import { useGradingFormulas } from "@/hooks/useGradingFormula";
import { getMajorNameById } from "@/lib/utils";
// import { getDepartmentNameById } from "@/lib/utils";
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

import { AddSubjectDialog } from "./AddSubjectDialog";
import ConfirmDeleteSubjects from "./ConfirmDeleteSubjects";
import { SubjectDetailDialog } from "./SubjectDetailDialog";

interface SubjectTableProps {
  subjects: SubjectModel[];
  onUpdate?: (updatedSubject: SubjectModel) => Promise<void>;
  onDelete?: (subjectIds: string[]) => Promise<void>;
}

export function SubjectTable({ subjects, onUpdate, onDelete }: SubjectTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const { gradingFormulas } = useGradingFormulas();

  // Create columns with access to the onUpdate function
  const subjectColumns: ColumnDef<SubjectModel>[] = React.useMemo(
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
            Subject <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div className="capitalize font-medium">{row.getValue("name")}</div>,
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Description <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-muted-foreground max-w-xs truncate">{row.getValue("description") || "-"}</div>
        ),
      },
      {
        accessorKey: "credits",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Credits <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {row.getValue("credits")} credits
            </span>
          </div>
        ),
      },
      {
        accessorKey: "faculty_id",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Department <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="capitalize">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium">
              {getMajorNameById(row.original.faculty_id.toString())}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "gradingFormulaId",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Grading Formula <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const gradingFormula = row.original.gradingFormula;

          if (!gradingFormula) {
            return <div className="text-center text-muted-foreground">-</div>;
          }

          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-center cursor-help">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs font-medium hover:bg-purple-200 transition-colors">
                      {gradingFormula.name}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs p-0 border-0 shadow-lg">
                  <div className="bg-white rounded-lg border shadow-xl p-4 space-y-3">
                    <div className="space-y-2 border-b pb-3">
                      <h4 className="font-semibold text-base text-gray-900">{gradingFormula.name}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{gradingFormula.description}</p>
                    </div>
                    {gradingFormula.gradeTypes && gradingFormula.gradeTypes.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <p className="text-sm font-medium text-gray-800">Grade Components</p>
                        </div>
                        <div className="space-y-2">
                          {gradingFormula.gradeTypes.map((gradeType, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between py-1.5 px-2 bg-gray-50 rounded-md"
                            >
                              <span className="text-sm text-gray-700 font-medium">{gradeType.gradeType}</span>
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-semibold text-blue-600">{gradeType.weight}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Total Weight</span>
                            <span className="font-medium">
                              {gradingFormula.gradeTypes.reduce((sum, gt) => sum + gt.weight, 0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const subject = row.original;
          const [openDialog, setOpenDialog] = React.useState(false);

          return (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(subject.name)}>
                    Copy Subject Name
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setOpenDialog(true)} className="text-blue-600">
                    Edit Subject
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <SubjectDetailDialog
                subject={subject}
                open={openDialog}
                onOpenChange={setOpenDialog}
                onSubmit={onUpdate}
              />
            </>
          );
        },
      },
    ],
    [onUpdate],
  );

  const table = useReactTable({
    data: subjects,
    columns: subjectColumns,
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

  // Get selected subjects
  const selectedSubjects = React.useMemo(() => {
    return table.getFilteredSelectedRowModel().rows.map((row) => row.original);
  }, [table, rowSelection]);

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!onDelete) return;

    try {
      const selectedIds = selectedSubjects.map((subject) => subject.id);
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
            placeholder="Filter subjects..."
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
                    <TableCell colSpan={subjectColumns.length} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="text-lg font-medium mb-1">No subjects found</div>
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteSubjects
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        subjects={selectedSubjects}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
