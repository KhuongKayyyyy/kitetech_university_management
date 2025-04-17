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
import { Plus } from "lucide-react";
import { departmentData, majors } from "@/app/api/fakedata";

export function AddSubjectDialog({
    onSubmit,
}: {
    onSubmit: (newSubject: {
        name: string;
        description: string;
        departmentId: number;
        majorId: number;
    }) => void;
}) {
    const [open, setOpen] = useState(false);
    const [subject, setSubject] = useState({
        name: "",
        description: "",
        departmentId: departmentData[0]?.id || 0,
        majorId: majors[departmentData[0]?.id]?.[0]?.id || 0,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setSubject((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        const newValue = Number(value);

        if (id === "departmentId") {
            const newMajorList = majors[newValue] || [];
            setSubject((prev) => ({
                ...prev,
                departmentId: newValue,
                majorId: newMajorList[0]?.id || 0,
            }));
        } else {
            setSubject((prev) => ({
                ...prev,
                [id]: newValue,
            }));
        }
    };

    const handleSave = () => {
        onSubmit(subject);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="shadow-md">
                    <Plus className="-ms-1 me-2 opacity-60" size={16} strokeWidth={2} />
                    Add Subject
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Subject</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new subject.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={subject.name}
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
                            value={subject.description}
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
                            value={subject.departmentId}
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
                            value={subject.majorId}
                            onChange={handleSelectChange}
                            className="col-span-3 rounded border p-2"
                        >
                            {(majors[subject.departmentId] || []).map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="submit" onClick={handleSave}>
                        Save Subject
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
