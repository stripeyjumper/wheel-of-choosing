import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  margin: 0;
  padding: 0.1em;
  font-size: 10pt;
  font-family: sans-serif;
  border: 1px solid transparent;
  outline: none;
`;

const StyledButton = styled.button``;

const StyledForm = styled.form`
  display: flex;
  flex-direction: row;
  padding: 0.2rem;
`;

interface CreateNameInputProps {
  onCreate: (name: string) => void;
}

function CreateNameInput({ onCreate }: CreateNameInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      value && onCreate(value);
      setValue("");
      inputRef.current?.focus();
    },
    [value, onCreate]
  );

  const handleChange = useCallback((e) => setValue(e.target.value || ""), []);

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledInput
        value={value}
        onChange={handleChange}
        placeholder="Type to add a name"
        ref={inputRef}
      />
      <StyledButton type="submit">Add</StyledButton>
    </StyledForm>
  );
}

export default CreateNameInput;
