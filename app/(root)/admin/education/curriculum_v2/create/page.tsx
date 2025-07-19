"use client";

import React, { useMemo, useState } from "react";

import { convertToSimplified, CurriculumnSubjectModel } from "@/app/api/model/CurriculumnSubjectModel";
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
import { toast, Toaster } from "sonner";

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

  // Helper function to generate curriculum subject IDs in new format
  const generateCurriculumSubjectId = (subjectId: string): string => {
    return `subject-${subjectId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

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

  // Check if a subject is being used as a prerequisite by other subjects
  const isSubjectUsedAsPrerequisite = (subjectId: string): string[] => {
    const dependentSubjects: string[] = [];
    Object.values(state.subjects).forEach((subject) => {
      if (subject.PrerequisiteSubjects?.some((prereq) => prereq.id === subjectId)) {
        dependentSubjects.push(subject.SubjectName);
      }
    });
    return dependentSubjects;
  };

  // Remove a subject from a semester column in a board
  const removeSubjectFromSemesterColumn = (columnId: string, mappingId: string, boardId: string) => {
    try {
      const subjectToRemove = state.subjects[mappingId];
      if (!subjectToRemove) {
        toast.error("Subject not found in curriculum");
        return;
      }

      // Check if this subject is used as a prerequisite
      const dependentSubjects = isSubjectUsedAsPrerequisite(subjectToRemove.SubjectID);
      if (dependentSubjects.length > 0) {
        toast.error(
          `Cannot remove "${subjectToRemove.SubjectName}" because it's a prerequisite for: ${dependentSubjects.join(", ")}. Remove the prerequisite relationships first.`,
        );
        return;
      }

      setState((prev) => {
        const boards = prev.boards.map((board) => {
          if (board.id !== boardId) return board;
          const column = board.semesterColumn[columnId];
          if (!column) {
            toast.error("Column not found in board");
            return board;
          }

          const updatedSubjectIds = column.subjectIds.filter((id) => id !== mappingId);

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

        // Remove the subject from the subjects object
        const { [mappingId]: removedSubject, ...remainingSubjects } = prev.subjects;

        return { ...prev, boards, subjects: remainingSubjects };
      });

      toast.success(`Successfully removed "${subjectToRemove.SubjectName}" from curriculum`);
    } catch (error) {
      console.error("Error removing subject from semester column:", error);
      toast.error("Failed to remove subject from curriculum");
    }
  };

  // Get all globally selected subjects across all boards and columns
  const getAllGloballySelectedSubjects = (): SubjectModel[] => {
    const allSelectedSubjects: SubjectModel[] = [];

    console.log("=== Building global selected subjects list ===");
    console.log("Current state.subjects:", Object.keys(state.subjects));

    state.boards.forEach((board) => {
      Object.values(board.semesterColumn).forEach((column) => {
        column.subjectIds.forEach((mappingId) => {
          const subject = state.subjects[mappingId];
          if (subject) {
            const subjectForFiltering = {
              id: subject.SubjectID.toString(), // Ensure consistent string type for ID
              name: subject.SubjectName,
              credits: subject.TotalCredits,
              faculty_id: parseInt(curriculumInfo?.facultyId || "1"),
              gradingFormulaId: 0,
              description: "", // Add description field to match SubjectModel
            };
            allSelectedSubjects.push(subjectForFiltering);
            console.log(`Added subject to global list: ${subjectForFiltering.name} (ID: ${subjectForFiltering.id})`);
          }
        });
      });
    });

    console.log(
      "Final global selected subjects for filtering:",
      allSelectedSubjects.map((s) => ({ id: s.id, name: s.name })),
    );
    console.log("=== End building global selected subjects list ===");
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

    subjects.forEach((subject, index) => {
      // Use the new simplified ID format
      const uniqueMappingId = generateCurriculumSubjectId(subject.id.toString());
      const newSubject: CurriculumnSubjectModel = {
        SubjectID: subject.id.toString(), // Convert to string and keep the actual subject ID
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
      newSubjects[uniqueMappingId] = newSubject; // Use unique ID as mapping key
      newSubjectIds.push(uniqueMappingId); // Add unique ID to column
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

  // Add prerequisite update function with auto-add logic
  const handleUpdatePrerequisites = (
    subjectId: string,
    prerequisites: SubjectModel[],
    newSubjects: SubjectModel[] = [],
  ) => {
    console.log("=== handleUpdatePrerequisites called ===");
    console.log("subjectId:", subjectId);
    console.log("prerequisites:", prerequisites);
    console.log("newSubjects:", newSubjects);
    console.log("Current subjects in state:", Object.keys(state.subjects));

    // Find the target mapping ID first
    const targetMappingId = Object.keys(state.subjects).find((key) => state.subjects[key].SubjectID === subjectId);
    console.log("Found target mapping ID:", targetMappingId);

    if (!targetMappingId) {
      console.log("Subject not found for ID:", subjectId);
      toast.error("Subject not found in curriculum");
      return;
    }

    // Check which new prerequisites are not already in the curriculum
    const existingSubjectIds = new Set(Object.values(state.subjects).map((subject) => subject.SubjectID));
    const missingPrerequisites = newSubjects.filter((subject) => !existingSubjectIds.has(subject.id));

    console.log("Existing subject IDs:", Array.from(existingSubjectIds));
    console.log("Missing prerequisites:", missingPrerequisites);

    // If no new subjects to add, just update the current subject's prerequisites
    if (newSubjects.length === 0 || missingPrerequisites.length === 0) {
      console.log("No missing prerequisites, just updating subject prerequisites");
      setState((prev) => {
        const updatedSubject = {
          ...prev.subjects[targetMappingId],
          PrerequisiteSubjects: prerequisites,
          HasPrerequisite: prerequisites.length > 0,
        };

        console.log("Updating subject with prerequisites:", updatedSubject);

        return {
          ...prev,
          subjects: {
            ...prev.subjects,
            [targetMappingId]: updatedSubject,
          },
        };
      });

      if (newSubjects.length === 0) {
        toast.success("Prerequisites updated successfully");
      } else {
        toast.info("All selected prerequisites are already in curriculum");
      }
      return;
    }

    // Find the current subject by SubjectID instead of mapping ID
    const currentSubjectEntry = Object.entries(state.subjects).find(([_, subject]) => subject.SubjectID === subjectId);
    if (!currentSubjectEntry) {
      // Just update prerequisites if current subject not found
      const targetMappingId = Object.keys(state.subjects).find((key) => state.subjects[key].SubjectID === subjectId);
      if (targetMappingId) {
        setState((prev) => ({
          ...prev,
          subjects: {
            ...prev.subjects,
            [targetMappingId]: {
              ...prev.subjects[targetMappingId],
              PrerequisiteSubjects: prerequisites,
              HasPrerequisite: prerequisites.length > 0,
            },
          },
        }));
      }
      return;
    }

    const [currentMappingId, currentSubject] = currentSubjectEntry;
    // Find target semester for prerequisites (one semester before current)
    const currentSemester = currentSubject.Semester;
    const targetSemester = Math.max(1, currentSemester - 1);

    // Find the board that contains the current subject
    const currentBoard = state.boards.find((board) =>
      Object.values(board.semesterColumn).some((column) => column.subjectIds.includes(currentMappingId)),
    );

    if (!currentBoard) {
      // Just update prerequisites if board not found
      setState((prev) => ({
        ...prev,
        subjects: {
          ...prev.subjects,
          [currentMappingId]: {
            ...prev.subjects[currentMappingId],
            PrerequisiteSubjects: prerequisites,
            HasPrerequisite: prerequisites.length > 0,
          },
        },
      }));
      return;
    }

    // Find or create a column for the target semester
    let targetColumnId = Object.keys(currentBoard.semesterColumn).find(
      (columnId) => currentBoard.semesterColumn[columnId].semesterNumber === targetSemester,
    );

    // If no column exists for target semester, find the earliest available semester
    if (!targetColumnId) {
      const availableColumns = Object.entries(currentBoard.semesterColumn)
        .filter(([_, column]) => column.semesterNumber < currentSemester)
        .sort(([_, a], [__, b]) => a.semesterNumber - b.semesterNumber);

      if (availableColumns.length > 0) {
        targetColumnId = availableColumns[0][0];
      } else {
        // Create a new column for semester 1 if none exists
        targetColumnId = `semester-1-${currentBoard.id}`;
      }
    }

    // Auto-add missing prerequisites
    setState((prev) => {
      const newSubjects: { [key: string]: CurriculumnSubjectModel } = {};
      const addedSubjectIds: string[] = [];

      missingPrerequisites.forEach((subject) => {
        // Generate a unique mapping ID while keeping the actual SubjectID
        const uniqueMappingId = `curri-subject-${subject.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const targetColumn = prev.boards.find((b) => b.id === currentBoard.id)?.semesterColumn[targetColumnId];
        const semesterNumber = targetColumn?.semesterNumber || 1;

        const newSubject: CurriculumnSubjectModel = {
          SubjectID: subject.id, // Keep the actual subject ID
          SubjectName: subject.name,
          SubjectName_EN: subject.name,
          TotalCredits: subject.credits,
          MajorID: curriculumInfo?.majorId || "",
          Semester: semesterNumber,
          SemesterColumnId: semesterNumber,
          ProgramSemester: semesterNumber,
          IsRequired: true,
          AcademicYear: parseInt(curriculumInfo?.academicYear || "2024"),
          AcademicYearID: parseInt(curriculumInfo?.academicYear || "2024"),
          LectureCredits: subject.credits,
          PrerequisiteType: 0,
          HasPrerequisite: false,
          TotalPrerequisiteTypes: 0,
          SemesterName: targetColumn?.title || `Semester ${semesterNumber}`,
          PrerequisiteSubjects: [],
        };
        newSubjects[uniqueMappingId] = newSubject; // Use unique ID as mapping key
        addedSubjectIds.push(uniqueMappingId); // Add unique ID to column
      });

      // Update boards to include new subjects
      const updatedBoards = prev.boards.map((board) => {
        if (board.id !== currentBoard.id) return board;

        // Ensure target column exists
        const updatedSemesterColumn = { ...board.semesterColumn };
        const updatedColumnOrder = [...board.columnOrder];

        if (!updatedSemesterColumn[targetColumnId]) {
          const semesterNumber = targetSemester;
          updatedSemesterColumn[targetColumnId] = {
            id: targetColumnId,
            title: board.type === "core" ? `Semester ${semesterNumber}` : `${board.name} ${semesterNumber}`,
            subjectIds: [],
            curriculumTypeId: board.curriculumTypeId,
            semesterNumber,
          };
          updatedColumnOrder.push(targetColumnId);
          updatedColumnOrder.sort((a, b) => {
            const aNum = parseInt(a.split("-")[1]) || 0;
            const bNum = parseInt(b.split("-")[1]) || 0;
            return aNum - bNum;
          });
        }

        // Add new subjects to target column
        updatedSemesterColumn[targetColumnId] = {
          ...updatedSemesterColumn[targetColumnId],
          subjectIds: [...updatedSemesterColumn[targetColumnId].subjectIds, ...addedSubjectIds],
        };

        return {
          ...board,
          semesterColumn: updatedSemesterColumn,
          columnOrder: updatedColumnOrder,
        };
      });

      return {
        ...prev,
        boards: updatedBoards,
        subjects: {
          ...prev.subjects,
          ...newSubjects,
          [currentMappingId]: {
            ...prev.subjects[currentMappingId],
            PrerequisiteSubjects: prerequisites,
            HasPrerequisite: prerequisites.length > 0,
          },
        },
      };
    });

    // Show user notification about auto-added subjects
    const subjectNames = missingPrerequisites.map((s) => s.name).join(", ");
    toast.success(
      `Added ${missingPrerequisites.length} prerequisite subject(s) to semester ${targetSemester}: ${subjectNames}`,
      { duration: 5000 },
    );
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

  const handleSave = () => {
    setShowSaveDialog(true);
  };

  const handleCancel = () => {
    router.push("/admin/education/curriculum");
  };

  const handleActualSave = () => {
    // Generate simplified format for export
    console.log("=== DEBUGGING PREREQUISITE CONVERSION ===");
    console.log("Original subjects before conversion:");
    Object.entries(state.subjects).forEach(([mappingId, subject]) => {
      if (subject.PrerequisiteSubjects && subject.PrerequisiteSubjects.length > 0) {
        console.log(
          `Subject ${subject.SubjectName} (${subject.SubjectID}) has prerequisites:`,
          subject.PrerequisiteSubjects.map((p) => `${p.name} (ID: ${p.id})`),
        );
      }
    });

    const simplifiedSubjects = convertToSimplified(state.subjects, state.boards);

    // Current format - complete data structure
    const currentFormat = {
      curriculumInfo,
      boards: state.boards,
      subjects: state.subjects,
    };

    // Simplified format - new structure requested by user
    const simplifiedFormat = {
      curriculumInfo,
      boards: state.boards,
      subjects: simplifiedSubjects,
    };

    // TODO: Implement actual save logic
    console.log("Saving curriculum (current format):", currentFormat);
    console.log("Simplified format:", simplifiedFormat);

    // Show comparison in a more readable way
    console.log("\n=== COMPARISON ===");
    console.log("BEFORE (Current complex format):");
    Object.entries(state.subjects)
      .slice(0, 2) // Show first 2 subjects for better debugging
      .forEach(([id, subject]) => {
        console.log(`${id}:`, {
          SubjectID: subject.SubjectID,
          SubjectName: subject.SubjectName,
          TotalCredits: subject.TotalCredits,
          Semester: subject.Semester,
          SemesterColumnId: subject.SemesterColumnId,
          IsRequired: subject.IsRequired,
          PrerequisiteSubjects: subject.PrerequisiteSubjects,
          // ... and many more fields
        });
      });

    console.log("\nAFTER (New simplified format):");
    Object.entries(simplifiedSubjects)
      .slice(0, 2) // Show first 2 subjects for better debugging
      .forEach(([id, subject]) => {
        console.log(`${id}:`, subject);
      });

    // Show detailed prerequisite mapping
    console.log("\n=== PREREQUISITE MAPPING DETAILS ===");
    Object.entries(simplifiedSubjects).forEach(([newId, simplified]) => {
      if (simplified.PrerequisiteSubjects && simplified.PrerequisiteSubjects.length > 0) {
        console.log(
          `Simplified subject ${simplified.SubjectID} has prerequisite IDs: [${simplified.PrerequisiteSubjects.join(", ")}]`,
        );
      }
    });

    toast.success("Curriculum saved successfully! Check console for both formats and prerequisite mapping details.");
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
          subjects={state.subjects} // Pass the full state.subjects
          onDragEnd={onDragEnd}
          onAddSemester={addSemester}
          onOpenSearchDialog={openSearchDialog}
          onRemoveSubject={removeSubjectFromSemesterColumn}
          onRemoveColumn={removeSemesterColumn}
          onRenameColumn={renameColumn}
          onUpdatePrerequisites={handleUpdatePrerequisites}
          existingSubjectIds={new Set(Object.values(state.subjects).map((subject) => subject.SubjectID))}
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
      <Toaster />
    </div>
  );
}
