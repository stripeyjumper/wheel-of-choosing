import React, { useCallback, useMemo, useState } from "react";
import "./App.css";
import NameList from "./components/NameList";
import Wheel from "./components/Wheel";

function App() {
  const [{ segments }, setState] = useState({
    segments: [
      { id: "1", label: "Toot", color: "#f00" },
      { id: "2", label: "Toot", color: "#ff0" },
      { id: "3", label: "Toot", color: "#f0f" },
    ],
  });
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = useCallback(() => {
    setIsSpinning((prevIsSpinning) => !prevIsSpinning);
  }, []);

  const names = useMemo(() => segments.map(({ label }) => label), [segments]);

  const handleChanged = useCallback((names: string[]) => {
    setState((prevState) => ({
      ...prevState,
      segments: names.map((name, i) => ({
        id: `${i}`,
        label: name,
        color: "#0ff",
      })),
    }));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Wheel of choosing</h1>
      </header>
      <NameList names={names} onChanged={handleChanged} />
      <Wheel segments={segments} onSpin={handleSpin} isSpinning={isSpinning} />
    </div>
  );
}

export default App;
