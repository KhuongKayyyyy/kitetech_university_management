"use client";
import { useRouter } from "next/navigation";
import { useCharacterLimit } from "@/components/hooks/use-character-limit";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId, useState } from "react";
import { departmentData, majors } from "@/app/api/fakedata";

function AddNewCurriculumDialog() {
    const maxLength = 180;
    const {
        value,
        characterCount,
        handleChange,
        maxLength: limit,
    } = useCharacterLimit({
        maxLength,
        initialValue:
            "Hey, I am Margaret, a web developer who loves turning ideas into amazing websites!",
    });
    const id = useId();
    const router = useRouter();
    const [curriculumName, setCurriculumName] = useState("Sơ đồ đào tạo - Mạng máy tính");
    const [academicYear, setAcademicYear] = useState("2025");
    const [departmentId, setDepartmentId] = useState<number>(1)
    const [majorId, setMajorId] = useState<number>(1)
    const handleSave = () => {
        router.push(
            `/admin/education/curriculum/create?name=${encodeURIComponent(curriculumName)}&year=${academicYear}&departmentId=${departmentId}&majorId=${majorId}`
        );
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Add New Curriculum</Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
                <DialogHeader className="contents space-y-0 text-left">
                    <DialogTitle className="border-b border-border px-6 py-4 text-base">
                        Edit profile
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    Make changes to your profile here. You can change your photo and set a username.
                </DialogDescription>
                <div className="overflow-y-auto">
                    <div className="px-6 pb-6 pt-4">
                        <form className="space-y-4">
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor={`${id}-first-name`}>Tên sơ đồ đào tạo</Label>
                                    <Input
                                        id={`${id}-first-name`}
                                        placeholder="Matt"
                                        defaultValue={"Sơ đồ đào tạo - Mạng máy tính"}
                                        type="text"
                                        required
                                        onChange={(e) => setCurriculumName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Academic Year</Label>
                                <input
                                    type="number"
                                    min="2025"
                                    max="2100"
                                    step="1"
                                    value={academicYear}
                                    onChange={(e) => setAcademicYear(e.target.value)}
                                    className="col-span-3 rounded border p-2"
                                    placeholder="Select year"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Department</Label>
                                <select value={departmentId} onChange={(e) => setDepartmentId(Number(e.target.value))} className="col-span-3 rounded border p-2">
                                    {departmentData.map((d) => (
                                        <option key={d.id.toString()} value={String(d.id)}>{d.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Major</Label>
                                <select value={majorId} onChange={(e) => setMajorId(Number(e.target.value))} className="col-span-3 rounded border p-2">
                                    {(majors[departmentId] || []).map((m) => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                        </form>
                    </div>
                </div>
                <DialogFooter className="border-t border-border px-6 py-4">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild onClick={handleSave}>
                        <Button type="button">Save changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export { AddNewCurriculumDialog };
