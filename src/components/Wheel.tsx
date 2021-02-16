import React, { useEffect } from "react";
import WheelSegment, { EmptyWheel } from "./WheelSegment";
import { motion, useMotionTemplate, useSpring } from "framer-motion";
import { getRandomInteger } from "./get-random-integer";
import styled from "styled-components";
interface WheelProps {
  segments: { id: string; label: string; color: string; selected?: boolean }[];
  onSpinStart: () => void;
  onSpinEnd: () => void;
  isSpinning: boolean;
  label?: string;
}

const defaultProps = {
  radius: 90,
};

const WheelGroup = motion.g;

const SpinButton = styled.button`
  width: 200px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
`;

const WheelContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  const jitter =
    (Math.random() - 0.5) * segmentAngle * (totalSegments > 1 ? 0.75 : 0.1);

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
      <svg
        width="600"
        height="400"
        style={{ position: "relative", pointerEvents: "none" }}
        viewBox="0 0 200 200"
      >
        <WheelGroup
          stroke="#666"
          rotate={rotate}
          x={100}
          y={100}
          transformTemplate={({ rotate, x, y }) =>
            `rotate(${rotate}) translate(${x}, ${y})`
          }
          style={{ originX: "100px", originY: "100px" }}
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
            <EmptyWheel
              radius={radius}
              label={`Add some names to ${label || "the wheel"}...`}
            />
          )}
        </WheelGroup>
      </svg>
      <SpinButton
        disabled={isSpinning || segments.length <= 1}
        onClick={onSpinStart}
      >
        Spin
      </SpinButton>
    </WheelContainer>
  );
}

export default Wheel;
