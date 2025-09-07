"use client";

import * as React from "react";

import RegistedStudentList from "@/app/(root)/admin/education/subject/RegistedStudentList";
import { Course } from "@/app/api/model/Course";
import { ExportService } from "@/app/api/services/exportService";
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
import { ArrowUpDown, ChevronDown, Download, MoreHorizontal, TrashIcon } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteCoursesDialog } from "./ConfirmDeleteCoursesDialog";

const createAvailableSubjectColumns = (onViewRegistrations: (course: Course) => void): ColumnDef<Course>[] => [
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
    accessorKey: "subject_name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Subject Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("subject_name")}</div>,
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
    accessorKey: "semester",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Semester <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("semester")}</div>,
  },
  {
    accessorKey: "schedules",
    header: "Schedule",
    cell: ({ row }) => {
      const schedules = row.getValue("schedules") as { sections: number; schedule: string }[];
      return (
        <div className="text-center">
          {schedules.map((schedule, index) => (
            <div key={index} className="text-sm">
              Section {schedule.sections} on {schedule.schedule}
            </div>
          ))}
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
    cell: ({ row }) => <div className="text-center">{row.getValue("start_date")}</div>,
  },
  {
    accessorKey: "end_date",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        End Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("end_date")}</div>,
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Location <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("location")}</div>,
  },
  {
    accessorKey: "enrolled",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Enrolled <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const enrolled = row.getValue("enrolled") as number;
      const maxStudent = row.original.max_student;
      return (
        <div className="text-center">
          <span className="font-medium">
            {enrolled}/{maxStudent}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const availableSubject = row.original;

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(availableSubject.subject_name)}>
              Copy Subject Name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Subject</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewRegistrations(availableSubject)}>
              View Registrations
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface AvailableSubjectTableProps {
  availableSubjects: Course[];
  onEditSubject: (subject: Course) => void;
  onViewRegistrations: (subject: Course) => void;
  onDeleteSubject: (subject: Course) => void;
  onAddSubject: (subject: Course) => void;
  onDeleteSelectedCourses: (courseIds: number[]) => void;
  registrationPeriodId?: string;
  registrationPeriodName?: string;
}

export function AvailableSubjectTable({
  availableSubjects,
  onEditSubject,
  onViewRegistrations,
  onDeleteSubject,
  onAddSubject,
  onDeleteSelectedCourses,
  registrationPeriodId,
  registrationPeriodName,
}: AvailableSubjectTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showStudentList, setShowStudentList] = React.useState(false);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [isExporting, setIsExporting] = React.useState(false);

  const handleViewRegistrations = (course: Course) => {
    setSelectedCourse(course);
    setShowStudentList(true);
  };

  const handleExportToExcel = async () => {
    try {
      if (!registrationPeriodId) {
        toast.error("Registration period ID is required for export");
        return;
      }

      setIsExporting(true);
      const exportData = {
        registrationPeriodId,
        registrationPeriodName: registrationPeriodName || `Registration Period ${registrationPeriodId}`,
        courses: availableSubjects,
      };

      await ExportService.exportAvailableCoursesToExcel(exportData);
      toast.success("Excel file exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export Excel file");
    } finally {
      setIsExporting(false);
    }
  };

  const table = useReactTable({
    data: availableSubjects,
    columns: createAvailableSubjectColumns(handleViewRegistrations),
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
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCourseNames = selectedRows.map((row) => row.original.subject_name);

  const handleDeleteSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;

    if (selectedRows.length > 0) {
      setShowDeleteDialog(true);
    }
  };

  const handleConfirmDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedCourseIds = selectedRows.map((row) => row.original.id);

    console.log("Selected rows:", selectedRows);
    console.log("Selected course IDs (using id - course registration subject ID):", selectedCourseIds);
    console.log(
      "Selected course data:",
      selectedRows.map((row) => ({
        id: row.original.id,
        subject_id: row.original.subject_id,
        subject_name: row.original.subject_name,
      })),
    );

    setIsDeleting(true);
    try {
      await onDeleteSelectedCourses(selectedCourseIds);
      setRowSelection({}); // Clear selection after deletion
      setShowDeleteDialog(false);
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Filter available subjects..."
          value={(table.getColumn("subject_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("subject_name")?.setFilterValue(event.target.value)}
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

          <Button 
            variant="outline" 
            size="sm" 
            className="shadow-md" 
            onClick={handleExportToExcel}
            disabled={isExporting}
          >
            <Download className="w-4 h-4 mr-2" /> 
            {isExporting ? "Exporting..." : "Export Excel"}
          </Button>

          {isAnyRowSelected && (
            <Button variant="destructive" size="sm" className="text-white shadow-md" onClick={handleDeleteSelected}>
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
                  <TableCell colSpan={createAvailableSubjectColumns(() => {}).length} className="h-24 text-center">
                    No available subjects found.
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

      <ConfirmDeleteCoursesDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        courseCount={selectedRows.length}
        courseNames={selectedCourseNames}
        isLoading={isDeleting}
      />

      {selectedCourse && (
        <RegistedStudentList
          isOpen={showStudentList}
          onOpenChange={setShowStudentList}
          availableCourseId={selectedCourse.id.toString()}
          courseName={selectedCourse.subject_name}
        />
      )}
    </div>
  );
}
