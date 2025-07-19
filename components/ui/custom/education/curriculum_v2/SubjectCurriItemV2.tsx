"use client";

import React from "react";

import { CurriculumnSubjectModel } from "@/app/api/model/CurriculumnSubjectModel";
import { SubjectModel } from "@/app/api/model/model";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Draggable } from "@hello-pangea/dnd";
import { BookOpen, Clock, GripVertical, Trash } from "lucide-react";
import { toast, Toaster } from "sonner";

import AddSubjectPrerequisite from "../subject/AddSubjectPrerequisiteDialog";

interface SubjectCurriItemV2Props {
  subject: CurriculumnSubjectModel;
  index: number;
  mappingId: string; // Add mapping ID prop for drag and drop
  isGhost?: boolean;
  onRemove?: () => void;
  onUpdatePrerequisites?: (subjectId: string, prerequisites: SubjectModel[], newSubjects: SubjectModel[]) => void;
  existingSubjectIds?: Set<string>; // New prop to track existing subjects
}

export default function SubjectCurriItemV2({
  subject: curriSubject,
  index,
  mappingId,
  isGhost,
  onRemove,
  onUpdatePrerequisites,
  existingSubjectIds = new Set(),
}: SubjectCurriItemV2Props) {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (!onRemove) {
        toast.error("Remove function not available");
        return;
      }
      // Add confirmation for debugging
      toast.info(`Attempting to remove subject: ${curriSubject.SubjectName}`);
      onRemove?.();
    } catch (error) {
      console.error("Error removing subject:", error);
      toast.error("Failed to remove subject");
    }
  };

  const [prerequisitesState, setPrerequisitesState] = React.useState<SubjectModel[]>(
    curriSubject.PrerequisiteSubjects || [],
  );

  // Sync prerequisite state when the subject's prerequisite data changes
  React.useEffect(() => {
    console.log("SubjectCurriItemV2 useEffect triggered");
    console.log("Setting prerequisites from subject data:", curriSubject.PrerequisiteSubjects);
    setPrerequisitesState(curriSubject.PrerequisiteSubjects || []);
  }, [curriSubject.PrerequisiteSubjects]);

  // Handle adding multiple prerequisites at once (can be one or more)
  const handleAddPrerequisites = (newSubjects: SubjectModel[]) => {
    console.log("Adding prerequisites:", newSubjects);
    const updatedPrerequisites = [...prerequisitesState, ...newSubjects];
    setPrerequisitesState(updatedPrerequisites);
    onUpdatePrerequisites?.(curriSubject.SubjectID, updatedPrerequisites, newSubjects);
  };

  const handleRemovePrerequisite = (prerequisiteId: string) => {
    try {
      console.log("Removing prerequisite with ID:", prerequisiteId);
      console.log("Current prerequisites state:", prerequisitesState);
      console.log("Prerequisite ID type:", typeof prerequisiteId);
      console.log(
        "Prerequisites in state:",
        prerequisitesState.map((p) => `ID: ${p.id} (type: ${typeof p.id})`),
      );

      // Handle both string and number IDs by converting to string for comparison
      const prerequisiteToRemove = prerequisitesState.find((p) => p.id.toString() === prerequisiteId.toString());
      if (!prerequisiteToRemove) {
        console.log("Prerequisite not found in state");
        toast.error("Prerequisite not found");
        return;
      }

      // Filter by converting both IDs to string for consistent comparison
      const updatedPrerequisites = prerequisitesState.filter((p) => p.id.toString() !== prerequisiteId.toString());
      console.log("Updated prerequisites after removal:", updatedPrerequisites);

      // Update local state first
      setPrerequisitesState(updatedPrerequisites);

      // Then notify parent component with the updated prerequisites
      // Pass empty array as newSubjects since we're removing, not adding
      onUpdatePrerequisites?.(curriSubject.SubjectID, updatedPrerequisites, []);

      toast.success(`Removed "${prerequisiteToRemove.name}" as prerequisite`);
    } catch (error) {
      console.error("Error removing prerequisite:", error);
      toast.error("Failed to remove prerequisite");
    }
  };

  return (
    <>
      <Draggable key={mappingId} draggableId={mappingId} index={index} shouldRespectForcePress={false}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={{
              ...provided.draggableProps.style,
              display: "block",
              visibility: "visible",
            }}
          >
            <div
              {...provided.dragHandleProps}
              tabIndex={0}
              className={cn(
                "relative border rounded-xl p-4 mb-3 flex items-start gap-3 cursor-grab",
                "transition-all duration-300 ease-out transform-gpu",
                "bg-white/95 shadow-sm",
                "hover:shadow-lg hover:-translate-y-1",
                snapshot.isDragging
                  ? "border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-lg shadow-green-500/20 scale-[1.02]"
                  : "border-slate-200 hover:border-blue-400",
                isGhost && "opacity-40",
                "active:cursor-grabbing active:scale-95 active:shadow-inner active:translate-y-0",
              )}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-slate-400 cursor-grab transition-colors duration-200 flex items-center p-1.5 rounded-lg hover:text-slate-600 hover:bg-slate-100/80 active:cursor-grabbing">
                    <GripVertical size={16} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Drag to reorder</TooltipContent>
              </Tooltip>

              <div className="flex-1 min-w-0 flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                  <div className="text-blue-500 flex items-center flex-shrink-0 bg-blue-50 p-1.5 rounded-lg transition-colors hover:bg-blue-100">
                    <BookOpen size={18} />
                  </div>
                  <div className="font-semibold text-slate-800 text-[15px] leading-normal flex-1 transition-colors hover:text-blue-700">
                    {curriSubject.SubjectName}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-600 font-medium hover:bg-slate-100 hover:border-slate-300 transition-colors">
                        ID: {curriSubject.SubjectID}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Subject ID</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm hover:shadow-md hover:from-blue-600 hover:to-blue-700 transition-all">
                        <Clock size={14} />
                        {curriSubject.TotalCredits} Credits
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Credit hours</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-200/80 text-xs text-purple-600 font-medium hover:bg-purple-100 hover:border-purple-300 transition-colors">
                        Semester: {curriSubject.Semester}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Semester Number</TooltipContent>
                  </Tooltip>

                  <div className="z-10">
                    <AddSubjectPrerequisite
                      currentSubject={curriSubject}
                      selectedPrerequisites={prerequisitesState}
                      onAddPrerequisites={handleAddPrerequisites}
                      onRemovePrerequisite={handleRemovePrerequisite}
                      existingSubjectIds={existingSubjectIds}
                    />
                  </div>
                </div>
              </div>

              {onRemove && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleRemoveClick}
                      className="bg-transparent border-none text-slate-400 cursor-pointer transition-all duration-200 p-2.5 rounded-lg opacity-70 flex items-center justify-center flex-shrink-0 hover:text-red-500 hover:bg-red-50 hover:opacity-100 hover:scale-110 hover:shadow-sm active:scale-95"
                    >
                      <Trash size={18} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Remove subject</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        )}
      </Draggable>
    </>
  );
}
