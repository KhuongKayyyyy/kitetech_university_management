"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { Major } from "@/app/api/model/model";
import DepartmentItem from "../department/DepartmentItem";
import { getDepartmentById } from "@/lib/utils";
import { departmentData, subjects } from "@/app/api/fakedata";
import { ArrowRight } from "lucide-react";
import { SubjectTable } from "../subject/SubjectTable";

export function MajorDetailDialog({
    major: initialMajor,
    isIcon,
    open,
    onOpenChange
}: {
    major: Major;
    isIcon?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const [editedMajor, setEditedMajor] = useState(initialMajor);
    const [newlySelectedDepartment, setNewlySelectedDepartment] = useState<ReturnType<typeof getDepartmentById> | undefined>(undefined);
    const initialDepartment = getDepartmentById(initialMajor.departmentId);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setEditedMajor((prev: any) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDepartmentId = e.target.value;
        const newDepartmentIdNumber = parseInt(newDepartmentId, 10);
        const newDepartment = getDepartmentById(newDepartmentIdNumber);
        setEditedMajor((prev: any) => ({
            ...prev,
            departmentId: newDepartmentIdNumber,
        }));
        setNewlySelectedDepartment(newDepartment);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {isIcon ? (
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="absolute top-2 right-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                        aria-label="Edit"
                    >
                        <Edit size={15} />
                    </Button>
                </DialogTrigger>
            ) : null}

            <DialogContent className="sm:max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Major</DialogTitle>
                    <DialogDescription>
                        Make changes to the major. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={editedMajor.name}
                            className="col-span-3"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            value={editedMajor.description}
                            className="col-span-3"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="department" className="text-right">
                            Department
                        </Label>
                        <select
                            id="department"
                            value={editedMajor.departmentId}
                            className="col-span-3 border rounded px-2 py-1"
                            onChange={handleDepartmentChange}
                        >
                            {departmentData.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                        {initialDepartment && (
                            <DepartmentItem department={initialDepartment} />
                        )}
                        {newlySelectedDepartment && initialDepartment?.id !== newlySelectedDepartment.id && (
                            <ArrowRight size={20} />
                        )}
                        {newlySelectedDepartment && initialDepartment?.id !== newlySelectedDepartment.id && (
                            <DepartmentItem department={newlySelectedDepartment} />
                        )}
                    </div>
                    <div className="grid grid-cols-1">
                        <Label htmlFor="department" className="text-center text-lg font-semibold mb-2">
                            Subject in Major
                        </Label>
                        <SubjectTable subjects={subjects}></SubjectTable>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    );
}