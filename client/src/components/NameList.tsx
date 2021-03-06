import React, { useCallback, useMemo, useRef } from "react";
import styled from "styled-components";
import { Wheel } from "./types";
import AutosizeInput from "react-input-autosize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import TextareaAutosize from "react-textarea-autosize";

interface NameListProps {
  wheel: Wheel;
  onChange: (id: string, label: string) => void;
  onDelete: (id: string) => void;
  onCreate: (label: string) => void;
  onSelect: () => void;
  onDeleteWheel: () => void;
  canDeleteWheel: boolean;
  onResetWheel: () => void;
  onUpdateWheel: (label: string) => void;
}

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #eee;
  min-width: 15rem;
  border-radius: 0.5rem;
  background-color: #eee;
`;

const ListTitleContainer = styled.div`
  margin: 0.5rem;
`;

const StyledButton = styled(({ onClick, ...props }) => (
  <button
    {...props}
    onClick={(e) => {
      e.stopPropagation();
      onClick && onClick();
    }}
  />
))`
  border: none;
  background-color: transparent;
  color: #777;
  :hover:not(:disabled) {
    color: black;
  }
  outline: none;
`;

const WheelNameInput = styled<any>(AutosizeInput)`
  display: block;
  margin: 0;
  padding: 0.3rem 0.5rem;
  font-size: 10pt;
  font-family: sans-serif;
  border: 2px solid transparent;
  background-color: white;
  border-radius: 0.5rem;
  :focus-within {
    border: 2px solid #777;
  }
  input {
    font-size: 16pt;
    font-weight: bold;
    outline: none;
    padding: 0;
    border: none;
  }
`;

const StyledTextArea = styled(TextareaAutosize)`
  border: none;
  font-family: inherit;
  font-size: 12pt;
  resize: none;
  overflow: hidden;
  line-height: 1.5;
  padding: 0.3rem 0.5rem;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  outline: none;
  :focus-within {
    border: 2px solid #777;
  }
`;

function moveCursorToEnd(el: any) {
  if (typeof el.selectionStart == "number") {
    el.selectionStart = el.selectionEnd = el.value.length;
  } else if (typeof el.createTextRange != "undefined") {
    el.focus();
    var range = el.createTextRange();
    range.collapse(false);
    range.select();
  }
}

function NameList({
  wheel: { label, segments },
  onChange,
  onDelete,
  onCreate,
  onSelect,
  onDeleteWheel,
  canDeleteWheel,
  onResetWheel,
  onUpdateWheel,
}: NameListProps) {
  const containerRef = useRef<any>(null);
  const textAreaRef = useRef<any>(null);

  const onNameChange = useCallback((e) => onUpdateWheel(e.target.value), [
    onUpdateWheel,
  ]);

  const canResetWheel = useMemo(
    () => !segments.every(({ removed, selected }) => !removed && !selected),
    [segments]
  );

  const names = useMemo(() => {
    return segments.map(({ label }) => label).join("\n");
  }, [segments]);

  const syncNames = useCallback(
    (nextNames) => {
      const count = Math.max(nextNames.length, segments.length);

      for (let i = 0; i < count; i += 1) {
        if (segments.length > i && nextNames.length > i) {
          onChange(segments[i].id, nextNames[i]);
        } else if (nextNames.length > i) {
          onCreate(nextNames[i]);
        } else {
          onDelete(segments[i].id);
        }
      }
    },
    [segments, onCreate, onDelete, onChange]
  );

  const handleNamesChanged = useCallback(
    (e) => {
      const value = e.target.value || "";

      const nextNames = value.trim().length === 0 ? [] : value.split("\n");

      syncNames(nextNames);
    },
    [syncNames]
  );

  const handleBlur = useCallback(
    (e) => {
      const value = e.target.value || "";

      const nextNames = value
        .split("\n")
        .map((name: string) => (name ? name.trim() : name))
        .filter((name: string) => !!name);

      syncNames(nextNames);
    },
    [syncNames]
  );

  const handleClick = useCallback(
    (e) => {
      if (textAreaRef.current && containerRef.current === e.target) {
        textAreaRef.current?.focus();
        moveCursorToEnd(textAreaRef.current);
      }
      onSelect();
    },
    [onSelect]
  );

  return (
    <ListContainer onClick={handleClick} ref={containerRef}>
      <WheelNameInput value={label} onChange={onNameChange} minWidth="220" />
      <ListTitleContainer>
        <StyledButton type="button">
          <FontAwesomeIcon icon={faEdit} /> Edit
        </StyledButton>
        {canDeleteWheel ? (
          <StyledButton
            type="button"
            disabled={!canDeleteWheel}
            onClick={onDeleteWheel}
          >
            <FontAwesomeIcon icon={faTrashAlt} /> Delete
          </StyledButton>
        ) : null}
        {canResetWheel ? (
          <StyledButton
            type="button"
            onClick={onResetWheel}
            disabled={!canResetWheel}
          >
            <FontAwesomeIcon icon={faUndo} /> Reset
          </StyledButton>
        ) : null}
      </ListTitleContainer>
      <StyledTextArea
        ref={textAreaRef}
        key="text-area"
        onChange={handleNamesChanged}
        onBlur={handleBlur}
        value={names}
        spellCheck={false}
        placeholder="Add some names..."
      />
    </ListContainer>
  );
}

export default NameList;
