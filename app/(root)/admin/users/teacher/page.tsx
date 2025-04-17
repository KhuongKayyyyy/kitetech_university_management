"use client"

import React, { useState } from "react"
import TeacherItem from "@/components/ui/custom/user/teacher/TeacherItem"
import TeachDetailInformation from "@/components/ui/custom/user/teacher/TeachDetailInformation"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { ChevronFirst, ChevronLast } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { teachers } from "@/app/api/fakedata"

// const mockTeachers = Array.from({ length: 100 }, (_, i) => ({
//     id: i + 1,
//     name: `Teacher ${i + 1}`,
// }))

const Page = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(25)
    const [selectedTeacher, setSelectedTeacher] = useState<{ id: number; name: string } | null>(null)

    const totalPages = Math.ceil(teachers.length / pageSize)


    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((p) => p + 1)
    }

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage((p) => p - 1)
    }

    const handleFirst = () => setCurrentPage(1)
    const handleLast = () => setCurrentPage(totalPages)

    const currentTeachers = teachers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    return (
        <div className="px-5 bg-primary-foreground py-5 min-h-full">
            <h1 className="text-4xl font-extrabold pb-5">Teacher Database</h1>

            {/* Grid + Detail Panel */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1">
                    {currentTeachers.map((t) => (
                        <TeacherItem
                            key={t.id}
                            teacher={t}
                        // onViewProfile={() => setSelectedTeacher(t)}
                        />
                    ))}
                </div>

                {/* Detail Card */}
                {selectedTeacher && (
                    <div className="hidden lg:block w-full lg:w-1/3">
                        <TeachDetailInformation teacher={selectedTeacher} onClose={() => setSelectedTeacher(null)}
                        />
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-end w-full gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Rows per page:</span>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(value) => {
                            setPageSize(Number(value))
                            setCurrentPage(1)
                        }}
                    >
                        <SelectTrigger className="w-[80px] h-8">
                            <SelectValue placeholder="Rows" />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 25, 50].map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-4 ml-auto">
                    <p className="text-sm text-muted-foreground whitespace-nowrap">
                        Showing {(currentPage - 1) * pageSize + 1} -{" "}
                        {Math.min(currentPage * pageSize, teachers.length)} of {teachers.length}
                    </p>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={handleFirst}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronFirst size={16} />
                                </Button>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationPrevious onClick={handlePrevious} />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext onClick={handleNext} />
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={handleLast}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronLast size={16} />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    )
}

export default Page
