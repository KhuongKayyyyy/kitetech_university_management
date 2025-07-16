import React, { useMemo, useState } from "react";

import { FacultyModel } from "@/app/api/model/model";
import { departmentService } from "@/app/api/services/departmentService";
import { Calculator, DraftingCompass, LampWallDown, ScanEyeIcon, TextSearchIcon } from "lucide-react";
import { toast, Toaster } from "sonner";

import { Card } from "../../../card";
import { DepartmentDialog } from "./DepartmentDialog";

const iconColors = [
  { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
  { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
  { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
  { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200" },
  { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
];

const iconMap = [Calculator, DraftingCompass, LampWallDown, ScanEyeIcon, TextSearchIcon];

interface DepartmentItemProps {
  department: FacultyModel;
  onDelete: (id: number) => void;
  isSelected: boolean;
  onSelect: () => void;
}

const DepartmentItem = ({ department: initialDepartment, onDelete, isSelected, onSelect }: DepartmentItemProps) => {
  const [department, setDepartment] = useState<FacultyModel>(initialDepartment);
  const [open, setOpen] = useState(false);

  const { bg, text, border } = useMemo(() => {
    const random = Math.floor(Math.random() * iconColors.length);
    return iconColors[random];
  }, []);

  const Icon = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * iconMap.length);
    return iconMap[randomIndex];
  }, []);

  const handleSave = async (updated: FacultyModel) => {
    try {
      const saved = await departmentService.updateDepartment(updated);
      toast.success("Department " + saved.name + " updated successfully");
      setDepartment(saved);
      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card className="group relative flex items-center flex-row px-6 py-5 sm:px-8 md:px-10 max-w-full overflow-hidden hover:shadow-lg transition-all duration-200 border-0 ring-1 ring-border hover:ring-2 hover:ring-primary/20 cursor-pointer">
      <div
        className={`flex items-center justify-center w-14 h-14 rounded-xl shrink-0 ${bg} ${border} border-2 shadow-sm group-hover:scale-105 transition-transform duration-200`}
      >
        {Icon && <Icon className={`w-7 h-7 ${text}`} strokeWidth={2} />}
      </div>
      <div className="flex flex-col gap-2 ml-5 overflow-hidden flex-1">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight break-words text-foreground group-hover:text-primary transition-colors duration-200">
          {department.name}
        </h1>
        <p className="text-sm sm:text-sm md:text-base text-muted-foreground break-words font-medium">
          {department.majors?.length} {department.majors?.length === 1 ? "major" : "majors"}
        </p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-4">
        <DepartmentDialog
          department={department}
          isIcon
          open={open}
          onOpenChange={setOpen}
          handleSave={handleSave}
          handleDelete={() => onDelete(department.id)}
        />
      </div>
    </Card>
  );
};

export default DepartmentItem;
