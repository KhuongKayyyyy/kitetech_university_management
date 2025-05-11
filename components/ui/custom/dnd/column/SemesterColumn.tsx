import React, { useEffect, useState } from "react";

import { Draggable, Droppable } from "@hello-pangea/dnd";
import { CirclePlus, Edit2, Save, Trash } from "lucide-react";
import styled from "styled-components";

import SubjectCurriItem from "../task/SubjectCurriItem";

interface SemesterColumnProps {
  column: { id: string; title: string; subjectIds: string[] };
  subjects: { id: string; content: string }[];
  index: number;
  onAddSubject: (columnId: string) => void;
  onRemoveSubject: (columnId: string, subjectId: string) => void;
  onRemoveColumn: (columnId: string) => void;
  onRenameColumn?: (columnId: string, newTitle: string) => void;
}

const Container = styled.div`
  width: 280px;
  margin: 12px;
  border-radius: 8px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const Title = styled.h3`
  padding: 12px 16px;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SubjectList = styled.div`
  padding: 12px;
  background-color: white;
  flex-grow: 1;
  min-height: 150px;
  transition: background-color 0.2s ease;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 8px;
  background-color: transparent;
  border: none;
  border-top: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
    color: #111827;
  }

  svg {
    margin-right: 6px;
  }
`;

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s ease;
  margin-left: auto;

  &:hover {
    color: #ff4d4f;
  }
`;

const TitleInput = styled.input`
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
  font-size: 1rem;
  font-weight: 600;
  padding: 0;
  margin: 0;
  outline: none;
  width: 100%;

  &:focus {
    border-bottom: 1px solid #6366f1;
  }
`;

export const SemesterColumn: React.FC<SemesterColumnProps> = ({
  column,
  subjects,
  index,
  onAddSubject,
  onRemoveSubject,
  onRemoveColumn,
  onRenameColumn,
}) => {
  const columnRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [titleValue, setTitleValue] = useState(column.title);

  useEffect(() => {
    if (columnRef.current) {
      setHeight(columnRef.current.clientHeight);
    }
  }, [subjects.length]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };

  const handleSave = () => {
    if (titleValue.trim() !== "" && onRenameColumn) {
      onRenameColumn(column.id, titleValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setTitleValue(column.title);
      setIsEditing(false);
    }
  };

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={(el) => {
            columnRef.current = el;
            provided.innerRef(el);
          }}
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            height: snapshot.isDragging && height ? `${height}px` : "auto",
          }}
        >
          <Container>
            <Title {...provided.dragHandleProps}>
              {isEditing ? (
                <>
                  <TitleInput
                    value={titleValue}
                    onChange={handleTitleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleSave}
                    autoFocus
                  />
                  <button onClick={handleSave}>
                    <Save size={16} className="text-green-500" />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 w-full">
                    <span>{column.title}</span>
                    <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-gray-600">
                      <Edit2 size={14} />
                    </button>
                  </div>
                </>
              )}
              <span className="text-sm text-gray-500 ml-2">({subjects.length} subjects)</span>
              <RemoveButton onClick={() => onRemoveColumn(column.id)}>
                <Trash size={16} />
              </RemoveButton>
            </Title>
            <Droppable droppableId={column.id} type="task">
              {(provided) => (
                <SubjectList ref={provided.innerRef} {...provided.droppableProps}>
                  {subjects.map((subject, index) => (
                    <div key={subject.id} style={{ width: "100%" }}>
                      <SubjectCurriItem
                        task={subject}
                        index={index}
                        onRemove={() => onRemoveSubject(column.id, subject.id)}
                      />
                    </div>
                  ))}
                  {provided.placeholder}
                </SubjectList>
              )}
            </Droppable>
            <AddButton onClick={() => onAddSubject(column.id)}>
              <CirclePlus size={16} />
              Add Subject
            </AddButton>
          </Container>
        </div>
      )}
    </Draggable>
  );
};
