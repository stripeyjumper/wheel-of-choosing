import React, { useCallback, useMemo, useState } from "react";
import NameList from "./components/NameList";
import Wheel from "./components/Wheel";
import { getColors } from "./get-colors";
import styled from "styled-components";
import { SegmentInfo } from "./components/types";
import { v4 as uuid } from "uuid";

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
  const [segments, setSegments] = useState<SegmentInfo[]>(defaultSegments);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>();

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

  const handleSpin = useCallback(() => {
    // Randomly pick the next segment to spin to
    const nextSegmentIndex = Math.floor(
      Math.random() * (visibleSegments.length - 1)
    );

    setSegments((prevSegments) => {
      const nextSegments = [...prevSegments];

      if (selectedSegmentId) {
        const index = nextSegments.findIndex(
          ({ id }) => id === selectedSegmentId
        );
        nextSegments[index] = { ...nextSegments[index], removed: true };
      }

      return nextSegments;
    });

    const nextVisibleSegments = visibleSegments.filter(
      ({ id }) => id !== selectedSegmentId
    );

    setSelectedSegmentId(nextVisibleSegments[nextSegmentIndex].id);
  }, [selectedSegmentId, visibleSegments]);

  const handleChange = useCallback(
    (id: string, name: string) => {
      const index = segments.findIndex((segment) => segment.id === id);
      const nextSegments = [...segments];
      nextSegments[index] = { ...nextSegments[index], label: name };
      setSegments(nextSegments);
    },
    [segments]
  );

  const handleDelete = useCallback(
    (id) => {
      const index = segments.findIndex((segment) => segment.id === id);
      const nextSegments = [...segments];
      nextSegments.splice(index, 1);
      setSegments(nextSegments);
    },
    [segments]
  );

  const handleCreate = useCallback((label: string) => {
    console.log("Create!");
    const segment = { label, id: uuid() };
    setSegments((prevSegments) => [segment, ...prevSegments]);
  }, []);

  const handleReset = useCallback(
    () => setSegments(segments.map((s) => ({ ...s, removed: false }))),
    [segments]
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
      <button onClick={handleReset} type="button">
        Reset
      </button>
    </div>
  );
}

export default App;
