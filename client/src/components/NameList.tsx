import React, { useCallback, useMemo, useRef } from "react";
import styled from "styled-components";
import { Wheel } from "./types";
import AutosizeInput from "react-input-autosize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import TextareaAutosize from "react-textarea-autosize";

interface NameListProps {
  wheel: Wheel;
  active: boolean;
  onChange: (id: string, label: string) => void;
  onDelete: (id: string) => void;
  onCreate: (label: string) => void;
  onSelect: () => void;
  onDeleteWheel: () => void;
  canDeleteWheel: boolean;
  onResetWheel: () => void;
  onUpdateWheel: (label: string) => void;
  color: string;
}

const ListContainer = styled.div<any>`
  display: flex;
  flex-direction: column;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 0.5rem solid ${({ $active, $color }) => ($active ? $color : "#eee")};
  min-width: 15rem;
  border-radius: 0.5rem;
  background-color: #eee;

  background-color: #eee;
`;

const ListTitleContainer = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: row;
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
  margin-left: 0.5rem;
  border: none;
  background-color: transparent;
  color: #777;
  :hover:not(:disabled) {
    color: black;
  }
  outline: none;
  visibility: ${({ disabled }) => (disabled ? "hidden" : "show")};
`;

const WheelNameInput = styled<any>(AutosizeInput)`
  display: block;
  margin: 0;
  padding: 0.3rem 0.5rem;
  font-size: 10pt;
  border: 2px solid transparent;
  background-color: transparent;
  border-radius: 0.5rem;

  :focus-within {
    border: 2px solid #777;
    background-color: white;
  }
  input {
    font-family: "Varela Round", sans-serif;
    font-size: 16pt;
    font-weight: bold;
    outline: none;
    padding: 0;
    border: none;
    background-color: transparent;
  }
`;

const StyledTextArea = styled<any>(TextareaAutosize)`
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
  background-color: inherit;
  :focus-within {
    border: 2px solid #777;
    background-color: white;
    color: black;
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
  active,
  onChange,
  onDelete,
  onCreate,
  onSelect,
  onDeleteWheel,
  canDeleteWheel,
  onUpdateWheel,
  color,
}: NameListProps) {
  const containerRef = useRef<any>(null);
  const textAreaRef = useRef<any>(null);

  const onNameChange = useCallback((e) => onUpdateWheel(e.target.value), [
    onUpdateWheel,
  ]);

  const names = useMemo(() => {
    return segments.map(({ label }) => label).join("\n");
  }, [segments]);

  const syncNames = useCallback(
    (nextNames) => {
      const count = Math.max(nextNames.length, segments.length);

      for (let i = 0; i < count; i += 1) {
        if (segments.length > i && nextNames.length > i) {
          if (nextNames[i] !== segments[i].label) {
            onChange(segments[i].id, nextNames[i]);
          }
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
    <ListContainer
      onClick={handleClick}
      ref={containerRef}
      $active={active}
      $color={color}
    >
      <ListTitleContainer>
        <WheelNameInput
          value={label}
          onChange={onNameChange}
          minWidth={"200"}
          spellCheck={false}
          $active={active}
        />
        <StyledButton
          type="button"
          disabled={!canDeleteWheel}
          onClick={onDeleteWheel}
        >
          <FontAwesomeIcon icon={faTimes} />
        </StyledButton>
      </ListTitleContainer>
      <StyledTextArea
        ref={textAreaRef}
        key="text-area"
        onChange={handleNamesChanged}
        onBlur={handleBlur}
        spellCheck={false}
        placeholder="Add some names..."
        $active={active}
      >
        {names}
      </StyledTextArea>
    </ListContainer>
  );
}

export default NameList;
