"use client"

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
import { Plus } from "lucide-react";
import { Department } from "@/app/api/model/model";
import { MajorInDepartTable } from "../major/MajorInDepartTable";

export function NewDepartmentDialog({
    onAdd,
}: {
    onAdd?: (newDepartment: Department) => void;
}) {
    const [open, setOpen] = useState(false);
    const [newDepartment, setNewDepartment] = useState<Department>({
        id: 0,
        name: "",
        description: "",
        icon: "",
        majors: [],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setNewDepartment((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSave = () => {
        if (onAdd) onAdd(newDepartment);
        setOpen(false);
        setNewDepartment({
            id: 0,
            name: "",
            description: "",
            icon: "",
            majors: [],
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="shadow-md">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Department
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl w-full">
                <DialogHeader>
                    <DialogTitle>Add New Department</DialogTitle>
                    <DialogDescription>
                        Enter the department’s details and add any majors before saving.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={newDepartment.name}
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
                            value={newDepartment.description}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>

                    {/* Same major table component used in detail dialog */}
                    <MajorInDepartTable department={newDepartment} setDepartment={setNewDepartment} />
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
