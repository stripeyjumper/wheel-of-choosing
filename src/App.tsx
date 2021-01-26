import React, { useCallback, useMemo, useState } from "react";
import "./App.css";
import NameList from "./components/NameList";
import Wheel from "./components/Wheel";
import { getColors } from "./get-colors";

const baseColors = ["#488f31", "#ffe48f", "#de425b"];

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
    ],
  });
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = useCallback(() => {
    setIsSpinning((prevIsSpinning) => !prevIsSpinning);
  }, []);

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
        <h1>Wheel of choosing</h1>
      </header>
      <NameList names={names} onChanged={handleChanged} />
      <Wheel
        segments={segmentsWithColors}
        onSpin={handleSpin}
        isSpinning={isSpinning}
      />
    </div>
  );
}

export default App;
