"use client";

import React, { useState } from "react";

import { CurriculumnSubject, defaultCurriculumnSubject } from "@/app/api/model/CurriculumnSubject";
import { Subject } from "@/app/api/model/model";
import { Button } from "@/components/ui/button";
import { SemesterColumn } from "@/components/ui/custom/dnd/column/SemesterColumn";
import SubjectSearchDialog from "@/components/ui/custom/education/curriculum/SearchSubjectDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubjectType } from "@/constants/enum/SubjectType";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { ArrowUpRight, CheckCircle2, CircleFadingPlus, FileInput, FolderPlus, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import styled from "styled-components";

const Container = styled.div`
  display: flex;w
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

type Board = {
  id: string;
  name: string;
  type: SubjectType;
  columnOrder: string[];
  semesterColumn: { [key: string]: { id: string; title: string; subjectIds: string[] } };
};

export default function CreateCurriculumPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const year = searchParams.get("year");
  const departmentId = searchParams.get("departmentId");
  const majorId = searchParams.get("majorId");

  const [openSearch, setOpenSearch] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null);
  const [targetBoardId, setTargetBoardId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [globalSelectedSubjects, setGlobalSelectedSubjects] = useState<Subject[]>([]);

  const [state, setState] = useState<{
    boards: Board[];
    subjects: { [key: string]: CurriculumnSubject };
  }>({
    boards: [],
    subjects: {},
  });

  // Steps configuration
  const steps = [
    { id: 1, name: "Core Subjects", type: "core" },
    { id: 2, name: "Physical Education", type: "pe" },
    { id: 3, name: "Skill Development", type: "skill" },
    { id: 4, name: "English Courses", type: "english" },
    { id: 5, name: "Philosophy", type: "philosophy" },
  ];

  //  new board
  const addBoard = (type: SubjectType) => {
    setState((prev) => ({
      ...prev,
      boards: [
        ...prev.boards,
        {
          id: `board-${type}-${Date.now()}`,
          name: `${type.charAt(0).toUpperCase() + type.slice(1)} Subjects`,
          type,
          columnOrder: [],
          semesterColumn: {},
        },
      ],
    }));
  };

  // Add a new semester to a board
  const addSemester = (boardId: string) => {
    setState((prev) => {
      const boards = prev.boards.map((board) => {
        if (board.id !== boardId) return board;
        const semesterNumber = board.columnOrder.length + 1;
        const newColumnId = `semester-${semesterNumber}-${Date.now()}`;
        return {
          ...board,
          semesterColumn: {
            ...board.semesterColumn,
            [newColumnId]: {
              id: newColumnId,
              title:
                board.type === "core" ? `Semester ${semesterNumber}` : `${board.type.toUpperCase()} ${semesterNumber}`,
              subjectIds: [],
            },
          },
          columnOrder: [...board.columnOrder, newColumnId],
        };
      });
      return { ...prev, boards };
    });
  };

  // Remove a semester column from a board
  const removeSemesterColumn = (columnId: string, boardId: string) => {
    setState((prev) => {
      const boards = prev.boards.map((board) => {
        if (board.id !== boardId) return board;
        const { [columnId]: _, ...remainingColumns } = board.semesterColumn;
        const updatedColumnOrder = board.columnOrder.filter((id) => id !== columnId);
        return {
          ...board,
          semesterColumn: remainingColumns,
          columnOrder: updatedColumnOrder,
        };
      });
      return { ...prev, boards };
    });
  };

  // Remove a subject from a semester column in a board
  const removeSubjectFromSemesterColumn = (columnId: string, subjectId: string, boardId: string) => {
    setState((prev) => {
      const boards = prev.boards.map((board) => {
        if (board.id !== boardId) return board;
        const column = board.semesterColumn[columnId];
        const updatedSubjectIds = column.subjectIds.filter((id) => id !== subjectId);
        return {
          ...board,
          semesterColumn: {
            ...board.semesterColumn,
            [columnId]: {
              ...column,
              subjectIds: updatedSubjectIds,
            },
          },
        };
      });
      return { ...prev, boards };
    });
  };

  // Get all globally selected subjects across all boards and columns
  const getAllGloballySelectedSubjects = (): Subject[] => {
    const allSelectedSubjects: Subject[] = [];

    state.boards.forEach((board) => {
      Object.values(board.semesterColumn).forEach((column) => {
        column.subjectIds.forEach((subjectId) => {
          const subject = state.subjects[subjectId];
          if (subject) {
            allSelectedSubjects.push({
              id: subject.SubjectID,
              subjectId: subject.SubjectID,
              name: subject.SubjectName,
              credits: subject.TotalCredits,
              majorId: subject.MajorID,
              departmentId: 1,
            });
          }
        });
      });
    });

    return allSelectedSubjects;
  };

  // Open subject search dialog for a specific column and board
  const openSearchDialog = (columnId: string, boardId: string) => {
    const globallySelected = getAllGloballySelectedSubjects();
    setGlobalSelectedSubjects(globallySelected);
    setTargetColumnId(columnId);
    setTargetBoardId(boardId);
    setOpenSearch(true);
  };

  const handleSelectSubjects = (subjects: Subject[], columnId: string, boardId: string) => {
    if (!columnId || !boardId || subjects.length === 0) return;

    const board = state.boards.find((b) => b.id === boardId);
    if (!board) return;

    const newSubjects: { [key: string]: CurriculumnSubject } = {};
    const newSubjectIds: string[] = [];

    subjects.forEach((subject) => {
      // const newSubjectId = `subject-${subject.subjectId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newSubjectId = subject.subjectId;
      const newSubject: CurriculumnSubject = {
        SubjectID: newSubjectId,
        SubjectName: subject.name,
        SubjectName_EN: subject.name,
        SubjectType: board.type,
        TotalCredits: subject.credits,
        MajorID: subject.majorId,
        Semester: board.columnOrder.indexOf(columnId) + 1,
        ProgramSemester: board.columnOrder.indexOf(columnId) + 1,
        IsRequired: true,
        CourseTypeID: 1,
        TrainingMajorCode: subject.majorId,
        CourseTypeName: board.type,
        CourseTypeName_EN: board.type,
        LectureHours: 0,
        PracticeHours: 0,
        EducationProgramID: "",
        AcademicYear: 0,
        AcademicYearID: 0,
        LectureCredits: 0,
        PracticeCredits: 0,
        SelfStudyCredits: 0,
        InitialStatus: 0,
        SubjectDetailInfo: "",
        SubjectTooltip: "",
        PrerequisiteType: 0,
        HasPrerequisite: false,
        TotalPrerequisiteTypes: 0,
        CourseTypeColorBackground: null,
        CourseTypeColorFont: null,
        SemesterName: "",
        IsSummerSemester: false,
        AUN_Info: "",
        CourseGroupID: "",
        Notes: null,
        AccumulatedCredits: 0,
        GPAAccumulated: 0,
        BachelorCredits: 0,
        EngineerCredits: 0,
        IsPartOfNonBachelorGroup: false,
        IsExcludedFromEngineerProgram: false,
        HasEngineerGroup: false,
        MappedCourseGroupID: null,
        ElectiveCredits: 0,
        MappedCourseGroupName: null,
        MappedCourseGroupName_EN: null,
        IsMapped: 0,
        ParentCourseGroupID: null,
        IsRequiredElective: 0,
        PracticeHoursCount: 0,
        LectureHoursCount: 0,
        SelfStudyHoursCount: 0,
        IsCountedForGPA: false,
        IsCountedForCredits: false,
        PrerequisiteSubjects: [],
      };
      newSubjects[newSubjectId] = newSubject;
      newSubjectIds.push(newSubjectId);
    });

    setState((prev) => {
      const boards = prev.boards.map((board) => {
        if (board.id !== boardId) return board;
        const column = board.semesterColumn[columnId];
        return {
          ...board,
          semesterColumn: {
            ...board.semesterColumn,
            [columnId]: {
              ...column,
              subjectIds: [...column.subjectIds, ...newSubjectIds],
            },
          },
        };
      });
      return {
        ...prev,
        boards,
        subjects: {
          ...prev.subjects,
          ...newSubjects,
        },
      };
    });
    setOpenSearch(false);
  };

  // Drag and drop logic for columns and subjects within a board
  const onDragEnd = (result: any, boardId: string) => {
    const { destination, source, draggableId, type } = result;

    // Exit if no destination or dropped in the same position
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    setState((prev) => {
      const board = prev.boards.find((b) => b.id === boardId);
      if (!board) return prev;

      // Reordering columns
      if (type === "column") {
        const newColumnOrder = [...board.columnOrder];
        newColumnOrder.splice(source.index, 1);
        newColumnOrder.splice(destination.index, 0, draggableId);

        return {
          ...prev,
          boards: prev.boards.map((b) => (b.id === boardId ? { ...b, columnOrder: newColumnOrder } : b)),
        };
      }

      // Reordering or moving subjects
      const sourceColumn = board.semesterColumn[source.droppableId];
      const destColumn = board.semesterColumn[destination.droppableId];

      if (!sourceColumn || !destColumn) return prev;

      const newSourceSubjectIds = [...sourceColumn.subjectIds];
      const [movedSubjectId] = newSourceSubjectIds.splice(source.index, 1);

      if (sourceColumn.id === destColumn.id) {
        // Reorder within the same column
        newSourceSubjectIds.splice(destination.index, 0, movedSubjectId);

        return {
          ...prev,
          boards: prev.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  semesterColumn: {
                    ...b.semesterColumn,
                    [sourceColumn.id]: {
                      ...sourceColumn,
                      subjectIds: newSourceSubjectIds,
                    },
                  },
                }
              : b,
          ),
        };
      } else {
        // Move to a different column
        const newDestSubjectIds = [...destColumn.subjectIds];
        newDestSubjectIds.splice(destination.index, 0, movedSubjectId);

        // Update semester number when moving between columns
        const subject = prev.subjects[movedSubjectId];
        const newSemester = board.columnOrder.indexOf(destination.droppableId) + 1;
        const updatedSubject = {
          ...subject,
          semester: newSemester,
        };

        return {
          ...prev,
          boards: prev.boards.map((b) =>
            b.id === boardId
              ? {
                  ...b,
                  semesterColumn: {
                    ...b.semesterColumn,
                    [sourceColumn.id]: {
                      ...sourceColumn,
                      subjectIds: newSourceSubjectIds,
                    },
                    [destColumn.id]: {
                      ...destColumn,
                      subjectIds: newDestSubjectIds,
                    },
                  },
                }
              : b,
          ),
          subjects: {
            ...prev.subjects,
            [movedSubjectId]: updatedSubject,
          },
        };
      }
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Get current step board
  const currentStepBoard = state.boards.find((board) => board.type === steps[currentStep - 1].type);

  // Add column renaming function
  const renameColumn = (columnId: string, newTitle: string, boardId: string) => {
    setState((prev) => {
      const boards = prev.boards.map((board) => {
        if (board.id !== boardId) return board;

        return {
          ...board,
          semesterColumn: {
            ...board.semesterColumn,
            [columnId]: {
              ...board.semesterColumn[columnId],
              title: newTitle,
            },
          },
        };
      });
      return { ...prev, boards };
    });
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Curriculum</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileInput size={16} />
            <span>{name}</span>
          </div>
          <div className="flex items-center gap-2">
            <FolderPlus size={16} />
            <span>Academic Year {year}</span>
          </div>
        </div>
      </div>

      {/* Step navigation */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Step {currentStep}: {steps[currentStep - 1].name}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              Previous
            </Button>
            <Button variant="outline" onClick={nextStep} disabled={currentStep === steps.length}>
              Next
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center px-4 py-2 rounded ${currentStep === step.id ? "bg-primary text-white" : "bg-muted"}`}
              onClick={() => setCurrentStep(step.id)}
            >
              {currentStep > step.id && <CheckCircle2 size={16} className="mr-2" />}
              <span>{step.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <button
          className="inline-flex h-10 w-fit rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={() => {
            const globallySelected = getAllGloballySelectedSubjects();
            setGlobalSelectedSubjects(globallySelected);
            setTargetColumnId(null);
            setTargetBoardId(null);
            setOpenSearch(true);
          }}
        >
          <span className="flex items-center gap-2">
            <Search size={16} strokeWidth={2} />
            <span>Search {steps[currentStep - 1].name}</span>
          </span>
          <kbd className="ml-4 inline-flex h-5 items-center rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      <SubjectSearchDialog
        selectedSubjects={globalSelectedSubjects}
        open={openSearch}
        onOpenChange={setOpenSearch}
        departmentId={Number(departmentId)}
        subjectType={steps[currentStep - 1].type as "core" | "pe" | "skill" | "english" | "philosophy"}
        onSelect={(subjects) => {
          if (targetColumnId && targetBoardId) handleSelectSubjects(subjects, targetColumnId, targetBoardId);
        }}
      />

      {/* Current step content */}
      <div>
        {!currentStepBoard ? (
          <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed">
            <h3 className="text-xl font-medium mb-4">Add {steps[currentStep - 1].name}</h3>
            <p className="text-muted-foreground mb-6">
              Begin organizing your {steps[currentStep - 1].name.toLowerCase()} curriculum
            </p>
            <Button onClick={() => addBoard(steps[currentStep - 1].type as any)} size="lg" className="gap-2">
              <FolderPlus size={18} />
              Add {steps[currentStep - 1].name}
            </Button>
          </div>
        ) : (
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
                      const tasks = column.subjectIds.map((taskId) => state.subjects[taskId]).filter(Boolean);
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
                          onAddSubject={() => openSearchDialog(column.id, currentStepBoard.id)}
                          onRemoveSubject={(colId, subjectId) =>
                            removeSubjectFromSemesterColumn(colId, subjectId, currentStepBoard.id)
                          }
                          onRemoveColumn={(colId) => removeSemesterColumn(colId, currentStepBoard.id)}
                          onRenameColumn={(colId, newTitle) => renameColumn(colId, newTitle, currentStepBoard.id)}
                        />
                      );
                    })}
                    {provided.placeholder}
                  </Container>
                )}
              </Droppable>
            </DragDropContext>
            <Button onClick={() => addSemester(currentStepBoard.id)} className="mt-4 gap-2" variant="outline">
              <CircleFadingPlus size={16} />
              Add Semester
            </Button>
          </div>
        )}
      </div>

      {/* Summary view (optional) */}
      {currentStep === steps.length && (
        <div className="mt-8 p-4 bg-muted/20 rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">Curriculum Summary</h3>
          {steps.map((step) => (
            <div key={step.id} className="mb-4">
              <h4 className="font-medium mb-2">{step.name}</h4>
              <div className="text-sm text-muted-foreground">
                {state.boards.find((board) => board.type === step.type) ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span>Added</span>
                  </div>
                ) : (
                  <span>Not added yet</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2" size="lg" disabled={currentStep < steps.length}>
              Save Curriculum
              <ArrowUpRight size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Curriculum Preview</DialogTitle>
              <DialogDescription>Review your curriculum before saving</DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              {steps.map((step) => {
                const board = state.boards.find((b) => b.type === step.type);
                return (
                  <div key={step.id} className="mb-6">
                    <h3 className="font-semibold mb-2">{step.name}</h3>
                    {board && (
                      <div className="space-y-2">
                        {Object.entries(board.semesterColumn).map(([id, column]) => (
                          <div
                            key={id}
                            className="p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/40 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-lg">{column.title}</h4>
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                {column.subjectIds.length} subjects
                              </span>
                            </div>
                            <ul className="space-y-2">
                              {column.subjectIds.map((subjectId) => {
                                const subject = state.subjects[subjectId];
                                return (
                                  subject && (
                                    <li
                                      key={subjectId}
                                      className="flex items-center gap-2 text-sm text-muted-foreground"
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                                      <span>{subject.SubjectName}</span>
                                    </li>
                                  )
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {}}>
                Cancel
              </Button>
              <Button onClick={() => {}}>Confirm & Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
