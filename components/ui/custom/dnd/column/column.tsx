import React, { useEffect, useRef, useState } from "react";

import { Draggable, Droppable } from "@hello-pangea/dnd";
import styled from "styled-components";

import Task from "../task/task";

interface ColumnProps {
  column: { id: string; title: string; taskIds: string[] };
  tasks: { id: string; content: string }[];
  index: number;
  onAddTask: (columnId: string) => void;
}

const Container = styled.div`
  width: 220px;
  margin: 8px;
  border-radius: 2px;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  padding: 8px;
`;

const TaskList = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDraggingOver",
})<{ isDraggingOver: boolean }>`
  padding: 8px;
  background-color: ${(props) => (props.isDraggingOver ? "skyblue" : "white")};
  flex-grow: 1;
  min-height: 100px;
  transition: background-color 0.2s ease;
`;

export const Column: React.FC<ColumnProps> = ({ column, tasks, index, onAddTask }) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (columnRef.current) {
      setHeight(columnRef.current.clientHeight);
    }
  }, [tasks.length]); // update when tasks change

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
            <Title {...provided.dragHandleProps}>{column.title}</Title>
            <Droppable droppableId={column.id} type="task">
              {(provided, snapshot) => (
                <TaskList ref={provided.innerRef} {...provided.droppableProps} isDraggingOver={snapshot.isDraggingOver}>
                  {tasks.map((task, index) => (
                    <Task key={task.id} task={task} index={index} />
                  ))}
                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>
            <button onClick={() => onAddTask(column.id)}>Add Task</button>
          </Container>
        </div>
      )}
    </Draggable>
  );
};
