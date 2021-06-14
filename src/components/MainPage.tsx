import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import Wheel from "./Wheel";
import NameList from "./NameList";
import { getColors } from "../helpers/get-colors";
import { useWheels } from "../service/use-wheels";
import { useWindowSize } from "../helpers/use-window-size";
import VerticalScrollAnimation from "./VerticalScrollAnimation";
import { getRandomInteger } from "../helpers/get-random-integer";
import ShareLink from "./ShareLink";
import { useDispatch } from "react-redux";
import {
  createWheel,
  endSpin,
  resetWheel,
  startSpin,
  updateSegments,
  selectWheel,
  deleteWheel,
  updateWheel,
} from "../service/wheel-reducer";

const skipName = process.env.REACT_APP_SKIP_NAME;

function shouldSkipName(name?: string) {
  if (!name || !skipName) {
    return false;
  }

  return new RegExp(skipName).test(name);
}

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
  margin-bottom: 1rem;
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

function MainPage() {
  const dispatch = useDispatch();
  const { wheels, selectedWheel, loading, serializedState } = useWheels();

  const { width } = useWindowSize();
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

  const handleReplaceSegments = useCallback(
    (id: string) => (labels: string[]) =>
      dispatch(updateSegments({ id, labels })),
    [dispatch]
  );

  const handleReset = useCallback(
    (id: string) => () => dispatch(resetWheel({ id })),
    [dispatch]
  );

  const handleCreateWheel = useCallback(() => {
    setScrollDirection("down");
    dispatch(createWheel());
  }, [dispatch]);

  const handleSelect = useCallback(
    (nextId: string) => () => {
      const currentIndex = wheels.findIndex(({ id }) => id === selectedWheelId);
      const nextIndex = wheels.findIndex(({ id }) => id === nextId);

      setScrollDirection(nextIndex > currentIndex ? "down" : "up");

      dispatch(selectWheel({ id: nextId }));
    },
    [dispatch, selectedWheelId, wheels]
  );

  const handleDeleteWheel = useCallback(
    (id: string) => () => {
      if (id === selectedWheelId) {
        const index = wheels.findIndex((wheel) => wheel.id === id);
        setScrollDirection(index < wheels.length - 1 ? "down" : "up");
      }

      dispatch(deleteWheel({ id }));
    },
    [dispatch, wheels, selectedWheelId]
  );

  const handleUpdateWheel = useCallback(
    (id: string) => (name: string) => {
      dispatch(updateWheel({ id, label: name }));
    },
    [dispatch]
  );

  const handleNextWheel = useCallback(() => {
    const index = wheels.findIndex(({ id }) => id === selectedWheelId);
    if (index > -1 && index < wheels.length - 1) {
      const nextId = wheels[index + 1].id;

      setScrollDirection("down");

      dispatch(selectWheel({ id: nextId }));
    }
  }, [dispatch, wheels, selectedWheelId]);

  const canReset = segments.some(
    ({ removed, selected }) => removed || selected
  );

  const hasNextWheel =
    wheels.findIndex(({ id }) => id === selectedWheelId) < wheels.length - 1;

  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");

  if (loading) {
    return null;
  }

  return (
    <Container>
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
      <NameListContainer>
        {wheelsWithColors.map(({ color, ...wheel }) => (
          <NameList
            key={wheel.id}
            wheel={wheel}
            color={color}
            active={selectedWheelId === wheel.id}
            onNamesChanged={handleReplaceSegments(wheel.id)}
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
        <ShareLink
          serializedState={serializedState}
          countOfWheels={wheels.length}
        />
      </NameListContainer>
    </Container>
  );
}

export default MainPage;
