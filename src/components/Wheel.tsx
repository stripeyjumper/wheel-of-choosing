import React, { useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import WheelSegment from "./WheelSegment";

interface WheelProps {
  segments: { id: string; label: string; color: string }[];
  onSpin: () => void;
  selectedSegmentId?: string;
}

const defaultProps = {
  radius: 90,
};

const WheelGroup = styled.g<any>`
  transform-origin: 50% 50%;
  @keyframes wheel--animation {
    0% {
      transform: rotate(0deg) translate(100px, 100px);
    }

    100% {
      transform: rotate(${({ spinAngle }) => `${spinAngle}`}deg)
        translate(100px, 100px);
    }
  }

  animation-duration: ${({ spinDuration }) => `${spinDuration}`}s;
  animation-timing-function: ease-out;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-name: wheel--animation;
`;

function usePrevious<TValue>(value: TValue) {
  const ref = useRef<TValue>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function Wheel({ segments, onSpin, selectedSegmentId }: WheelProps) {
  const { radius } = defaultProps;

  const angle = (2 * Math.PI) / segments.length;

  const prevSelectedSegmentId = usePrevious(selectedSegmentId);
  const { spinAngle, spinDuration } = useMemo(() => {
    return { spinAngle: 720, spinDuration: 3 };
  }, [selectedSegmentId, prevSelectedSegmentId]);

  return (
    <svg
      width="600"
      height="600"
      style={{ position: "relative", pointerEvents: "none" }}
      viewBox="0 0 200 200"
    >
      <WheelGroup
        stroke="#000"
        id="wheel"
        spinAngle={spinAngle}
        spinDuration={spinDuration}
      >
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
