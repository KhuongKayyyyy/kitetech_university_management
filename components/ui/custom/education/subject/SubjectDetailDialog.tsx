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
import { Edit } from "lucide-react";
import { Subject } from "@/app/api/model/model";
import { departmentData, majors } from "@/app/api/fakedata"; // make sure this is imported correctly

export function SubjectDetailDialog({
    subject,
    isIcon,
    open,
    onOpenChange,
}: {
    subject: Subject;
    isIcon?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const [editedSubject, setEditedSubject] = useState(subject);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setEditedSubject((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setEditedSubject((prev) => ({
            ...prev,
            [id]: Number(value),
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

            <DialogContent className="sm:max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Subject</DialogTitle>
                    <DialogDescription>
                        Modify the subject information. Save your changes when done.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={editedSubject.name}
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
                            value={editedSubject.description}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="departmentId" className="text-right">
                            Department
                        </Label>
                        <select
                            id="departmentId"
                            value={editedSubject.departmentId}
                            onChange={handleSelectChange}
                            className="col-span-3 rounded border p-2"
                        >
                            {departmentData.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="majorId" className="text-right">
                            Major
                        </Label>
                        <select
                            id="majorId"
                            value={editedSubject.majorId}
                            onChange={handleSelectChange}
                            className="col-span-3 rounded border p-2"
                        >
                            {(majors[editedSubject.departmentId] || []).map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
