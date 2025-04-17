"use client";

import { useState } from "react";
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
import { Plus, ArrowRight } from "lucide-react";
import { Major } from "@/app/api/model/model";
import DepartmentItem from "../department/DepartmentItem";
import { getDepartmentById } from "@/lib/utils";
import { departmentData, subjects } from "@/app/api/fakedata";
import { SubjectTable } from "../subject/SubjectTable";

export function NewMajorDialog({
    onAdd,
}: {
    onAdd?: (newMajor: Major) => void;
}) {
    const [open, setOpen] = useState(false);
    const [newMajor, setNewMajor] = useState<Major>({
        id: 0,
        name: "",
        description: "",
        departmentId: departmentData[0]?.id ?? 0,
    });

    const [newlySelectedDepartment, setNewlySelectedDepartment] = useState(() =>
        getDepartmentById(newMajor.departmentId)
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setNewMajor((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDepartmentId = parseInt(e.target.value, 10);
        const newDepartment = getDepartmentById(newDepartmentId);
        setNewMajor((prev) => ({
            ...prev,
            departmentId: newDepartmentId,
        }));
        setNewlySelectedDepartment(newDepartment);
    };

    const handleSave = () => {
        if (onAdd) onAdd(newMajor);
        setOpen(false);
        setNewMajor({
            id: 0,
            name: "",
            description: "",
            departmentId: departmentData[0]?.id ?? 0,
        });
    };

    const selectedDepartment = getDepartmentById(newMajor.departmentId);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="shadow-md">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Major
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Major</DialogTitle>
                    <DialogDescription>
                        Enter the major's details and review before saving.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={newMajor.name}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            value={newMajor.description}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="department" className="text-right">
                            Department
                        </Label>
                        <select
                            id="department"
                            value={newMajor.departmentId}
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
                        {selectedDepartment && (
                            <DepartmentItem department={selectedDepartment} />
                        )}
                        {newlySelectedDepartment && selectedDepartment?.id !== newlySelectedDepartment.id && (
                            <ArrowRight size={20} />
                        )}
                        {newlySelectedDepartment && selectedDepartment?.id !== newlySelectedDepartment.id && (
                            <DepartmentItem department={newlySelectedDepartment} />
                        )}
                    </div>

                    <div className="grid grid-cols-1">
                        <Label className="text-center text-lg font-semibold mb-2">
                            Subject in Major
                        </Label>
                        <SubjectTable subjects={[]} />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
