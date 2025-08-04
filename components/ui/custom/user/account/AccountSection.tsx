"use client";

import React, { useMemo, useRef, useState } from "react";

import { UserCreateModel, UserModel } from "@/app/api/model/UserModel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsers } from "@/hooks/useUser";
import { ChevronLeft, ChevronRight, CircleX, Grid, List, Plus, Search, Users } from "lucide-react";
import { toast, Toaster } from "sonner";

import AccountItem from "./AccountItem";
import AccountTable from "./AccountTable";
import CreateNewAccountDialog from "./CreateNewAccountDialog";
import UpdateAccountDialog from "./UpdateAccountDialog";

export default function AccountSection() {
  const { users, loading, error, addUser, isAdding, deleteUser, isDeleting, updateUser, isUpdating } = useUsers();
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 9; // 3x3 grid for cards

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users || [];
    }

    const searchLower = searchTerm.toLowerCase();
    return (users || []).filter(
      (user) =>
        user?.full_name?.toLowerCase().includes(searchLower) ||
        user?.email?.toLowerCase().includes(searchLower) ||
        user?.username?.toLowerCase().includes(searchLower) ||
        user?.role?.name?.toLowerCase().includes(searchLower),
    );
  }, [searchTerm, users]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const [isCreateAccountDialogOpen, setIsCreateAccountDialogOpen] = useState(false);
  const [isUpdateAccountDialogOpen, setIsUpdateAccountDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);

  const handleCreateAccount = async (userData: UserCreateModel) => {
    try {
      await addUser(userData);
    } catch (error) {
      // Error is already handled by the hook
      console.error("Error creating account:", error);
    }
  };

  const handleUpdateAccount = async (userData: UserModel) => {
    try {
      await updateUser(userData);
    } catch (error) {
      // Error is already handled by the hook
      console.error("Error updating account:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
    } catch (error) {
      // Error is already handled by the hook
      console.error("Error deleting user:", error);
    }
  };

  const handleEditUser = (user: UserModel) => {
    setSelectedUser(user);
    setIsUpdateAccountDialogOpen(true);
  };

  // Loading skeleton components
  const HeaderSkeleton = () => (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  );

  const ControlsSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );

  const TableSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );

  const CardsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex justify-between items-center mt-4">
            <Skeleton className="h-6 w-16" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <HeaderSkeleton />
        <ControlsSkeleton />
        {viewMode === "table" ? <TableSkeleton /> : <CardsSkeleton />}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading users</h3>
          <p className="text-gray-600 mb-4">{error?.message}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              User Management
            </h1>
            <p className="text-gray-600 mt-1">Manage user accounts, roles, and permissions</p>
          </div>

          {/* Add User Button */}
          <Button
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            onClick={() => setIsCreateAccountDialogOpen(true)}
            disabled={isAdding}
          >
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                onClick={() => setSearchTerm("")}
                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
              >
                <CircleX className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* View Toggle and Stats */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {filteredUsers.length} of {users?.length || 0} users
            </span>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded-lg p-1">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8 px-3"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="h-8 px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">
            {searchTerm ? "Try adjusting your search criteria." : "Get started by adding your first user."}
          </p>
          {!searchTerm && (
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => setIsCreateAccountDialogOpen(true)}
              disabled={isAdding}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First User
            </Button>
          )}
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <AccountTable
            users={filteredUsers}
            searchTerm={searchTerm}
            onDeleteUser={handleDeleteUser}
            onEditUser={handleEditUser}
            isDeleting={isDeleting}
            isUpdating={isUpdating}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedUsers.map((user) => (
              <AccountItem
                key={user.id}
                user={user}
                onDelete={handleDeleteUser}
                onEdit={handleEditUser}
                isDeleting={isDeleting}
                isUpdating={isUpdating}
              />
            ))}
          </div>

          {/* Pagination for Cards */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <CreateNewAccountDialog
        isOpen={isCreateAccountDialogOpen}
        setIsOpen={setIsCreateAccountDialogOpen}
        onCreateAccount={handleCreateAccount}
        isAdding={isAdding}
      />
      <UpdateAccountDialog
        isOpen={isUpdateAccountDialogOpen}
        setIsOpen={setIsUpdateAccountDialogOpen}
        user={selectedUser}
        onUpdateAccount={handleUpdateAccount}
        isUpdating={isUpdating}
      />
      <Toaster />
    </div>
  );
}
