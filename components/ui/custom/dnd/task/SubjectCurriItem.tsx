import React from "react";

import { subjects } from "@/app/api/fakedata";
import { CurriculumnSubject } from "@/app/api/model/CurriculumnSubject";
import { Subject } from "@/app/api/model/model";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Draggable } from "@hello-pangea/dnd";
import { BookOpen, Clock, GripVertical, Trash } from "lucide-react";

import AddSubjectPrerequisite from "../../education/subject/AddSubjectPrerequisite";

interface SubjectProps {
  subject: CurriculumnSubject;
  index: number;
  isGhost?: boolean;
  onRemove?: () => void;
  onUpdatePrerequisites?: (subjectId: string, prerequisites: Subject[]) => void;
}

const SubjectCurriItem: React.FC<SubjectProps> = ({
  subject: curriSubject,
  index,
  isGhost,
  onRemove,
  onUpdatePrerequisites,
}) => {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  const [prerequisitesState, setPrerequisitesState] = React.useState<Subject[]>(
    curriSubject.PrerequisiteSubjects || [],
  );

  // Handle adding multiple prerequisites at once (can be one or more)
  const handleAddPrerequisites = (newSubjects: Subject[]) => {
    const updatedPrerequisites = [...prerequisitesState, ...newSubjects];
    setPrerequisitesState(updatedPrerequisites);
    onUpdatePrerequisites?.(curriSubject.SubjectID, updatedPrerequisites);
  };

  const handleRemovePrerequisite = (prerequisiteId: string) => {
    const updatedPrerequisites = prerequisitesState.filter((p) => p.subjectId !== prerequisiteId);
    setPrerequisitesState(updatedPrerequisites);
    onUpdatePrerequisites?.(curriSubject.SubjectID, updatedPrerequisites);
  };

  return (
    <Draggable
      key={curriSubject.SubjectID}
      draggableId={curriSubject.SubjectID}
      index={index}
      shouldRespectForcePress={false}
    >
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

                <div className="z-10">
                  <AddSubjectPrerequisite
                    currentSubject={curriSubject}
                    subjects={subjects}
                    selectedPrerequisites={prerequisitesState}
                    onAddPrerequisites={handleAddPrerequisites}
                    onRemovePrerequisite={handleRemovePrerequisite}
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
  );
};

export default SubjectCurriItem;
