import React, { useEffect, useState } from "react";

import { CurriculumnSubject } from "@/app/api/model/CurriculumnSubject";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { CirclePlus, Edit2, GripVertical, Save, Trash } from "lucide-react";
import styled from "styled-components";

import SubjectCurriItem from "../task/SubjectCurriItem";

interface SemesterColumnProps {
  column: { id: string; title: string; subjectIds: string[] };
  subjects: CurriculumnSubject[];
  index: number;
  onAddSubject: (columnId: string) => void;
  onRemoveSubject: (columnId: string, subjectId: string) => void;
  onRemoveColumn: (columnId: string) => void;
  onRenameColumn?: (columnId: string, newTitle: string) => void;
}

const Container = styled.div`
  width: 320px;
  margin: 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
    border-color: #cbd5e1;
  }
`;

const Header = styled.div`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
    pointer-events: none;
  }
`;

const Title = styled.h3`
  padding: 16px 20px;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  position: relative;
  z-index: 1;
`;

const DragHandle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  cursor: grab;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }

  &:active {
    cursor: grabbing;
  }
`;

const TitleContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
`;

const SubjectCount = styled.span`
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  &.edit-btn:hover {
    background: rgba(59, 130, 246, 0.3);
  }

  &.remove-btn:hover {
    background: rgba(239, 68, 68, 0.3);
  }

  &.save-btn:hover {
    background: rgba(34, 197, 94, 0.3);
  }
`;

const SubjectList = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDraggingOver",
})<{ isDraggingOver: boolean }>`
  padding: 20px;
  background-color: ${(props) => (props.isDraggingOver ? "#f0f9ff" : "white")};
  flex-grow: 1;
  min-height: 200px;
  transition: all 0.3s ease;
  position: relative;

  ${(props) =>
    props.isDraggingOver &&
    `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%);
      border-radius: 8px;
      border: 2px dashed #60a5fa;
      pointer-events: none;
    }
  `}
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: none;
  border-top: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);

    &::before {
      left: 100%;
    }
  }
`;

const TitleInput = styled.input`
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 8px 12px;
  margin: 0;
  outline: none;
  flex: 1;
  backdrop-filter: blur(4px);

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    border-color: rgba(255, 255, 255, 0.5);
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #94a3b8;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.5;

  svg {
    opacity: 0.3;
    margin-bottom: 12px;
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
            <Header>
              <Title>
                <DragHandle {...provided.dragHandleProps}>
                  <GripVertical size={16} />
                </DragHandle>

                <TitleContent>
                  {isEditing ? (
                    <TitleInput
                      value={titleValue}
                      onChange={handleTitleChange}
                      onKeyDown={handleKeyDown}
                      onBlur={handleSave}
                      autoFocus
                      placeholder="Enter semester name..."
                    />
                  ) : (
                    <span>{column.title}</span>
                  )}
                </TitleContent>

                <SubjectCount>
                  {subjects.length} subject{subjects.length !== 1 ? "s" : ""}
                </SubjectCount>

                <ActionButtons>
                  {isEditing ? (
                    <ActionButton onClick={handleSave} className="save-btn">
                      <Save size={14} />
                    </ActionButton>
                  ) : (
                    <ActionButton onClick={() => setIsEditing(true)} className="edit-btn">
                      <Edit2 size={14} />
                    </ActionButton>
                  )}
                  <ActionButton onClick={() => onRemoveColumn(column.id)} className="remove-btn">
                    <Trash size={14} />
                  </ActionButton>
                </ActionButtons>
              </Title>
            </Header>

            <Droppable droppableId={column.id} type="task">
              {(provided, snapshot) => (
                <SubjectList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {subjects.length === 0 ? (
                    <EmptyState>
                      <CirclePlus size={32} />
                      <div>
                        <div className="font-medium">No subjects yet</div>
                        <div>Click "Add Subject" to get started</div>
                      </div>
                    </EmptyState>
                  ) : (
                    subjects.map((subject, index) => (
                      <div key={subject.SubjectID} style={{ width: "100%", marginBottom: "12px" }}>
                        <SubjectCurriItem
                          subject={subject}
                          index={index}
                          onRemove={() => onRemoveSubject(column.id, subject.SubjectID)}
                        />
                      </div>
                    ))
                  )}
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
