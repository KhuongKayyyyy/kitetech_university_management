import React from 'react';
import styled from 'styled-components';
import { Draggable } from '@hello-pangea/dnd';

interface ContainerProps {
    isDragging: boolean;
}

const Container = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== 'isDragging', // Prevent 'isDragging' from being passed to the DOM
}) <ContainerProps>`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  background-color: ${(props) => (props.isDragging ? 'lightgreen' : 'white')};
  margin-bottom: 8px;
  display: flex;
`;

interface TaskProps {
    task: { id: string; content: string };
    index: number;
}

const Handle = styled.div`
    width: 20px;
    height: 20px;
    background-color: orange;
    border-radius: 4px;
    margin-right: 8px;
`;

export default class Task extends React.Component<TaskProps> {
    render() {
        return (
            <Draggable
                draggableId={this.props.task.id}
                index={this.props.index}>
                {(provided, snapshot) => (
                    <Container
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        // pass the drag handle props to the container to allow dragging
                        // {...provided.dragHandleProps}
                        tabIndex={0} // Make the div keyboard focusable
                        isDragging={snapshot.isDragging}  // Only used for styling
                    >
                        <Handle {...provided.dragHandleProps}></Handle>
                        {this.props.task.content}
                    </Container>
                )}
            </Draggable>
        );
    }
}
