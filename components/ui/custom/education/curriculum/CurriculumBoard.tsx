import React from "react";

import { CurriculumnSubjectModel, defaultCurriculumnSubject } from "@/app/api/model/CurriculumnSubjectModel";
import { SubjectModel } from "@/app/api/model/model";
import { Button } from "@/components/ui/button";
import { SemesterColumn } from "@/components/ui/custom/dnd/column/SemesterColumn";
import { SubjectType } from "@/constants/enum/SubjectType";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { CircleFadingPlus, FolderPlus } from "lucide-react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
`;

interface Board {
  id: string;
  name: string;
  type: SubjectType;
  columnOrder: string[];
  semesterColumn: { [key: string]: { id: string; title: string; subjectIds: string[] } };
}

interface Step {
  id: number;
  name: string;
  type: string;
}

interface CurriculumBoardProps {
  currentStepBoard: Board | undefined;
  currentStep: Step;
  subjects: { [key: string]: CurriculumnSubjectModel };
  onDragEnd: (result: any, boardId: string) => void;
  onAddBoard: (type: SubjectType) => void;
  onAddSemester: (boardId: string) => void;
  onOpenSearchDialog: (columnId: string, boardId: string) => void;
  onRemoveSubject: (columnId: string, subjectId: string, boardId: string) => void;
  onRemoveColumn: (columnId: string, boardId: string) => void;
  onRenameColumn: (columnId: string, newTitle: string, boardId: string) => void;
  onUpdatePrerequisites: (subjectId: string, prerequisites: SubjectModel[]) => void;
}

export default function CurriculumBoard({
  currentStepBoard,
  currentStep,
  subjects,
  onDragEnd,
  onAddBoard,
  onAddSemester,
  onOpenSearchDialog,
  onRemoveSubject,
  onRemoveColumn,
  onRenameColumn,
  onUpdatePrerequisites,
}: CurriculumBoardProps) {
  if (!currentStepBoard) {
    return (
      <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed">
        <h3 className="text-xl font-medium mb-4">Add {currentStep.name}</h3>
        <p className="text-muted-foreground mb-6">Begin organizing your {currentStep.name.toLowerCase()} curriculum</p>
        <Button onClick={() => onAddBoard(currentStep.type as SubjectType)} size="lg" className="gap-2">
          <FolderPlus size={18} />
          Add {currentStep.name}
        </Button>
      </div>
    );
  }

  return (
    <div key={currentStepBoard.id} className="mb-8 p-4 bg-white rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">{currentStepBoard.name}</h2>
      </div>
      <DragDropContext onDragEnd={(result) => onDragEnd(result, currentStepBoard.id)}>
        <Droppable droppableId={`columns-${currentStepBoard.id}`} direction="horizontal" type="column">
          {(provided) => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {currentStepBoard.columnOrder.map((columnId, index) => {
                const column = currentStepBoard.semesterColumn[columnId];
                const tasks = column.subjectIds.map((taskId) => subjects[taskId]).filter(Boolean);
                return (
                  <SemesterColumn
                    key={column.id}
                    column={column}
                    subjects={tasks.map((subject) => ({
                      ...defaultCurriculumnSubject,
                      SubjectID: subject.SubjectID,
                      SubjectName: subject.SubjectName,
                      LectureHours: subject.LectureHours,
                      PracticeHours: subject.PracticeHours,
                      TotalCredits: subject.TotalCredits,
                      EducationProgramID: subject.EducationProgramID,
                      MajorID: subject.MajorID,
                      PrerequisiteSubjects: subject.PrerequisiteSubjects,
                    }))}
                    index={index}
                    onAddSubject={() => onOpenSearchDialog(column.id, currentStepBoard.id)}
                    onRemoveSubject={(colId, subjectId) => onRemoveSubject(colId, subjectId, currentStepBoard.id)}
                    onRemoveColumn={(colId) => onRemoveColumn(colId, currentStepBoard.id)}
                    onRenameColumn={(colId, newTitle) => onRenameColumn(colId, newTitle, currentStepBoard.id)}
                    onUpdatePrerequisites={onUpdatePrerequisites}
                  />
                );
              })}
              {provided.placeholder}
            </Container>
          )}
        </Droppable>
      </DragDropContext>
      <Button onClick={() => onAddSemester(currentStepBoard.id)} className="mt-4 gap-2" variant="outline">
        <CircleFadingPlus size={16} />
        Add Semester
      </Button>
    </div>
  );
}
