"use client";

import * as React from "react";

import { DepartmentModel } from "@/app/api/model/model";
import { departmentService } from "@/app/api/services/departmentService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { ArrowUpDown, ChevronDown, Filter, MoreHorizontal, Search, TrashIcon } from "lucide-react";
import { toast, Toaster } from "sonner";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../../hover-card";
import ConfirmDeleteDepartments from "./ConfirmDeleteDepartments";
import { DepartmentDialog } from "./DepartmentDialog";
import { NewDepartmentDialog } from "./NewDepartmentDialog";

export const departmentColumns: ColumnDef<DepartmentModel>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-2"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-2"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "order",
    header: ({ column }) => <div className="text-center font-medium text-muted-foreground">#</div>,
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      const globalRowIndex = pageIndex * pageSize + row.index;
      return (
        <div className="w-8 text-center">
          <Badge variant="outline" className="text-xs font-mono">
            {globalRowIndex + 1}
          </Badge>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-2 font-semibold text-left justify-start hover:bg-accent/50"
      >
        Department Name
        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium text-foreground capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "contact_info",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-2 font-semibold text-left justify-start hover:bg-accent/50"
      >
        Contact Info
        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm max-w-md truncate">{row.getValue("contact_info")}</div>
    ),
  },
  {
    accessorKey: "dean",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-2 font-semibold text-left justify-start hover:bg-accent/50"
      >
        Dean
        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm max-w-md truncate">{row.getValue("dean") || "Not assigned"}</div>
    ),
  },
  {
    id: "majorsCount",
    header: ({ column }) => <div className="text-center font-semibold">Majors</div>,
    cell: ({ row }) => {
      const majors = row.original.majors;
      return (
        <div className="text-center">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" className="h-auto p-1 hover:bg-accent/50">
                <Badge variant="secondary" className="font-medium">
                  {majors?.length || 0} major{majors?.length !== 1 ? "s" : ""}
                </Badge>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-96 p-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-foreground border-b pb-2">Associated Majors</h4>
                {majors && majors.length > 0 ? (
                  majors.map((major) => (
                    <div key={major.id} className="space-y-1 p-2 rounded-md bg-accent/20">
                      <div className="font-medium text-sm text-primary">{major.name}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">{major.description}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground italic">No majors assigned</div>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center font-semibold">Actions</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const department = row.original;
      const [openDialog, setOpenDialog] = React.useState(false);

      return (
        <div className="text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-accent/50 rounded-full">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-semibold">Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(department.name)}
                className="cursor-pointer"
              >
                Copy Department Name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOpenDialog(true)} className="cursor-pointer">
                Edit Department
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DepartmentDialog department={department} open={openDialog} onOpenChange={setOpenDialog} />
        </div>
      );
    },
  },
];

export function DepartmentTable({ departments: initialDepartments }: { departments: DepartmentModel[] }) {
  const [departments, setDepartments] = React.useState<DepartmentModel[]>(initialDepartments);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [openConfirmDelete, setOpenConfirmDelete] = React.useState(false);
  const [selectedDepartments, setSelectedDepartments] = React.useState<DepartmentModel[]>([]);

  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedDepartment, setSelectedDepartment] = React.useState<DepartmentModel | null>(null);

  const table = useReactTable({
    data: departments,
    columns: departmentColumns,
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

  const handleDeleteSuccess = (deleted: DepartmentModel[]) => {
    const deletedIds = new Set(deleted.map((d) => d.id));
    setDepartments(departments.filter((d) => !deletedIds.has(d.id)));
    setRowSelection({});
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-card p-5">
      <Toaster></Toaster>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shadow-sm border-2 hover:bg-accent/50">
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
                      {column.id === "majorsCount"
                        ? "Majors"
                        : column.id === "contact_info"
                          ? "Contact Info"
                          : column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <NewDepartmentDialog open={openDialog} setOpen={setOpenDialog} />

            {isAnyRowSelected && (
              <Button
                variant="destructive"
                size="sm"
                className="shadow-sm animate-in slide-in-from-right-2 text-white"
                onClick={() => {
                  const selectedDepartments = table.getSelectedRowModel().rows.map((row) => row.original);
                  setSelectedDepartments(selectedDepartments);
                  setOpenConfirmDelete(true);
                }}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete ({Object.keys(rowSelection).length})
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <ConfirmDeleteDepartments
        open={openConfirmDelete}
        onOpenChange={setOpenConfirmDelete}
        departments={selectedDepartments}
        onDeleteSuccess={handleDeleteSuccess}
      />

      <CardContent className="p-0">
        <div className="rounded-lg border-2 border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b-2 border-border/50 bg-muted/30">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-semibold text-foreground">
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
                    className="hover:bg-accent/30 transition-colors border-b border-border/30 data-[state=selected]:bg-accent/50"
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
                  <TableCell colSpan={departmentColumns.length} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="text-muted-foreground text-lg font-medium">No departments found</div>
                      <div className="text-muted-foreground/70 text-sm">Try adjusting your search criteria</div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-muted/20 border-t">
          <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-foreground">Rows per page:</span>
              <select
                className="text-sm border-2 rounded-md px-3 py-1.5 bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
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

            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="border-2"
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="border-2"
              >
                Previous
              </Button>
              <div className="px-3 py-1.5 text-sm font-medium bg-accent/50 rounded-md border-2 border-accent">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="border-2"
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="border-2"
              >
                Last
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
