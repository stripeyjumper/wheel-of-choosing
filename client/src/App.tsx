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

const baseColors = ["#488f31", "#ffe48f", "#de425b", "#22a3bd"];

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const NameListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-top: 5rem;
`;

const AddWheelButton = styled.button`
  padding: 0.2rem;
  border-radius: 0.3rem;
  > svg {
    margin-left: 0.5rem;
  }
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
    (id: string) => () =>
      dispatch({
        type: "DELETE_WHEEL",
        id,
      } as DeleteWheelAction),
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

  return (
    <div className="App">
      <Container>
        <Wheel
          key={selectedWheelId}
          label={label}
          segments={visibleSegments}
          onSpinStart={handleSpinStart}
          onSpinEnd={handleSpinEnd}
          isSpinning={isSpinning}
        />
        <NameListContainer>
          {wheels.map((wheel) => (
            <NameList
              key={wheel.id}
              wheel={wheel}
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
            New wheel
            <FontAwesomeIcon icon={faPlus} />
          </AddWheelButton>
        </NameListContainer>
      </Container>
    </div>
  );
}

export default App;
