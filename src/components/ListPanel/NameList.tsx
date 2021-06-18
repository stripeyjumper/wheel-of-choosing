import React, { useCallback, useMemo, useRef } from "react";
import styled from "styled-components";
import { Wheel } from "../../services/types";
import AutosizeInput from "react-input-autosize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import TextareaAutosize from "react-textarea-autosize";

interface NameListProps {
  wheel: Wheel;
  active: boolean;
  onNamesChanged: (labels: string[]) => void;
  onSelect: () => void;
  onDeleteWheel: () => void;
  canDeleteWheel: boolean;
  onResetWheel: () => void;
  onUpdateWheel: (label: string) => void;
  color: string;
}

const ListContainer = styled.div<any>`
  margin-bottom: 1rem;
  border: 0.5rem solid ${({ $active, $color }) => ($active ? $color : "#eee")};
  min-width: 15rem;
  border-radius: 1rem;
`;

const ListContainerInner = styled.div<any>`
  display: flex;
  flex-direction: column;
  padding: 0.8rem;
  border-radius: ${({ $active }) => ($active ? "0.5rem" : "none")};
  background-color: ${({ $active }) => ($active ? "#fff" : "#eee")};
`;

const ListTitleContainer = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
    border: 2px solid #bbb;
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
    border: 2px solid #bbb;
    background-color: white;
    color: black;
  }
  width: calc(100% - 1.4rem);
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
  onNamesChanged,
  onSelect,
  onDeleteWheel,
  canDeleteWheel,
  onUpdateWheel,
  color,
}: NameListProps) {
  const containerRef = useRef<any>(null);
  const textAreaRef = useRef<any>(null);

  const onNameChange = useCallback(
    (e) => onUpdateWheel(e.target.value),
    [onUpdateWheel]
  );

  const names = useMemo(() => {
    return segments.map(({ label }) => label).join("\n");
  }, [segments]);

  const handleNamesChanged = useCallback(
    (e) => {
      const value = e.target.value || "";

      const nextNames = value.trim().length === 0 ? [] : value.split("\n");

      onNamesChanged(nextNames);
    },
    [onNamesChanged]
  );

  const handleBlur = useCallback(
    (e) => {
      const value = e.target.value || "";

      const nextNames = value
        .split("\n")
        .map((name: string) => (name ? name.trim() : name))
        .filter((name: string) => !!name);

      onNamesChanged(nextNames);
    },
    [onNamesChanged]
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
      <ListContainerInner $active={active} $color={color}>
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
          value={names}
          onBlur={handleBlur}
          spellCheck={false}
          placeholder="Add some names..."
          $active={active}
        ></StyledTextArea>
      </ListContainerInner>
    </ListContainer>
  );
}

export default NameList;
