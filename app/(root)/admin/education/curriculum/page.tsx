"use client";

import React, { useMemo, useState } from "react";

import { curriculumData } from "@/app/api/fakedata";
import { Button } from "@/components/ui/button";
import { AddNewCurriculumDialog } from "@/components/ui/custom/education/curriculum/AddNewCurriculumnDialog";
import CurriculumItem from "@/components/ui/custom/education/curriculum/CurriculumItem";
import { BookOpen, Grid, List, Plus, Search } from "lucide-react";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // Filter curriculums based on search term
  const filteredCurriculums = useMemo(() => {
    if (!searchTerm.trim()) {
      return curriculumData;
    }

    const searchLower = searchTerm.toLowerCase();
    return curriculumData.filter(
      (curriculum) => curriculum.name.toLowerCase().includes(searchLower),
      // ||  // curriculum.description?.toLowerCase().includes(searchLower),
    );
  }, [searchTerm]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Curriculum Management
            </h1>
            <p className="text-gray-600 mt-1">Manage academic curriculums and their structures</p>
          </div>

          {/* Add Curriculum Button */}
          <Button
            onClick={() => setOpenAddDialog(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Curriculum
          </Button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search curriculums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* View Toggle and Stats */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {filteredCurriculums.length} of {curriculumData.length} curriculums
            </span>

            <div className="flex items-center border border-gray-300 rounded-lg p-1">
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="h-8 px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8 px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {filteredCurriculums.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No curriculums found</h3>
          <p className="text-gray-600">
            {searchTerm ? "Try adjusting your search criteria." : "Get started by adding your first curriculum."}
          </p>
          {!searchTerm && (
            <Button onClick={() => setOpenAddDialog(true)} className="mt-4" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add First Curriculum
            </Button>
          )}
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredCurriculums.map((curriculum) => (
            <CurriculumItem key={curriculum.id} curriculum={curriculum} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Name</th>
                  {/* <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Description</th> */}
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-900">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCurriculums.map((curriculum) => (
                  <tr key={curriculum.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{curriculum.name}</div>
                    </td>
                    {/* <td className="px-6 py-4">
                      <div className="text-gray-600 max-w-xs truncate">
                        {curriculum.description || "No description"}
                      </div>
                    </td> */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <CurriculumItem key={curriculum.id} curriculum={curriculum} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddNewCurriculumDialog open={openAddDialog} setOpen={setOpenAddDialog} onSubmit={() => {}} />
    </div>
  );
};

export default Page;
