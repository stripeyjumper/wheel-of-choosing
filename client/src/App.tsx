import React, { useCallback, useMemo } from "react";
import NameList from "./components/NameList";
import Wheel from "./components/Wheel";
import { getColors } from "./get-colors";
import styled from "styled-components";
import {
  CreateSegmentAction,
  DeleteSegmentAction,
  DeleteWheelAction,
  ResetWheelAction,
  SelectWheelAction,
  UpdateSegmentAction,
  UpdateWheelAction,
} from "./components/types";
import { useWheels } from "./components/use-wheels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const baseColors = ["#e75449", "#2a4257", "#407f61", "#dec752", "#d27c3f"];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

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

function App() {
  const { dispatch, wheels, selectedWheel } = useWheels();

  const { id: selectedWheelId, label, segments, isSpinning } = selectedWheel;

  const segmentsWithColors = useMemo(() => {
    const colors = getColors(segments.length, baseColors);
    return segments.map((segment, i) => ({
      ...segment,
      color: colors[i],
    }));
  }, [segments]);

  const wheelsWithColors = useMemo(() => {
    const colors = getColors(wheels.length, baseColors);
    return wheels.map((wheel, i) => ({
      ...wheel,
      color: colors[i],
    }));
  }, [wheels]);

  const visibleSegments = useMemo(
    () => segmentsWithColors.filter(({ removed }) => !removed),
    [segmentsWithColors]
  );

  const handleSpinStart = useCallback(() => {
    dispatch({ type: "START_SPIN" });
  }, [dispatch]);

  const handleSpinEnd = useCallback(() => {
    dispatch({ type: "END_SPIN" });
  }, [dispatch]);

  const handleChange = useCallback(
    (wheelId: string) => (id: string, name: string) => {
      dispatch({
        type: "UPDATE_SEGMENT",
        wheelId,
        id,
        label: name,
      } as UpdateSegmentAction);
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (wheelId: string) => (id: string) =>
      dispatch({
        type: "DELETE_SEGMENT",
        wheelId,
        id,
      } as DeleteSegmentAction),
    [dispatch]
  );

  const handleCreate = useCallback(
    (wheelId: string) => (name: string) => {
      dispatch({
        type: "CREATE_SEGMENT",
        wheelId,
        label: name,
      } as CreateSegmentAction);
    },
    [dispatch]
  );

  const handleReset = useCallback(
    (id: string) => () => {
      dispatch({ type: "RESET_WHEEL", id } as ResetWheelAction);
    },
    [dispatch]
  );

  const handleCreateWheel = useCallback(
    () => dispatch({ type: "CREATE_WHEEL" }),
    [dispatch]
  );

  const handleSelect = useCallback(
    (id: string) => () =>
      dispatch({
        type: "SELECT_WHEEL",
        id,
      } as SelectWheelAction),
    [dispatch]
  );

  const handleDeleteWheel = useCallback(
    (id: string) => () => {
      dispatch({
        type: "DELETE_WHEEL",
        id,
      } as DeleteWheelAction);
    },
    [dispatch]
  );

  const handleUpdateWheel = useCallback(
    (id: string) => (name: string) => {
      dispatch({
        type: "UPDATE_WHEEL",
        id,
        label: name,
      } as UpdateWheelAction);
    },
    [dispatch]
  );

  const handleNextWheel = useCallback(() => {
    const index = wheels.findIndex(({ id }) => id === selectedWheelId);
    if (index > -1 && index < wheels.length - 1) {
      const nextId = wheels[index + 1].id;
      dispatch({
        type: "SELECT_WHEEL",
        id: nextId,
      } as SelectWheelAction);
    }
  }, [dispatch, wheels, selectedWheelId]);

  const canReset = segments.some(
    ({ removed, selected }) => removed || selected
  );

  const hasNextWheel =
    wheels.findIndex(({ id }) => id === selectedWheelId) < wheels.length - 1;

  return (
    <div className="App">
      <Container>
        <Wheel
          key={selectedWheelId}
          label={label}
          segments={visibleSegments}
          onSpinStart={handleSpinStart}
          onSpinEnd={handleSpinEnd}
          onReset={handleReset(selectedWheelId)}
          onNextWheel={handleNextWheel}
          isSpinning={isSpinning}
          canReset={canReset}
          hasNextWheel={hasNextWheel}
          countOfNames={segments.length}
        />
        <NameListContainer>
          {wheelsWithColors.map(({ color, ...wheel }) => (
            <NameList
              key={wheel.id}
              wheel={wheel}
              color={color}
              active={selectedWheelId === wheel.id}
              onChange={handleChange(wheel.id)}
              onDelete={handleDelete(wheel.id)}
              onCreate={handleCreate(wheel.id)}
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
        </NameListContainer>
      </Container>
    </div>
  );
}

export default App;
