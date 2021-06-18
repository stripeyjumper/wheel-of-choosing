import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import NameList from "./NameList";
import { getColors } from "../../helpers/get-colors";
import { useWheels } from "../../services/use-wheels";
import ShareLink from "./ShareLink";
import { useDispatch } from "react-redux";
import {
  createWheel,
  resetWheel,
  updateSegments,
  selectWheel,
  deleteWheel,
  updateWheel,
} from "../../services/wheel-reducer";

const baseColors = ["#e75449", "#2a4257", "#407f61", "#dec752", "#d27c3f"];

const NameListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-top: 1rem;

  @media (min-width: 768px) {
    padding-left: 2rem;
    padding-right: 2rem;
    margin-top: 8rem;
  }
`;

const AddWheelButton = styled.button`
  width: 100%;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  border: 3px solid #eee;
  height: 3rem;
  color: #115da8;
  background-color: #eee;
  :hover {
    background-color: #115da8;
    border-color: #115da8;
    color: white;
  }
  font-size: 14pt;
  outline: none;
`;

function ListPanel() {
  const dispatch = useDispatch();
  const { wheels, selectedWheel, loading, serializedState } = useWheels();

  const wheelsWithColors = useMemo(() => {
    const colors = getColors(wheels.length, baseColors);
    return wheels.map((wheel, i) => ({
      ...wheel,
      color: colors[i],
    }));
  }, [wheels]);

  const handleReplaceSegments = useCallback(
    (id: string) => (labels: string[]) =>
      dispatch(updateSegments({ id, labels })),
    [dispatch]
  );

  const handleReset = useCallback(
    (id: string) => () => dispatch(resetWheel({ id })),
    [dispatch]
  );

  const handleCreateWheel = useCallback(
    () => dispatch(createWheel()),
    [dispatch]
  );

  const handleSelect = useCallback(
    (nextId: string) => () => dispatch(selectWheel({ id: nextId })),
    [dispatch]
  );

  const handleDeleteWheel = useCallback(
    (id: string) => () => dispatch(deleteWheel({ id })),
    [dispatch]
  );

  const handleUpdateWheel = useCallback(
    (id: string) => (name: string) => {
      dispatch(updateWheel({ id, label: name }));
    },
    [dispatch]
  );

  if (loading) {
    return null;
  }

  return (
    <NameListContainer>
      {wheelsWithColors.map(({ color, ...wheel }) => (
        <NameList
          key={wheel.id}
          wheel={wheel}
          color={color}
          active={selectedWheel.id === wheel.id}
          onNamesChanged={handleReplaceSegments(wheel.id)}
          onSelect={handleSelect(wheel.id)}
          onDeleteWheel={handleDeleteWheel(wheel.id)}
          canDeleteWheel={wheels.length > 1}
          onResetWheel={handleReset(wheel.id)}
          onUpdateWheel={handleUpdateWheel(wheel.id)}
        />
      ))}
      <AddWheelButton onClick={handleCreateWheel} type="button">
        <FontAwesomeIcon icon={faPlus} /> New wheel
      </AddWheelButton>
      <ShareLink
        serializedState={serializedState}
        countOfWheels={wheels.length}
      />
    </NameListContainer>
  );
}

export default ListPanel;
