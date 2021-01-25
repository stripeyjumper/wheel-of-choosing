import React from "react";
import WheelSegment from "./WheelSegment";

interface WheelProps {
  segments: { id: string; label: string; color: string }[];
  onSpin: () => void;
  isSpinning: boolean;
}

const defaultProps = {
  radius: 90,
};

function Wheel({ segments, onSpin, isSpinning }: WheelProps) {
  const { radius } = defaultProps;

  const angle = (2 * Math.PI) / segments.length;

  return (
    <svg
      width="600"
      height="600"
      style={{ position: "relative", pointerEvents: "none" }}
      viewBox="0 0 200 200"
    >
      <g transform="translate(100,100)" stroke="#000">
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
      </g>
    </svg>
  );
}

export default Wheel;
