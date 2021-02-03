import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { SegmentInfo } from "./types";
interface NameListProps {
  segments: SegmentInfo[];
  onChange: (id: string, label: string) => void;
  onDelete: (id: string) => void;
  onCreate: (label: string) => void;
}

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

function NameList({ segments, onChange, onDelete, onCreate }: NameListProps) {
  return (
    <ListContainer>
      {segments.map(({ id, label }) => {
        return (
          <NameInput
            key={id}
            name={label}
            onNameChanged={() => onChange(id, label)}
            onDelete={() => onDelete(id)}
          />
        );
      })}
    </ListContainer>
  );
}

interface NameInputProps {
  name: string;
  onNameChanged: (value: string) => void;
  onDelete: () => void;
}

const InputRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 200px;
`;

const ReadOnlyInput = styled.p`
  margin: 0;
  padding: 0.2em;
  font-size: 10pt;
  font-family: sans-serif;
  border: 1px solid transparent;
`;

const StyledInput = styled.input`
  margin: 0;
  padding: 0.2em;
  font-size: 10pt;
  font-family: sans-serif;
  border: 1px solid transparent;
`;

const DeleteButton = styled.button``;

function NameInput({ name, onNameChanged, onDelete }: NameInputProps) {
  const inputRef = useRef<any>();
  const [hasFocus, setHasFocus] = useState(false);
  const [hasMouseDown, setHasMouseDown] = useState(false);

  const handleChange = useCallback(
    (e) => {
      onNameChanged(e.target.value);
    },
    [onNameChanged]
  );

  const handleBlur = useCallback(() => !hasMouseDown && setHasFocus(false), [
    hasMouseDown,
  ]);
  const handleFocus = useCallback(() => setHasFocus(true), []);

  useEffect(() => {
    if (hasFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasFocus]);

  return (
    <InputRow onBlur={handleBlur} onClick={handleFocus}>
      {hasFocus ? (
        <>
          <StyledInput
            ref={inputRef}
            type="text"
            value={name}
            onChange={handleChange}
          />
          <DeleteButton
            type="button"
            onTouchStart={() => setHasMouseDown(true)}
            onMouseDown={() => setHasMouseDown(true)}
            onTouchEnd={() => setHasMouseDown(false)}
            onMouseUp={() => setHasMouseDown(false)}
            onClick={onDelete}
          >
            Delete
          </DeleteButton>
        </>
      ) : (
        <ReadOnlyInput>{name}</ReadOnlyInput>
      )}
    </InputRow>
  );
}

export default NameList;
