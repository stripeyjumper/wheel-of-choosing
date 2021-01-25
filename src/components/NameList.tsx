import React, { useCallback } from "react";

interface NameListProps {
  names: string[];
  onChanged: (names: string[]) => void;
}

function NameList({ names, onChanged }: NameListProps) {
  return (
    <>
      {names.map((name, i) => {
        return (
          <NameInput
            name={name}
            onNameChanged={(value) => {
              const nextNames = [...names];
              nextNames[i] = value;
              onChanged(nextNames);
            }}
            onDelete={() => null}
          />
        );
      })}
    </>
  );
}

interface NameInputProps {
  name: string;
  onNameChanged: (value: string) => void;
  onDelete: () => void;
}

function NameInput({ name, onNameChanged, onDelete }: NameInputProps) {
  const handleChange = useCallback(
    (e) => {
      onNameChanged(e.target.value);
    },
    [onNameChanged]
  );
  return <input type="text" value={name} onChange={handleChange} />;
}

export default NameList;
