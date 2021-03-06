import React, { useEffect } from "react";
import WheelSegment, { EmptyWheel } from "./WheelSegment";
import { motion, useMotionTemplate, useSpring } from "framer-motion";
import { getRandomInteger } from "./get-random-integer";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faHandPointLeft,
  faRedo,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import BigButton from "./BigButton";

interface WheelProps {
  segments: { id: string; label: string; color: string; selected?: boolean }[];
  onSpinStart: () => void;
  onSpinEnd: () => void;
  onReset: () => void;
  onNextWheel: () => void;
  isSpinning: boolean;
  label?: string;
}

const Heading = styled.h1`
  text-align: center;
  margin-bottom: 0;
  font-size: 36pt;
  font-weight: 700;
  color: white;
`;

const defaultProps = {
  radius: 90,
};

const WheelGroup = motion.g;

const SpinButton = styled(BigButton)`
  width: 300px;
  background-color: #fa9f52;
  border-color: #fa9f52;
  margin-bottom: 1rem;

  :hover {
    background-color: #e06802;
    border-color: #e06802;
    color: white;
  }
`;

const SmallButton = styled.button`
  width: 150px;
  font-size: 10pt;
  margin-left: 0.5rem;
  margin-right: 0.5rem;

  font-family: "Varela Round", sans-serif;
  text-align: center;

  border-radius: 0.5rem;
  border: none;
  background-color: #eee;
  border: 3px solid #eee;

  color: #115da8;
  outline: none;
  padding: 0.5rem;

  :hover {
    background-color: #115da8;
    border-color: #115da8;
    color: white;
  }
`;

const WheelContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: calc(100vh - 3rem);
`;

const ButtonContainer = styled.div`
  width: 300px;
  margin-left: auto;
  margin-right: auto;
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

const ButtonRow = styled.div`
  display: flex;
  align-items: flex-start;
  align-content: stretch;
  flex-direction: row;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
`;

const CentreCircle = styled.circle`
  vector-effect: non-scaling-stroke;
  pointer-events: auto;
`;

function Wheel({
  label,
  segments,
  onSpinStart,
  onSpinEnd,
  onReset,
  onNextWheel,
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
            <>
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
              <CentreCircle fill="#444" stroke="#444" r={radius * 0.08} />
            </>
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
          color="#fff"
        />
      </svg>
      <ButtonContainer>
        <SpinButton
          disabled={isSpinning || segments.length <= 1}
          onClick={onSpinStart}
        >
          <FontAwesomeIcon icon={faRedo} /> Spin
        </SpinButton>
        <ButtonRow>
          <SmallButton onClick={onReset}>
            <FontAwesomeIcon icon={faUndo} /> Reset names
          </SmallButton>
          <SmallButton onClick={onNextWheel}>
            <FontAwesomeIcon icon={faArrowRight} /> Next wheel
          </SmallButton>
        </ButtonRow>
      </ButtonContainer>
    </WheelContainer>
  );
}

export default Wheel;
