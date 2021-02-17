import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Wheel } from "./types";
import CreateNameInput from "./CreateNameInput";
import AutosizeInput from "react-input-autosize";

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
  margin: 1rem;
  margin-top: 0;
  border: 1px solid #ddd;
`;

const ListTitleContainer = styled.div`
  h2 {
    margin-top: 0;
  }
`;

const StyledButton = styled.button``;

const WheelNameInput = styled<any>(AutosizeInput)`
  display: block;
  margin: 0;
  padding: 0.1em;
  font-size: 10pt;
  font-family: sans-serif;
  border: 1px solid transparent;
  outline: none;
  input {
    font-size: 16pt;
    font-weight: bold;
    outline: none;
    border: 0;
    padding: 0;
    text-decoration: ${({ removed }) => (removed ? "line-through" : "none")};
  }
`;

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
  const onNameChange = useCallback((e) => onUpdateWheel(e.target.value), []);

  return (
    <ListContainer onClick={onSelect}>
      <WheelNameInput value={label} onChange={onNameChange} />
      <ListTitleContainer>
        <StyledButton
          type="button"
          disabled={!canDeleteWheel}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteWheel();
          }}
        >
          Delete
        </StyledButton>
        <StyledButton type="button" onClick={onResetWheel}>
          Reset
        </StyledButton>
      </ListTitleContainer>
      {segments.map(({ id, label, removed }) => {
        return (
          <NameInput
            key={id}
            name={label}
            onNameChanged={(value) => onChange(id, value)}
            onDelete={() => onDelete(id)}
            removed={!!removed}
          />
        );
      })}
      <CreateNameInput onCreate={onCreate} />
    </ListContainer>
  );
}

interface NameInputProps {
  name: string;
  removed: boolean;
  onNameChanged: (value: string) => void;
  onDelete: () => void;
}

const InputRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 200px;
  padding: 0.2rem;
`;

const ReadOnlyInput = styled.p<any>`
  margin: 0;
  padding: 0.1em;
  font-size: 10pt;
  font-family: sans-serif;
  border: 1px solid transparent;
  text-decoration: ${({ removed }) => (removed ? "line-through" : "none")};
`;

const StyledInput = styled<any>(AutosizeInput)`
  margin: 0;
  padding: 0.1em;
  font-size: 10pt;
  font-family: sans-serif;
  border: 1px solid transparent;
  outline: none;
  input {
    outline: none;
    border: 0;
    padding: 0;
    text-decoration: ${({ removed }) => (removed ? "line-through" : "none")};
  }
`;

function NameInput({ name, onNameChanged, removed }: NameInputProps) {
  const inputRef = useRef<any>(null);
  const [hasFocus, setHasFocus] = useState(false);

  const handleChange = useCallback(
    (e) => {
      onNameChanged(e.target.value);
    },
    [onNameChanged]
  );

  const handleBlur = useCallback(() => setHasFocus(false), []);
  const handleFocus = useCallback((e) => {
    setHasFocus(true);
  }, []);

  useEffect(() => {
    if (hasFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasFocus]);

  return (
    <InputRow onBlur={handleBlur} onClick={handleFocus}>
      <StyledInput
        ref={inputRef}
        type="text"
        value={name}
        onChange={handleChange}
        onFocus={handleFocus}
        removed={removed}
      />
    </InputRow>
  );
}

export default NameList;
