"use client";

import React, { useMemo, useRef, useState } from "react";

import { UserModel } from "@/app/api/model/UserModel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CircleX, Grid, List, Plus, Search, Users } from "lucide-react";

import AccountItem from "./AccountItem";
import AccountTable from "./AccountTable";

// Mock data for users (same as in AccountTable)
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

export default function AccountSection() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 9; // 3x3 grid for cards
  const users = mockUsers;

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }

    const searchLower = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.full_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower) ||
        (user.role.name || "").toLowerCase().includes(searchLower),
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
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
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
              {filteredUsers.length} of {users.length} users
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
            <Button className="mt-4" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add First User
            </Button>
          )}
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <AccountTable users={users} searchTerm={searchTerm} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedUsers.map((user) => (
              <AccountItem key={user.id} user={user} />
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
    </div>
  );
}
