import React, { useEffect } from "react";
import WheelSegment from "./WheelSegment";
import { motion, useMotionTemplate, useSpring } from "framer-motion";

interface WheelProps {
  segments: { id: string; label: string; color: string; selected?: boolean }[];
  onSpinStart: () => void;
  onSpinEnd: () => void;
  isSpinning: boolean;
}

const defaultProps = {
  radius: 90,
};

const WheelGroup = motion.g;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function getRandomInteger(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

function Wheel({ segments, onSpinStart, onSpinEnd, isSpinning }: WheelProps) {
  const spinAngle = useSpring(0, { duration: 2000 });
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
    }
  }, [isSpinning, spinAngle, segments]);

  const rotate = useMotionTemplate`${spinAngle}rad`;

  return (
    <>
      <p>{isSpinning ? "Spinning!" : "Not spinning"}</p>
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
          onAnimationEnd={onSpinEnd}
        >
          {segments.map(({ id, label, color, selected }, i) => {
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
          })}
        </WheelGroup>
      </svg>
    </>
  );
}

export default Wheel;
