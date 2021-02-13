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

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Wheel({ segments, onSpinStart, onSpinEnd, isSpinning }: WheelProps) {
  const spinAngle = useSpring(0, { duration: 2000 });
  const segmentAngle = (2 * Math.PI) / segments.length;

  const { radius } = defaultProps;

  useEffect(() => {
    if (isSpinning) {
      const index = Math.max(
        segments.findIndex(({ selected }) => selected),
        0
      );

      const twoPi = 2 * Math.PI;
      const angle = twoPi / segments.length;

      const wobble =
        (Math.random() - 0.5) * angle * (segments.length > 1 ? 0.75 : 0.1);

      const prevSpinAngle = mod(spinAngle.get(), twoPi);
      const nextSpinAngle = mod(index * angle * -1, twoPi);
      const diff = mod(nextSpinAngle - prevSpinAngle, twoPi);
      spinAngle.set(
        spinAngle.get() + diff + wobble + twoPi * getRandomInt(1, 4)
      );
    }
  }, [isSpinning, spinAngle, segments]);

  const transform = useMotionTemplate`rotate(${spinAngle}rad) translate(100px, 100px)`;
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
          transform={transform}
          transition={{ ease: "easeOut", duration: 4 }}
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
