import React, { useMemo } from "react";
import WheelSegment from "./WheelSegment";
import { usePreviousValue } from "./use-previous-value";
import { motion } from "framer-motion";

interface WheelProps {
  segments: { id: string; label: string; color: string }[];
  onSpin: () => void;
  selectedSegmentId?: string;
}

const defaultProps = {
  radius: 90,
};

const WheelGroup = motion.g;

function Wheel({ segments, onSpin, selectedSegmentId }: WheelProps) {
  const { radius } = defaultProps;

  const angle = (2 * Math.PI) / segments.length;

  // const prevSelectedSegmentId = usePreviousValue(selectedSegmentId);

  // const { spinAngle, spinDuration } = useMemo(() => {
  //   return { spinAngle: 720, spinDuration: 3 };
  // }, [selectedSegmentId, prevSelectedSegmentId]);

  return (
    <svg
      width="600"
      height="400"
      style={{ position: "relative", pointerEvents: "none" }}
      viewBox="0 0 200 200"
    >
      <WheelGroup stroke="#000">
        {segments.map(({ id, label, color }, i) => {
          const rotation = i * angle;

          return (
            <WheelSegment
              id={id}
              radius={radius}
              color={color}
              rotation={rotation}
              angle={angle}
              label={label}
              key={id}
              onClick={onSpin}
            />
          );
        })}
      </WheelGroup>
    </svg>
  );
}

export default Wheel;
