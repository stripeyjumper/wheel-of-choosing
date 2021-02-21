import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { Wheel } from "./types";
import CreateNameInput from "./CreateNameInput";
import AutosizeInput from "react-input-autosize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { faTimes, faUndo } from "@fortawesome/free-solid-svg-icons";

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
  border: 1px solid #ddd;
  min-width: 15rem;
`;

const ListTitleContainer = styled.div`
  margin-bottom: 1rem;
`;

const StyledButton = styled.button`
  border: none;
  background-color: transparent;
  color: #777;
  :hover:not(:disabled) {
    color: black;
  }
`;

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
  const onNameChange = useCallback((e) => onUpdateWheel(e.target.value), [
    onUpdateWheel,
  ]);

  const canResetWheel = useMemo(
    () => !segments.every(({ removed, selected }) => !removed && !selected),
    [segments]
  );

  return (
    <ListContainer onClick={onSelect}>
      <WheelNameInput value={label} onChange={onNameChange} />
      <ListTitleContainer>
        <StyledButton type="button">
          <FontAwesomeIcon icon={faEdit} />
        </StyledButton>
        <StyledButton
          type="button"
          disabled={!canDeleteWheel}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteWheel();
          }}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </StyledButton>
        <StyledButton
          type="button"
          onClick={onResetWheel}
          disabled={!canResetWheel}
        >
          <FontAwesomeIcon icon={faUndo} />
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
  align-content: space-between;
  width: 100%;
  padding: 0.2rem;
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

function NameInput({ name, onNameChanged, removed, onDelete }: NameInputProps) {
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
      <StyledButton onClick={onDelete} style={{ marginLeft: "auto" }}>
        <FontAwesomeIcon icon={faTimes} />
      </StyledButton>
    </InputRow>
  );
}

export default NameList;