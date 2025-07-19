"use client";

import React from "react";

import { CurriculumnSubjectModel } from "@/app/api/model/CurriculumnSubjectModel";
import { SubjectModel } from "@/app/api/model/model";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { BookOpen, CircleFadingPlus, Dumbbell, FolderPlus, Globe, Lightbulb, School } from "lucide-react";
import styled from "styled-components";

import { CurriculumBoardType } from "./CreateCurriculumDialog";
import SemesterColumnV2 from "./SemesterColumnV2";

const Container = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 16px;
  padding: 8px;
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
`;

const getIconForBoardType = (boardTypeId: string) => {
  switch (boardTypeId) {
    case "core":
      return BookOpen;
    case "physical_education":
      return Dumbbell;
    case "skill_development":
      return Lightbulb;
    case "english":
      return Globe;
    case "philosophy":
      return School;
    default:
      return BookOpen;
  }
};

interface Board {
  id: string;
  name: string;
  type: string;
  curriculumId: string;
  curriculumTypeId: string;
  columnOrder: string[];
  semesterColumn: {
    [key: string]: {
      id: string;
      title: string;
      subjectIds: string[];
      curriculumTypeId: string;
      semesterNumber: number;
    };
  };
}

interface CurriculumBoardV2Props {
  currentStepBoard: Board | undefined;
  currentStep: CurriculumBoardType;
  subjects: { [key: string]: CurriculumnSubjectModel };
  onDragEnd: (result: any, boardId: string) => void;
  onAddSemester: (boardId: string) => void;
  onOpenSearchDialog: (columnId: string, boardId: string) => void;
  onRemoveSubject: (columnId: string, subjectId: string, boardId: string) => void;
  onRemoveColumn: (columnId: string, boardId: string) => void;
  onRenameColumn: (columnId: string, newTitle: string, boardId: string) => void;
  onUpdatePrerequisites: (subjectId: string, prerequisites: SubjectModel[], newSubjects?: SubjectModel[]) => void;
  existingSubjectIds?: Set<string>; // New prop
}

export default function CurriculumBoardV2({
  currentStepBoard,
  currentStep,
  subjects,
  onDragEnd,
  onAddSemester,
  onOpenSearchDialog,
  onRemoveSubject,
  onRemoveColumn,
  onRenameColumn,
  onUpdatePrerequisites,
  existingSubjectIds,
}: CurriculumBoardV2Props) {
  if (!currentStepBoard) {
    return (
      <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed">
        <h3 className="text-xl font-medium mb-4">No {currentStep.name} Board</h3>
        <p className="text-muted-foreground mb-6">
          This step is ready, but no board was created. This might be a configuration issue.
        </p>
      </div>
    );
  }

  const IconComponent = getIconForBoardType(currentStep.id);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${currentStep.color} text-white`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentStepBoard.name}</h2>
              <p className="text-sm text-gray-600">
                {Object.keys(currentStepBoard.semesterColumn).length} semesters •
                {Object.values(currentStepBoard.semesterColumn).reduce(
                  (total, column) => total + column.subjectIds.length,
                  0,
                )}{" "}
                subjects
              </p>
            </div>
          </div>
          <Button onClick={() => onAddSemester(currentStepBoard.id)} className="gap-2" variant="outline">
            <CircleFadingPlus size={16} />
            Add Semester
          </Button>
        </div>
      </div>

      <div className="p-6">
        <DragDropContext onDragEnd={(result) => onDragEnd(result, currentStepBoard.id)}>
          <Droppable droppableId={`columns-${currentStepBoard.id}`} direction="horizontal" type="column">
            {(provided) => (
              <Container {...provided.droppableProps} ref={provided.innerRef}>
                {currentStepBoard.columnOrder.map((columnId, index) => {
                  const column = currentStepBoard.semesterColumn[columnId];
                  if (!column) return null;

                  const columnSubjects = column.subjectIds
                    .map((subjectId) => ({
                      mappingId: subjectId,
                      subject: subjects[subjectId],
                    }))
                    .filter((item) => item.subject); // Filter out any undefined subjects

                  return (
                    <SemesterColumnV2
                      key={column.id}
                      column={column}
                      subjects={columnSubjects}
                      index={index}
                      onAddSubject={() => onOpenSearchDialog(column.id, currentStepBoard.id)}
                      onRemoveSubject={(colId: string, subjectId: string) =>
                        onRemoveSubject(colId, subjectId, currentStepBoard.id)
                      }
                      onRemoveColumn={(colId: string) => onRemoveColumn(colId, currentStepBoard.id)}
                      onRenameColumn={(colId: string, newTitle: string) =>
                        onRenameColumn(colId, newTitle, currentStepBoard.id)
                      }
                      onUpdatePrerequisites={onUpdatePrerequisites}
                      existingSubjectIds={existingSubjectIds}
                    />
                  );
                })}
                {provided.placeholder}
              </Container>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
