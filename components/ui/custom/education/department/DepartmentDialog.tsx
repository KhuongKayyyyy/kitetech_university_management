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
import { Edit } from "lucide-react";
import { MajorInDepartTable } from "../major/MajorInDepartTable";
import { Department } from "@/app/api/model/model";

export function DepartmentDialog({
    department,
    isIcon,
    open,
    onOpenChange
}: {
    department: Department;
    isIcon?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const [editedDepartment, setEditedDepartment] = useState(department);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setEditedDepartment((prev) => ({
            ...prev,
            [id]: value,
        }));
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

            <DialogContent className="sm:max-w-4xl w-full">
                <DialogHeader>
                    <DialogTitle>Edit Department</DialogTitle>
                    <DialogDescription>
                        Make changes to the department. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={editedDepartment.name}
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
                            value={editedDepartment.description}
                            className="col-span-3"
                            onChange={handleInputChange}
                        />
                    </div>
                    <MajorInDepartTable department={editedDepartment} />
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
