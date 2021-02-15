import React, { useCallback, useMemo } from "react";
import NameList from "./components/NameList";
import Wheel from "./components/Wheel";
import { getColors } from "./get-colors";
import styled from "styled-components";
import {
  CreateSegmentAction,
  DeleteSegmentAction,
  ResetWheelAction,
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

function App() {
  const { dispatch, selectedWheel } = useWheels();

  const { id: wheelId, segments, isSpinning } = selectedWheel;

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
    (id: string, name: string) => {
      dispatch({
        type: "UPDATE_SEGMENT",
        wheelId,
        id,
        label: name,
      } as UpdateSegmentAction);
    },
    [dispatch, wheelId]
  );

  const handleDelete = useCallback(
    (id) =>
      dispatch({ type: "DELETE_SEGMENT", wheelId, id } as DeleteSegmentAction),
    [dispatch, wheelId]
  );

  const handleCreate = useCallback(
    (name: string) => {
      dispatch({
        type: "CREATE_SEGMENT",
        wheelId,
        label: name,
      } as CreateSegmentAction);
    },
    [dispatch, wheelId]
  );

  const handleReset = useCallback(() => {
    dispatch({ type: "RESET_WHEEL", id: wheelId } as ResetWheelAction);
  }, [dispatch, wheelId]);

  return (
    <div className="App">
      <header className="App-header">
        <Heading>Wheel of choosing</Heading>
      </header>
      <Container>
        <NameList
          wheel={selectedWheel}
          onChange={handleChange}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />
        <Wheel
          segments={visibleSegments}
          onSpinStart={handleSpinStart}
          onSpinEnd={handleSpinEnd}
          isSpinning={isSpinning}
        />
      </Container>
      <button
        onClick={handleSpinStart}
        type="button"
        disabled={visibleSegments.length <= 1}
      >
        Spin!
      </button>
      <button onClick={handleReset} type="button">
        Reset
      </button>
    </div>
  );
}

export default App;
