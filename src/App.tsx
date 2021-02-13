import React, { useCallback, useMemo, useState } from "react";
import NameList from "./components/NameList";
import Wheel from "./components/Wheel";
import { getColors } from "./get-colors";
import styled from "styled-components";
import {
  CreateSegmentAction,
  DeleteSegmentAction,
  SegmentInfo,
  UpdateSegmentAction,
} from "./components/types";
import { v4 as uuid } from "uuid";
import { useWheels } from "./components/use-wheels";

const baseColors = ["#488f31", "#ffe48f", "#de425b", "#22a3bd"];

const Heading = styled.h1`
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const defaultSegments = [
  { label: "Toot" },
  { label: "Toot 2" },
  { label: "Toot 3" },
  { label: "Toot 4" },
  { label: "Toot 5" },
  { label: "Toot 6" },
  { label: "Toot 7" },
  { label: "Toot 8" },
  { label: "Toot 9" },
].map((s) => ({ ...s, id: uuid() }));

function App() {
  const {
    dispatch,
    selectedWheel: { id: wheelId, segments },
  } = useWheels();

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

  const selectedSegmentId = useMemo(() => {
    const selected = segments.find(({ selected }) => selected);
    return selected?.id;
  }, [segments]);

  const handleSpin = useCallback(() => {
    dispatch({ type: "SPIN" });
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

  return (
    <div className="App">
      <header className="App-header">
        <Heading>Wheel of choosing</Heading>
      </header>
      <Container>
        <NameList
          segments={segments}
          onChange={handleChange}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />
        <Wheel
          segments={visibleSegments}
          onSpin={handleSpin}
          selectedSegmentId={selectedSegmentId}
        />
      </Container>
      <button
        onClick={handleSpin}
        type="button"
        disabled={visibleSegments.length <= 1}
      >
        Spin!
      </button>
      {/* <button onClick={handleReset} type="button">
        Reset
      </button> */}
    </div>
  );
}

export default App;
