"use client";

import React, { useMemo, useState } from "react";

import { CurriculumnSubjectModel } from "@/app/api/model/CurriculumnSubjectModel";
import { SubjectModel } from "@/app/api/model/model";
import { Button } from "@/components/ui/button";
import CreateCurriculumDialog, {
  CurriculumBoardType,
  CurriculumFormData,
} from "@/components/ui/custom/education/curriculum_v2/CreateCurriculumDialog";
import CurriculumBoardV2 from "@/components/ui/custom/education/curriculum_v2/CurriculumBoardV2";
import CurriculumSummaryV2 from "@/components/ui/custom/education/curriculum_v2/CurriculumSummaryV2";
import SaveCurriculumDialogV2 from "@/components/ui/custom/education/curriculum_v2/SaveCurriculumDialogV2";
import SearchSubjectSectionV2 from "@/components/ui/custom/education/curriculum_v2/SearchSubjectSectionV2";
import StepNavigationV2 from "@/components/ui/custom/education/curriculum_v2/StepNavigationV2";
import { useAcademicYears } from "@/hooks/useAcademicYear";
import { useDepartments } from "@/hooks/useDeparment";
import { useMajors } from "@/hooks/useMajor";
import { FileInput, FolderPlus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Board = {
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
};

type CurriculumInfo = {
  id: string;
  name: string;
  description: string;
  academicYear: string;
  facultyId: string;
  majorId: string;
  totalCredits: number;
  createdAt: string;
};

export default function CreateCurriculumV2Page() {
  const router = useRouter();
  const { departments } = useDepartments();
  const { majors } = useMajors();
  const { academicYears } = useAcademicYears();

  // Memoize the mapped arrays to prevent infinite re-renders
  const facultiesOptions = useMemo(() => {
    return departments.map((dept) => ({ id: dept.id.toString(), name: dept.name }));
  }, [departments]);

  const majorsOptions = useMemo(() => {
    return majors.map((major) => ({
      id: major.id.toString(),
      name: major.name,
      facultyId: major.faculty?.id.toString() || "",
    }));
  }, [majors]);

  const academicYearsOptions = useMemo(() => {
    return academicYears; // Pass the actual AcademicYearModel objects
  }, [academicYears]);

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Curriculum data
  const [curriculumInfo, setCurriculumInfo] = useState<CurriculumInfo | null>(null);
  const [selectedBoardTypes, setSelectedBoardTypes] = useState<CurriculumBoardType[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Search and subject management
  const [openSearch, setOpenSearch] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null);
  const [targetBoardId, setTargetBoardId] = useState<string | null>(null);
  const [globalSelectedSubjects, setGlobalSelectedSubjects] = useState<SubjectModel[]>([]);

  // State for boards and subjects
  const [state, setState] = useState<{
    boards: Board[];
    subjects: { [key: string]: CurriculumnSubjectModel };
  }>({
    boards: [],
    subjects: {},
  });

  // Handle initial curriculum creation
  const handleCreateCurriculum = async (data: CurriculumFormData, boardTypes: CurriculumBoardType[]) => {
    try {
      // Create curriculum info
      const curriculumId = `curriculum-${Date.now()}`;
      const newCurriculumInfo: CurriculumInfo = {
        id: curriculumId,
        name: data.name,
        description: data.description,
        academicYear: data.academicYear,
        facultyId: data.facultyId,
        majorId: data.majorId,
        totalCredits: data.totalCredits,
        createdAt: new Date().toISOString(),
      };

      setCurriculumInfo(newCurriculumInfo);
      setSelectedBoardTypes(boardTypes);

      // Create initial boards based on selected types
      const initialBoards: Board[] = boardTypes.map((boardType, index) => {
        const boardId = `board-${boardType.type}-${Date.now()}-${index}`;
        const curriculumTypeId = `curriculum-type-${boardType.type}-${Date.now()}`;

        // Create default semesters for each board
        const defaultSemesters: {
          [key: string]: {
            id: string;
            title: string;
            subjectIds: string[];
            curriculumTypeId: string;
            semesterNumber: number;
          };
        } = {};
        const columnOrder: string[] = [];

        for (let i = 1; i <= boardType.defaultSemesters; i++) {
          const columnId = `semester-${i}-${boardId}`;
          defaultSemesters[columnId] = {
            id: columnId,
            title: boardType.type === "core" ? `Semester ${i}` : `${boardType.name} ${i}`,
            subjectIds: [],
            curriculumTypeId,
            semesterNumber: i,
          };
          columnOrder.push(columnId);
        }

        return {
          id: boardId,
          name: boardType.name,
          type: boardType.type,
          curriculumId,
          curriculumTypeId,
          columnOrder,
          semesterColumn: defaultSemesters,
        };
      });

      setState((prev) => ({
        ...prev,
        boards: initialBoards,
      }));

      setShowCreateDialog(false);
      toast.success("Curriculum structure created successfully!");
    } catch (error) {
      console.error("Failed to create curriculum:", error);
      throw error;
    }
  };

  // Add a new semester to a board
  const addSemester = (boardId: string) => {
    setState((prev) => {
      const boards = prev.boards.map((board) => {
        if (board.id !== boardId) return board;
        const semesterNumber = board.columnOrder.length + 1;
        const newColumnId = `semester-${semesterNumber}-${boardId}`;
        return {
          ...board,
          semesterColumn: {
            ...board.semesterColumn,
            [newColumnId]: {
              id: newColumnId,
              title: board.type === "core" ? `Semester ${semesterNumber}` : `${board.name} ${semesterNumber}`,
              subjectIds: [],
              curriculumTypeId: board.curriculumTypeId,
              semesterNumber,
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
        const { [columnId]: _removed, ...remainingColumns } = board.semesterColumn;
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
              name: subject.SubjectName,
              credits: subject.TotalCredits,
              faculty_id: parseInt(curriculumInfo?.facultyId || "1"),
              gradingFormulaId: 0,
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

    const column = board.semesterColumn[targetColumnId];
    if (!column) return;

    const newSubjects: { [key: string]: CurriculumnSubjectModel } = {};
    const newSubjectIds: string[] = [];

    subjects.forEach((subject) => {
      const newSubjectId = subject.id;
      const newSubject: CurriculumnSubjectModel = {
        SubjectID: newSubjectId,
        SubjectName: subject.name,
        SubjectName_EN: subject.name,
        TotalCredits: subject.credits,
        MajorID: curriculumInfo?.majorId || "",
        Semester: column.semesterNumber,
        SemesterColumnId: parseInt(column.id.split("-")[1]) || 1, // Extract semester number from column ID
        ProgramSemester: column.semesterNumber,
        IsRequired: true,
        AcademicYear: parseInt(curriculumInfo?.academicYear || "2024"),
        AcademicYearID: parseInt(curriculumInfo?.academicYear || "2024"),
        LectureCredits: subject.credits,
        PrerequisiteType: 0,
        HasPrerequisite: false,
        TotalPrerequisiteTypes: 0,
        SemesterName: column.title,
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
  const onDragEnd = (
    result: {
      destination: { droppableId: string; index: number } | null;
      source: { droppableId: string; index: number };
      draggableId: string;
      type: string;
    },
    boardId: string,
  ) => {
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
        const updatedSubject = {
          ...subject,
          Semester: destColumn.semesterNumber,
          SemesterColumnId: parseInt(destColumn.id.split("-")[1]) || destColumn.semesterNumber,
          ProgramSemester: destColumn.semesterNumber,
          SemesterName: destColumn.title,
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
    if (currentStep < selectedBoardTypes.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Get current step board
  const currentStepBoard = state.boards.find((board) => board.type === selectedBoardTypes[currentStep - 1]?.type);
  const currentStepType = selectedBoardTypes[currentStep - 1];

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
    setShowSaveDialog(true);
  };

  const handleCancel = () => {
    router.push("/admin/education/curriculum");
  };

  const handleActualSave = () => {
    // TODO: Implement actual save logic
    console.log("Saving curriculum...", {
      curriculumInfo,
      boards: state.boards,
      subjects: state.subjects,
    });
    toast.success("Curriculum saved successfully!");
    setShowSaveDialog(false);
    router.push("/admin/education/curriculum");
  };

  if (!curriculumInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create New Curriculum</h2>
          <p className="text-gray-600">Set up your curriculum structure to get started.</p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Curriculum
          </Button>
        </div>

        <CreateCurriculumDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={handleCreateCurriculum}
          faculties={facultiesOptions}
          majors={majorsOptions}
          academicYears={academicYearsOptions}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileInput className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{curriculumInfo.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-2">
                    <FolderPlus className="w-4 h-4" />
                    <span>Academic Year {curriculumInfo.academicYear}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileInput className="w-4 h-4" />
                    <span>{curriculumInfo.totalCredits} Credits</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Curriculum</Button>
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <StepNavigationV2
          steps={selectedBoardTypes}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          nextStep={nextStep}
          prevStep={prevStep}
        />

        {/* Search Subject Section */}
        <SearchSubjectSectionV2
          steps={selectedBoardTypes}
          currentStep={currentStep}
          openSearch={openSearch}
          setOpenSearch={setOpenSearch}
          departmentId={parseInt(curriculumInfo.facultyId)}
          globalSelectedSubjects={globalSelectedSubjects}
          onSelect={handleSelectSubjects}
          onOpenGlobalSearch={handleOpenGlobalSearch}
        />

        {/* Curriculum Board */}
        <CurriculumBoardV2
          currentStepBoard={currentStepBoard}
          currentStep={currentStepType}
          subjects={state.subjects}
          onDragEnd={onDragEnd}
          onAddSemester={addSemester}
          onOpenSearchDialog={openSearchDialog}
          onRemoveSubject={removeSubjectFromSemesterColumn}
          onRemoveColumn={removeSemesterColumn}
          onRenameColumn={renameColumn}
          onUpdatePrerequisites={handleUpdatePrerequisites}
        />

        {/* Summary Section */}
        {currentStep === selectedBoardTypes.length && (
          <CurriculumSummaryV2
            steps={selectedBoardTypes}
            boards={state.boards}
            subjects={state.subjects}
            curriculumInfo={curriculumInfo}
          />
        )}

        {/* Dialogs */}
        <CreateCurriculumDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={handleCreateCurriculum}
          faculties={facultiesOptions}
          majors={majorsOptions}
          academicYears={academicYearsOptions}
        />

        <SaveCurriculumDialogV2
          open={showSaveDialog}
          onOpenChange={setShowSaveDialog}
          curriculumInfo={curriculumInfo}
          boards={state.boards}
          subjects={state.subjects}
          onSave={handleActualSave}
          onCancel={() => setShowSaveDialog(false)}
        />
      </div>
    </div>
  );
}
