import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { SegmentInfo } from "./types";
import CreateNameInput from "./CreateNameInput";
import AutosizeInput from "react-input-autosize";

interface NameListProps {
  segments: SegmentInfo[];
  onChange: (id: string, label: string) => void;
  onDelete: (id: string) => void;
  onCreate: (label: string) => void;
}

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

function NameList({ segments, onChange, onDelete, onCreate }: NameListProps) {
  return (
    <ListContainer>
      <CreateNameInput onCreate={onCreate} />
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
  padding: 0.2em;
  font-size: 10pt;
  font-family: sans-serif;
  border: 1px solid transparent;
  text-decoration: ${({ removed }) => (removed ? "line-through" : "none")};
`;

const StyledInput = styled(AutosizeInput)`
  margin: 0;
  padding: 0.2em;
  font-size: 10pt;
  font-family: sans-serif;
  border: 1px solid transparent;
  outline: none;
`;

function NameInput({ name, onNameChanged, onDelete, removed }: NameInputProps) {
  const inputRef = useRef<any>(null);
  const [hasFocus, setHasFocus] = useState(false);

  const handleChange = useCallback(
    (e) => {
      if (e.target.value) {
        onNameChanged(e.target.value);
      } else {
        onDelete();
      }
    },
    [onNameChanged, onDelete]
  );

  const handleBlur = useCallback(() => setHasFocus(false), []);
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
        </>
      ) : (
        <ReadOnlyInput removed={removed}>{name}</ReadOnlyInput>
      )}
    </InputRow>
  );
}

export default NameList;
