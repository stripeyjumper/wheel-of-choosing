import React, { useCallback, useMemo, useState } from "react";
import "./App.css";
import NameList from "./components/NameList";
import Wheel from "./components/Wheel";
import { getColors } from "./get-colors";
import styled from "styled-components";

const baseColors = ["#488f31", "#ffe48f", "#de425b", "#22a3bd"];

const Heading = styled.h1`
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

function App() {
  const [{ segments }, setState] = useState({
    segments: [
      { id: "1", label: "Toot" },
      { id: "2", label: "Toot" },
      { id: "3", label: "Toot" },
      { id: "4", label: "Toot" },
      { id: "5", label: "Toot" },
      { id: "6", label: "Toot" },
      { id: "7", label: "Toot" },
      { id: "8", label: "Toot" },
      { id: "9", label: "Toot" },
      { id: "10", label: "Toot" },
      { id: "11", label: "Toot" },
      { id: "12", label: "Toot" },
      { id: "13", label: "Toot" },
      { id: "14", label: "Toot" },
    ],
  });

  const [selectedSegmentId, setSelectedSegmentId] = useState<string>();

  const handleSpin = useCallback(() => {
    const nextSegmentIndex = Math.floor(Math.random() * segments.length);
    setSelectedSegmentId(segments[nextSegmentIndex].id);
  }, [segments]);

  const names = useMemo(() => segments.map(({ label }) => label), [segments]);

  const handleChanged = useCallback(
    (names: string[]) =>
      setState((prevState) => ({
        ...prevState,
        segments: names.map((name, i) => ({
          id: `${i}`,
          label: name,
        })),
      })),
    []
  );

  const segmentsWithColors = useMemo(() => {
    const colors = getColors(segments.length, baseColors);
    return segments.map((segment, i) => ({
      ...segment,
      color: colors[i],
    }));
  }, [segments]);

  return (
    <div className="App">
      <header className="App-header">
        <Heading>Wheel of choosing</Heading>
      </header>
      <Container>
        <NameList names={names} onChanged={handleChanged} />
        <Wheel
          segments={segmentsWithColors}
          onSpin={handleSpin}
          selectedSegmentId={selectedSegmentId}
        />
      </Container>
    </div>
  );
}

export default App;
