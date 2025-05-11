"use client";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import React, { useState } from "react";
import initialData from "@/app/api/initalData";
import { Column } from "../../../../../components/ui/custom/dnd/column/column";
import styled from "styled-components";
const Container = styled.div`
  display: flex;
  /* prevent columns from shrinking below their content width */
  flex-wrap: nowrap;
  /* enable horizontal scrolling when content overflows */
  overflow-x: auto;
  /* optional: if you want vertical scrolling too */
  /* overflow-y: auto; */

  /* (optional) polish the scrollbar for WebKit browsers */
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.2);
    border-radius: 4px;
  }
margin-right: 8px;
`;

const AddColumnButton = styled.button`
  padding: 8px 12px;
  margin: 8px;
  border-radius: 4px;
  border: 1px solid #bbb;
  background-color: #f0f0f0;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #d6d6d6;
    border-color: #999;
  }

  &:active {
    background-color: #c0c0c0;
  }
`;
const Page = () => {
    const [state, setState] = useState<{
        tasks: { [key: string]: { id: string; content: string } };
        columns: { [key: string]: { id: string; title: string; taskIds: string[] } };
        columnOrder: string[];
    }>(initialData);
    // const onDragStart = () => {
    //     document.body.style.color = "orange";
    //     document.body.style.transition = "background-color 0.2s ease";
    // }
    // const onDragUpdate = (update: { destination: { index: number } | null }) => {
    //     const { destination } = update;
    //     const opacity = destination ? destination.index / Object.keys(state.tasks).length : 0;
    //     document.body.style.backgroundColor = `rgba(153, 101, 21, ${opacity})`;
    // };
    const onDragEnd = (result: { destination: any; source: any; draggableId: string, type: any }) => {
        // document.body.style.color = "inherit";
        // document.body.style.backgroundColor = "inherit";

        const { destination, source, draggableId, type } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        if (type === "column") {
            const newColumnOrder = Array.from(state.columnOrder);
            newColumnOrder.splice(source.index, 1);
            newColumnOrder.splice(destination.index, 0, draggableId);

            const newState = {
                ...state,
                columnOrder: newColumnOrder,
            };

            setState(newState);
            return;
        }

        const startColumn = state.columns[source.droppableId];
        const finishColumn = state.columns[destination.droppableId];

        if (startColumn === finishColumn) {
            const newTaskIds = Array.from(startColumn.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...startColumn,
                taskIds: newTaskIds,
            };

            const newState = {
                ...state,
                columns: {
                    ...state.columns,
                    [newColumn.id]: newColumn,
                },
            };

            setState(newState);
            return;
        }

        const startTaskIds = Array.from(startColumn.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStartColumn = {
            ...startColumn,
            taskIds: startTaskIds,
        };
        const finishTaskIds = Array.from(finishColumn.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinishColumn = {
            ...finishColumn,
            taskIds: finishTaskIds,
        };
        const newState = {
            ...state,
            columns: {
                ...state.columns,
                [newStartColumn.id]: newStartColumn,
                [newFinishColumn.id]: newFinishColumn,
            },
        };
        setState(newState);
    };

    // Inside Page component
    const addColumn = () => {
        const newColumnId = `column-${Date.now()}`;
        const newColumn = {
            id: newColumnId,
            title: `New Column`,
            taskIds: [],
        };

        setState(prev => ({
            ...prev,
            columns: {
                ...prev.columns,
                [newColumnId]: newColumn,
            },
            columnOrder: [...prev.columnOrder, newColumnId],
        }));
    };

    const addTaskToColumn = (columnId: string) => {
        const newTaskId = `task-${Date.now()}`;
        const newTask = {
            id: newTaskId,
            content: "New Task",
        };

        const column = state.columns[columnId];
        const updatedColumn = {
            ...column,
            taskIds: [...column.taskIds, newTaskId],
        };

        setState(prev => ({
            ...prev,
            tasks: {
                ...prev.tasks,
                [newTaskId]: newTask,
            },
            columns: {
                ...prev.columns,
                [columnId]: updatedColumn,
            },
        }));
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-columns" direction="horizontal" type="column">
                {(provided) => (
                    <Container {...provided.droppableProps} ref={provided.innerRef}>
                        {state.columnOrder.map((columnId: string, index) => {
                            const column = state.columns[columnId];
                            const tasks = column.taskIds.map(taskId => state.tasks[taskId]);
                            return (
                                <Column
                                    key={column.id}
                                    column={column}
                                    tasks={tasks}
                                    index={index}
                                    onAddTask={addTaskToColumn}
                                />
                            );
                        })}
                        {provided.placeholder}

                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <AddColumnButton onClick={addColumn}>
                                ➕ Add Column
                            </AddColumnButton>
                        </div>
                    </Container>
                )}
            </Droppable>
        </DragDropContext>
    );

};

export default Page;
