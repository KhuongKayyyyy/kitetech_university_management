import React from "react";

import { Draggable } from "@hello-pangea/dnd";
import { Trash } from "lucide-react";
import styled from "styled-components";

interface ContainerProps {
  isDragging: boolean;
}

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s ease;
  margin-left: 8px;

  &:hover {
    color: #ff4d4f;
  }
`;

const Container = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDragging" && prop !== "isGhost",
})<ContainerProps & { isGhost?: boolean }>`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  background-color: ${(props) => (props.isDragging ? "#e9f5e9" : "white")};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  opacity: ${(props) => (props.isGhost ? 0.5 : 1)};
  cursor: grab;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }
`;

interface SubjectProps {
  task: {
    id: string;
    content: string;
    credit?: number;
  };
  index: number;
  isGhost?: boolean;
  onRemove?: () => void;
}

const Content = styled.div`
  flex: 1;
`;

const SubjectName = styled.div`
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 4px;
`;

const SubjectMeta = styled.div`
  font-size: 0.875rem;
  color: #666;
  display: flex;
  gap: 12px;
`;

export default class SubjectCurriItem extends React.Component<SubjectProps> {
  render() {
    const { id, content, credit = 3 } = this.props.task;
    const subjectId = id.split("-")[1]; // Extract subject ID if it exists

    return (
      <Draggable draggableId={id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            tabIndex={0}
            isDragging={snapshot.isDragging}
            isGhost={this.props.isGhost}
          >
            <Content>
              <SubjectName>{content}</SubjectName>
              <SubjectMeta>
                <span>ID: {subjectId || id}</span>
                <span>Credits: {credit}</span>
              </SubjectMeta>
            </Content>
            {this.props.onRemove && (
              <RemoveButton onClick={this.props.onRemove}>
                <Trash size={16} />
              </RemoveButton>
            )}
          </Container>
        )}
      </Draggable>
    );
  }
}
