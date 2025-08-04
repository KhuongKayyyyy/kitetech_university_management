"use client";

import React, { useEffect, useId, useMemo, useState } from "react";

import { UserModel } from "@/app/api/model/UserModel";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleX,
  Columns3,
  Edit,
  Eye,
  Filter,
  ListFilter,
  MoreHorizontal,
  Search,
  Trash,
} from "lucide-react";

// Mock data for users
const mockUsers: UserModel[] = [
  {
    id: 1,
    username: "admin",
    password: "",
    full_name: "Administrator",
    email: "admin@example.com",
    isActive: true,
    isDeleted: false,
    role: {
      id: 1,
      name: "Admin",
      description: "Full system access",
      isActive: true,
    },
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
    avatar: "",
  },
  {
    id: 2,
    username: "teacher1",
    password: "",
    full_name: "John Teacher",
    email: "john.teacher@example.com",
    isActive: true,
    isDeleted: false,
    role: {
      id: 2,
      name: "Teacher",
      description: "Teaching and grading access",
      isActive: true,
    },
    created_at: "2024-01-02",
    updated_at: "2024-01-02",
    avatar: "",
  },
  {
    id: 3,
    username: "student1",
    password: "",
    full_name: "Jane Student",
    email: "jane.student@example.com",
    isActive: true,
    isDeleted: false,
    role: {
      id: 3,
      name: "Student",
      description: "Limited access for students",
      isActive: true,
    },
    created_at: "2024-01-03",
    updated_at: "2024-01-03",
    avatar: "",
  },
];

// Custom global filter function for multi-column searching
const globalFilterFn: FilterFn<UserModel> = (row, columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.username || ""} ${row.original.full_name || ""} ${row.original.email || ""} ${row.original.role?.name || ""}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<UserModel> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as boolean;
  return filterValue.includes(status ? "active" : "inactive");
};

const roleFilterFn: FilterFn<UserModel> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true;
  const role = row.original.role;
  return filterValue.includes(role?.name || "");
};

interface AccountTableProps {
  users?: UserModel[];
  searchTerm?: string;
  onDeleteUser?: (userId: string) => Promise<void>;
  onEditUser?: (user: UserModel) => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export default function AccountTable({
  users,
  searchTerm,
  onDeleteUser,
  onEditUser,
  isDeleting,
  isUpdating,
}: AccountTableProps) {
  const id = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "username",
      desc: false,
    },
  ]);

  const [data, setData] = useState<UserModel[]>(users ?? mockUsers);
  useEffect(() => {
    if (users) {
      setData(users);
    } else {
      async function fetchUsers() {
        // Fetch users data here if needed
        // For now using mock data
      }
      fetchUsers();
    }
  }, [users]);

  const handleDeleteRows = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedUserIds = selectedRows.map((row) => row.original.id?.toString()).filter(Boolean);

    if (!onDeleteUser || selectedUserIds.length === 0) return;

    try {
      // Delete each selected user
      for (const userId of selectedUserIds) {
        if (userId) {
          await onDeleteUser(userId);
        }
      }

      // Update local data by removing deleted users
      const updatedData = data.filter((item) => !selectedUserIds.includes(item.id?.toString()));
      setData(updatedData);
      table.resetRowSelection();
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  // Create a wrapper for RowActions that has access to onDeleteUser
  const RowActionsWrapper = ({ row }: { row: Row<UserModel> }) => (
    <RowActions row={row} onDeleteUser={onDeleteUser} onEditUser={onEditUser} isUpdating={isUpdating} />
  );

  const columns: ColumnDef<UserModel>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      size: 40,
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: "User",
      accessorKey: "username",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium text-foreground">{row.original.full_name || "N/A"}</div>
          <div className="text-sm text-muted-foreground">@{row.original.username || "N/A"}</div>
          <div className="text-sm text-muted-foreground">{row.original.email || "N/A"}</div>
        </div>
      ),
      size: 250,
      enableHiding: false,
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => {
        const role = row.original.role;
        return (
          <div className="space-y-1">
            <div className="font-medium text-foreground">{role?.name || "N/A"}</div>
            <div className="text-sm text-muted-foreground">{role?.description || "No description"}</div>
          </div>
        );
      },
      size: 200,
      filterFn: roleFilterFn,
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={cn(
              isActive
                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400"
                : "bg-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-gray-800/50 dark:text-gray-400",
            )}
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
      size: 100,
      filterFn: statusFilterFn,
    },
    {
      header: "Created",
      accessorKey: "created_at",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return <div className="text-sm text-muted-foreground">{date.toLocaleDateString()}</div>;
      },
      size: 120,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => <RowActionsWrapper row={row} />,
      size: 60,
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: globalFilterFn,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
      globalFilter: searchTerm || "",
    },
  });

  const uniqueStatusValues = useMemo(() => {
    return ["active", "inactive"];
  }, []);

  const uniqueRoleValues = useMemo(() => {
    const roles = Array.from(
      new Set(data.map((user) => user?.role?.name).filter((roleName) => roleName != null && roleName !== "")),
    );
    return roles;
  }, [data]);

  // Get counts for each status
  const statusCounts = useMemo(() => {
    const activeCount = data.filter((user) => user.isActive).length;
    const inactiveCount = data.filter((user) => !user.isActive).length;
    return new Map([
      ["active", activeCount],
      ["inactive", inactiveCount],
    ]);
  }, [data]);

  // Get counts for each role
  const roleCounts = useMemo(() => {
    const counts = new Map<string, number>();
    data.forEach((user) => {
      const roleName = user?.role?.name || "";
      if (roleName) {
        counts.set(roleName, (counts.get(roleName) || 0) + 1);
      }
    });
    return counts;
  }, [data]);

  const selectedStatuses = useMemo(() => {
    const filterValue = table.getColumn("isActive")?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table]);

  const selectedRoles = useMemo(() => {
    const filterValue = table.getColumn("role")?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table]);

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("isActive")?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table.getColumn("isActive")?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  const handleRoleChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("role")?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table.getColumn("role")?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  const hasActiveFilters = useMemo(() => {
    return searchTerm || selectedStatuses.length > 0 || selectedRoles.length > 0;
  }, [searchTerm, selectedStatuses.length, selectedRoles.length]);

  const clearAllFilters = () => {
    table.getColumn("isActive")?.setFilterValue(undefined);
    table.getColumn("role")?.setFilterValue(undefined);
  };

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Header with Add Button */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">User Accounts</h2>
            <p className="text-muted-foreground">Manage user accounts and permissions</p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Status Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Status
                    {selectedStatuses.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                        {selectedStatuses.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="start">
                  <div className="p-4">
                    <div className="mb-3 text-sm font-semibold text-foreground">Filter by status</div>
                    <div className="space-y-3">
                      {uniqueStatusValues.map((value) => (
                        <div key={value} className="flex items-center space-x-3">
                          <Checkbox
                            id={`status-${value}`}
                            checked={selectedStatuses.includes(value)}
                            onCheckedChange={(checked: boolean) => handleStatusChange(checked, value)}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <Label
                            htmlFor={`status-${value}`}
                            className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            <div className="flex items-center justify-between">
                              <span className="capitalize text-foreground">{value}</span>
                              <Badge variant="outline" className="ml-2 h-5 px-2 text-xs font-medium">
                                {statusCounts.get(value)}
                              </Badge>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Role Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <ListFilter className="h-4 w-4" />
                    Role
                    {selectedRoles.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                        {selectedRoles.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="start">
                  <div className="p-4">
                    <div className="mb-3 text-sm font-semibold text-foreground">Filter by role</div>
                    <div className="space-y-3">
                      {uniqueRoleValues.map((value) => (
                        <div key={value} className="flex items-center space-x-3">
                          <Checkbox
                            id={`role-${value}`}
                            checked={selectedRoles.includes(value ?? "")}
                            onCheckedChange={(checked: boolean) => handleRoleChange(checked, value ?? "")}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <Label
                            htmlFor={`role-${value}`}
                            className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-foreground">{value}</span>
                              <Badge variant="outline" className="ml-2 h-5 px-2 text-xs font-medium">
                                {roleCounts.get(value ?? "")}
                              </Badge>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Column Visibility */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Columns3 className="h-4 w-4" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
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

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearAllFilters} className="gap-2">
                  <CircleX className="h-4 w-4" />
                  Clear filters
                </Button>
              )}
            </div>

            {/* Bulk Actions */}
            {table.getSelectedRowModel().rows.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {table.getSelectedRowModel().rows.length} selected
                </span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2" disabled={isDeleting}>
                      <Trash className="h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <CircleAlert className="h-5 w-5 text-destructive" />
                        Delete Users
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {table.getSelectedRowModel().rows.length} user
                        {table.getSelectedRowModel().rows.length === 1 ? "" : "s"}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteRows}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-b">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} style={{ width: `${header.getSize()}px` }} className="h-12">
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            "flex cursor-pointer select-none items-center gap-2 text-sm font-medium",
                            "hover:text-foreground transition-colors",
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <ChevronUp className="h-4 w-4" />,
                            desc: <ChevronDown className="h-4 w-4" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        <div className="text-sm font-medium">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50 transition-colors"
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
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Search className="h-8 w-8" />
                      <p>No users found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor={`${id}-pagesize`} className="text-sm">
              Show
            </Label>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger id={`${id}-pagesize`} className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 25, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">entries</span>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length,
                )}
              </span>{" "}
              of <span className="font-medium text-foreground">{table.getFilteredRowModel().rows.length}</span> entries
            </p>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="gap-1"
                  >
                    <ChevronFirst className="h-4 w-4" />
                    First
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                    className="gap-1"
                  >
                    Last
                    <ChevronLast className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </>
  );
}

function RowActions({
  row,
  onDeleteUser,
  onEditUser,
  isUpdating,
}: {
  row: Row<UserModel>;
  onDeleteUser?: (userId: string) => Promise<void>;
  onEditUser?: (user: UserModel) => void;
  isUpdating?: boolean;
}) {
  const user = row.original;
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user.id || !onDeleteUser) return;

    try {
      setIsDeleting(true);
      await onDeleteUser(user.id.toString());
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    if (onEditUser) {
      onEditUser(user);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isUpdating}>
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setViewDialogOpen(true)} className="gap-2">
              <Eye className="h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit} className="gap-2" disabled={isUpdating}>
              <Edit className="h-4 w-4" />
              {isUpdating ? "Updating..." : "Edit User"}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="gap-2 text-destructive focus:text-destructive"
            disabled={isUpdating}
          >
            <Trash className="h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{user.full_name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export { AccountTable as Component };
