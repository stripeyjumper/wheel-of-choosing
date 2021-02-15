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
} from "./components/types";
import { useWheels } from "./components/use-wheels";

const baseColors = ["#488f31", "#ffe48f", "#de425b", "#22a3bd"];

const Heading = styled.h1`
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const NameListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

function App() {
  const { dispatch, wheels, selectedWheel } = useWheels();

  const { id: selectedWheelId, segments, isSpinning } = selectedWheel;

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

  const handleReset = useCallback(() => {
    dispatch({ type: "RESET_WHEEL", id: selectedWheelId } as ResetWheelAction);
  }, [dispatch, selectedWheelId]);

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

  return (
    <div className="App">
      <header className="App-header">
        <Heading>Wheel of choosing</Heading>
      </header>
      <Container>
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
            />
          ))}
        </NameListContainer>
        <Wheel
          segments={visibleSegments}
          onSpinStart={handleSpinStart}
          onSpinEnd={handleSpinEnd}
          isSpinning={isSpinning}
        />
      </Container>
      <button onClick={handleCreateWheel} type="button">
        Add wheel
      </button>
      <button onClick={handleReset} type="button">
        Reset
      </button>
    </div>
  );
}

export default App;
