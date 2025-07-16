"use client";

import React, { useState } from "react";

import { CurriculumnSubjectModel } from "@/app/api/model/CurriculumnSubjectModel";
import { SubjectModel } from "@/app/api/model/model";
import CurriculumBoard from "@/components/ui/custom/education/curriculum/CurriculumBoard";
import CurriculumSummary from "@/components/ui/custom/education/curriculum/CurriculumSummary";
import SaveCurriculumDialog from "@/components/ui/custom/education/curriculum/SaveCurriculumDialog";
import SearchSubjectSection from "@/components/ui/custom/education/curriculum/SearchSubjectSection";
import StepNavigation from "@/components/ui/custom/education/curriculum/StepNavigation";
import { SubjectType } from "@/constants/enum/SubjectType";
import { FileInput, FolderPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";

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
  const [globalSelectedSubjects, setGlobalSelectedSubjects] = useState<SubjectModel[]>([]);

  const [state, setState] = useState<{
    boards: Board[];
    subjects: { [key: string]: CurriculumnSubjectModel };
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

  // Add new board
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
  const getAllGloballySelectedSubjects = (): SubjectModel[] => {
    const allSelectedSubjects: SubjectModel[] = [];

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
              faculty_id: 1,
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

  // Handle opening global search (not tied to specific column)
  const handleOpenGlobalSearch = () => {
    const globallySelected = getAllGloballySelectedSubjects();
    setGlobalSelectedSubjects(globallySelected);
    setTargetColumnId(null);
    setTargetBoardId(null);
    setOpenSearch(true);
  };

  const handleSelectSubjects = (subjects: SubjectModel[]) => {
    if (!targetColumnId || !targetBoardId || subjects.length === 0) return;

    const board = state.boards.find((b) => b.id === targetBoardId);
    if (!board) return;

    const newSubjects: { [key: string]: CurriculumnSubjectModel } = {};
    const newSubjectIds: string[] = [];

    subjects.forEach((subject) => {
      const newSubjectId = subject.subjectId;
      const newSubject: CurriculumnSubjectModel = {
        SubjectID: newSubjectId,
        SubjectName: subject.name,
        SubjectName_EN: subject.name,
        TotalCredits: subject.credits,
        MajorID: subject.majorId,
        SubjectType: board.type,
        Semester: board.columnOrder.indexOf(targetColumnId) + 1,
        ProgramSemester: board.columnOrder.indexOf(targetColumnId) + 1,
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
        if (board.id !== targetBoardId) return board;
        const column = board.semesterColumn[targetColumnId];
        return {
          ...board,
          semesterColumn: {
            ...board.semesterColumn,
            [targetColumnId]: {
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

  // Add prerequisite update function
  const handleUpdatePrerequisites = (subjectId: string, prerequisites: SubjectModel[]) => {
    setState((prev) => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [subjectId]: {
          ...prev.subjects[subjectId],
          PrerequisiteSubjects: prerequisites,
        },
      },
    }));
  };

  const handleSave = () => {
    // TODO: Implement save logic
    console.log("Saving curriculum...", state);
  };

  const handleCancel = () => {
    // TODO: Implement cancel logic
    console.log("Cancelled save");
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

      <StepNavigation
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        nextStep={nextStep}
        prevStep={prevStep}
      />

      <SearchSubjectSection
        steps={steps}
        currentStep={currentStep}
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
        departmentId={Number(departmentId)}
        globalSelectedSubjects={globalSelectedSubjects}
        onSelect={handleSelectSubjects}
        onOpenGlobalSearch={handleOpenGlobalSearch}
      />

      <CurriculumBoard
        currentStepBoard={currentStepBoard}
        currentStep={steps[currentStep - 1]}
        subjects={state.subjects}
        onDragEnd={onDragEnd}
        onAddBoard={addBoard}
        onAddSemester={addSemester}
        onOpenSearchDialog={openSearchDialog}
        onRemoveSubject={removeSubjectFromSemesterColumn}
        onRemoveColumn={removeSemesterColumn}
        onRenameColumn={renameColumn}
        onUpdatePrerequisites={handleUpdatePrerequisites}
      />

      {currentStep === steps.length && <CurriculumSummary steps={steps} boards={state.boards} />}

      <div className="mt-8 flex justify-end">
        <SaveCurriculumDialog
          steps={steps}
          boards={state.boards}
          subjects={state.subjects}
          currentStep={currentStep}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
