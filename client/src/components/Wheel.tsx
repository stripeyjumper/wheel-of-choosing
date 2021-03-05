import React, { useEffect } from "react";
import WheelSegment, { EmptyWheel } from "./WheelSegment";
import { motion, useMotionTemplate, useSpring } from "framer-motion";
import { getRandomInteger } from "./get-random-integer";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointLeft, faRedo } from "@fortawesome/free-solid-svg-icons";

interface WheelProps {
  segments: { id: string; label: string; color: string; selected?: boolean }[];
  onSpinStart: () => void;
  onSpinEnd: () => void;
  isSpinning: boolean;
  label?: string;
}

const Heading = styled.h1`
  text-align: center;
  margin-bottom: 1rem;
`;

const defaultProps = {
  radius: 90,
};

const WheelGroup = motion.g;

const SpinButton = styled.button`
  width: 200px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  border-radius: 0.5rem;
  border: none;
  height: 3rem;
  background-color: #0a7b8d;
  border: 3px solid #0a7b8d;
  color: white;
  font-size: 14pt;
  outline: none;
`;

const WheelContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: calc(100vh - 3rem);
`;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function getWheelAngle(
  prevAngle: number,
  selectedIndex: number,
  totalSegments: number
) {
  const twoPi = 2 * Math.PI;
  const segmentAngle = twoPi / totalSegments;

  // Add a bit of random jitter to the final position, without changing the outcome
  const maxJitter = Math.min(0.8, segmentAngle * 0.8);
  const jitter = (Math.random() - 0.5) * maxJitter;

  const prevSpinAngle = mod(prevAngle, twoPi);
  const nextSpinAngle = mod(selectedIndex * segmentAngle * -1, twoPi);

  // Get the clockwise angle between the previous and next segments
  const diff = mod(nextSpinAngle - prevSpinAngle, twoPi);

  // Add a random number of complete rotations
  const additionalSpins = twoPi * getRandomInteger(1, 4);

  return prevAngle + diff + jitter + additionalSpins;
}

function Wheel({
  label,
  segments,
  onSpinStart,
  onSpinEnd,
  isSpinning,
}: WheelProps) {
  const duration = 2000;
  const spinAngle = useSpring(0, { duration });
  const segmentAngle = (2 * Math.PI) / segments.length;

  const { radius } = defaultProps;

  useEffect(() => {
    if (isSpinning) {
      const selectedIndex = Math.max(
        segments.findIndex(({ selected }) => selected),
        0
      );

      spinAngle.set(
        getWheelAngle(spinAngle.get(), selectedIndex, segments.length)
      );
      setTimeout(onSpinEnd, duration);
    }
  }, [isSpinning, spinAngle, onSpinEnd, segments]);

  const rotate = useMotionTemplate`${spinAngle}rad`;

  return (
    <WheelContainer>
      <Heading>{label || "Wheel of choosing"}</Heading>
      <svg
        width="100%"
        height="100%"
        style={{ position: "relative", pointerEvents: "none" }}
        viewBox="0 0 220 200"
      >
        <WheelGroup
          rotate={rotate}
          x={110}
          y={100}
          transformTemplate={({ rotate, x, y }) =>
            `rotate(${rotate}) translate(${x}, ${y})`
          }
          style={{ originX: "110px", originY: "100px" }}
        >
          {segments.length ? (
            segments.map(({ id, label, color, selected }, i) => {
              const rotation = i * segmentAngle;

              return (
                <WheelSegment
                  id={id}
                  radius={radius}
                  color={color}
                  rotation={rotation}
                  angle={segmentAngle}
                  label={`${label}`}
                  key={id}
                  onClick={onSpinStart}
                  selected={!isSpinning && !!selected}
                />
              );
            })
          ) : (
            <EmptyWheel radius={radius} label="Add some names..." />
          )}
        </WheelGroup>
        <FontAwesomeIcon
          icon={faHandPointLeft}
          width={20}
          height={20}
          x={195}
          y={92}
        />
      </svg>
      <SpinButton
        disabled={isSpinning || segments.length <= 1}
        onClick={onSpinStart}
      >
        <FontAwesomeIcon icon={faRedo} /> Spin
      </SpinButton>
    </WheelContainer>
  );
}

export default Wheel;
