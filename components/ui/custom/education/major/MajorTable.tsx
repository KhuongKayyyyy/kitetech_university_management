"use client";

import * as React from "react";

import { Major } from "@/app/api/model/model";
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
import { getDepartmentNameById } from "@/lib/utils";
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
import { ArrowUpDown, ChevronDown, Eye, Filter, MoreHorizontal, Pencil, Search, TrashIcon } from "lucide-react";

import { MajorDetailDialog } from "./ MajorDetailDialog";
import { NewMajorDialog } from "./NewMajorDialog";

export const majorColumns: ColumnDef<Major>[] = [
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
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return <div className="w-12 text-center font-medium text-gray-600">{pageIndex * pageSize + row.index + 1}</div>;
    },
    enableSorting: false,
    enableHiding: false,
    size: 60,
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
    accessorKey: "department.id",
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
        {getDepartmentNameById(row.original.departmentId)}
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

export function MajorTable({ majors }: { majors: Major[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: majors,
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

  return (
    <div className="w-full space-y-4 p-5">
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
                    {column.id === "department.id" ? "Department" : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add Major Button */}
          <NewMajorDialog />

          {/* Delete Selected Button */}
          {isAnyRowSelected && (
            <Button variant="destructive" size="sm" className="shadow-sm hover:bg-red-600 transition-colors">
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete ({Object.keys(rowSelection).length})
            </Button>
          )}
        </div>
      </div>

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
                    <Search className="h-8 w-8 text-gray-400" />
                    <p className="text-lg font-medium">No majors found</p>
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
