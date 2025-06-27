import React from "react";

import { Draggable } from "@hello-pangea/dnd";
import { BookOpen, Clock, GripVertical, Trash } from "lucide-react";
import styled from "styled-components";

interface ContainerProps {
  isDragging: boolean;
}

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;

  &:hover {
    color: #ef4444;
    background-color: #fef2f2;
    opacity: 1;
    transform: scale(1.05);
  }
`;

const DragHandle = styled.div`
  color: #cbd5e1;
  margin-right: 12px;
  cursor: grab;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;

  &:hover {
    color: #64748b;
  }

  &:active {
    cursor: grabbing;
  }
`;

const Container = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isDragging" && prop !== "isGhost",
})<ContainerProps & { isGhost?: boolean }>`
  border: 1px solid ${(props) => (props.isDragging ? "#22c55e" : "#e2e8f0")};
  border-radius: 12px;
  padding: 16px;
  background-color: ${(props) =>
    props.isDragging
      ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
      : "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)"};
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  box-shadow: ${(props) =>
    props.isDragging
      ? "0 8px 25px rgba(34, 197, 94, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)"
      : "0 2px 8px rgba(0, 0, 0, 0.06)"};
  opacity: ${(props) => (props.isGhost ? 0.4 : 1)};
  cursor: grab;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${(props) =>
      props.isDragging ? "linear-gradient(90deg, #22c55e, #16a34a)" : "linear-gradient(90deg, #3b82f6, #1d4ed8)"};
    opacity: ${(props) => (props.isDragging ? 1 : 0)};
    transition: opacity 0.3s ease;
  }

  &:hover {
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.1),
      0 2px 4px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
    border-color: #cbd5e1;

    &::before {
      opacity: 0.6;
    }
  }

  &:active {
    cursor: grabbing;
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
  min-width: 0;
`;

const SubjectName = styled.div`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  font-size: 15px;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SubjectIcon = styled.div`
  color: #3b82f6;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const SubjectMeta = styled.div`
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 16px;
  font-weight: 500;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
`;

const CreditBadge = styled.div`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
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
            <DragHandle>
              <GripVertical size={16} />
            </DragHandle>
            <Content>
              <SubjectName>
                <SubjectIcon>
                  <BookOpen size={16} />
                </SubjectIcon>
                {content}
              </SubjectName>
              <SubjectMeta>
                <MetaItem>
                  <span>ID: {subjectId || id}</span>
                </MetaItem>
                <CreditBadge>
                  <Clock size={12} />
                  <span>{credit} Credits</span>
                </CreditBadge>
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
