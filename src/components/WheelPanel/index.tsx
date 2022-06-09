import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import Wheel from "./Wheel";
import { getColors } from "../../helpers/get-colors";
import { useWheels } from "../../services/use-wheels";
import { useWindowSize } from "../../helpers/use-window-size";
import VerticalScrollAnimation from "./VerticalScrollAnimation";
import { getRandomInteger } from "../../helpers/get-random-integer";
import {
  endSpin,
  resetWheel,
  startSpin,
  selectWheel,
} from "../../services/wheel-reducer";

const skipName = process.env.REACT_APP_SKIP_NAME;

function shouldSkipName(name?: string) {
  if (!name || !skipName) {
    return false;
  }

  return new RegExp(skipName).test(name);
}

const baseColors = ["#e75449", "#2a4257", "#407f61", "#dec752", "#d27c3f"];

function useRandomColorSettings() {
  const [colorSettings] = useState(() => ({
    colorOffset: Math.random(),
    reverseColors: Math.random() < 0.5,
  }));

  return colorSettings;
}

function WheelPanel() {
  const dispatch = useDispatch();
  const { wheels, selectedWheel, loading, scrollDirection } = useWheels();

  const { width } = useWindowSize();
  const { id: selectedWheelId, label, segments, isSpinning } = selectedWheel;

  // The color settings will persist for the lifetime of the panel
  const { colorOffset, reverseColors } = useRandomColorSettings();

  const segmentsWithColors = useMemo(() => {
    const colors = getColors(segments.length, baseColors);

    if (reverseColors) {
      colors.reverse();
    }
    const indexOffset = Math.floor(colorOffset * segments.length);

    return segments.map((segment, i) => ({
      ...segment,
      color: colors[(i + indexOffset) % segments.length],
    }));
  }, [segments, colorOffset, reverseColors]);

  const visibleSegments = useMemo(
    () => segmentsWithColors.filter(({ removed }) => !removed),
    [segmentsWithColors]
  );

  const handleSpinStart = useCallback(() => {
    if (!isSpinning) {
      let nextSegments = segments.filter(
        ({ removed, selected }) => !removed && !selected
      );

      if (nextSegments.length) {
        // Skip any segments with the specified name, unless they are all a match
        if (!nextSegments.every(({ label }) => shouldSkipName(label))) {
          nextSegments = nextSegments.filter(
            ({ label }) => !shouldSkipName(label)
          );
        }

        const selectedSegmentIndex = getRandomInteger(
          0,
          nextSegments.length - 1
        );

        const { id: nextSelectedSegmentId } =
          nextSegments[selectedSegmentIndex];

        dispatch(startSpin({ id: selectedWheelId, nextSelectedSegmentId }));
      }
    }
  }, [dispatch, segments, selectedWheelId, isSpinning]);

  const handleSpinEnd = useCallback(() => dispatch(endSpin()), [dispatch]);

  const handleReset = useCallback(
    (id: string) => () => dispatch(resetWheel({ id })),
    [dispatch]
  );

  const handleNextWheel = useCallback(() => {
    const index = wheels.findIndex(({ id }) => id === selectedWheelId);
    if (index > -1 && index < wheels.length - 1) {
      const nextId = wheels[index + 1].id;
      dispatch(selectWheel({ id: nextId }));
    }
  }, [dispatch, wheels, selectedWheelId]);

  const canReset = segments.some(
    ({ removed, selected }) => removed || selected
  );

  const hasNextWheel =
    wheels.findIndex(({ id }) => id === selectedWheelId) < wheels.length - 1;

  if (loading) {
    return null;
  }

  return (
    <VerticalScrollAnimation
      id={selectedWheelId}
      scrollDirection={scrollDirection}
      enabled={!width || width >= 768}
    >
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
    </VerticalScrollAnimation>
  );
}

export default WheelPanel;
