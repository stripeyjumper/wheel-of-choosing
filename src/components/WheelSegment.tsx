import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";

const SegmentCircle = styled.circle`
  vector-effect: non-scaling-stroke;
  pointer-events: auto;
`;

const SegmentPath = styled.path`
  vector-effect: non-scaling-stroke;
  pointer-events: auto;
`;

const SegmentLabel = styled.text<any>`
  font-family: sans-serif;
  font-size: 8pt;
  font-weight: normal;
  ${({ hideLabel, selected }) => css`
    fill: ${hideLabel ? "transparent" : selected ? "white" : "black"};
  `}
  stroke: none;
`;

const NoItemsLabel = styled.text`
  text-anchor: middle;
  stroke: none;
  font-size: 8pt;
  font-weight: normal;
  fill: #555;
`;

interface SegmentProps {
  id: string;
  radius: number;
  label: string;
  angle: number;
  rotation: number;
  color: string;
  onClick?: () => void;
  selected: boolean;
}

function formatNumber(value: number) {
  if (value < 0) {
    return value.toString();
  }
  return ` ${value}`;
}

function radiansToDegrees(radians: number) {
  return radians * (180 / Math.PI);
}

function getCoordinates(radius: number, angle: number) {
  const x = radius * Math.cos(angle);
  const y = radius * Math.sin(angle);
  return [x, y];
}

export function EmptyWheel({
  radius,
  label,
}: {
  radius: number;
  label: string;
}) {
  return (
    <>
      <SegmentCircle r={radius} fill="#eee" stroke="#ccc" />
      <NoItemsLabel>{label}</NoItemsLabel>
    </>
  );
}

function WheelSegment({
  id,
  radius,
  color,
  angle,
  rotation,
  label,
  onClick,
  selected,
}: SegmentProps) {
  const labelRef = useRef<any>(null);
  const [textState, setTextState] = useState<{
    scale: number;
    offset: number;
  }>();
  const labelId = `label-${id}`;

  const [x1, y1] = getCoordinates(radius, rotation - angle / 2);
  const [x2, y2] = getCoordinates(radius, rotation + angle / 2);

  useEffect(() => {
    if (labelRef.current) {
      const dimensions = labelRef.current.getBBox();
      const maxLength = radius - 25;
      const scale =
        dimensions.width > maxLength ? maxLength / dimensions.width : 1;

      const offset = Math.max(20, radius - 5 - dimensions.width);

      setTextState({
        scale,
        offset,
      });
    }
  }, [label, radius]);

  return (
    <>
      {angle >= 2 * Math.PI ? (
        <SegmentCircle r={radius} fill={color} onClick={onClick} />
      ) : (
        <SegmentPath
          d={`M0 0${formatNumber(x1)}${formatNumber(y1)}A${formatNumber(
            radius
          )} ${formatNumber(radius)} 0 0 1${formatNumber(x2)}${formatNumber(
            y2
          )}Z`}
          fill={color}
          onClick={onClick}
        />
      )}
      <SegmentLabel
        id={labelId}
        text-anchor="start"
        x={(textState?.offset || 20) / (textState?.scale || 1)}
        y={3}
        transform={`rotate(${radiansToDegrees(rotation)}), scale(${
          textState?.scale || 1
        })`}
        ref={labelRef}
        hideLabel={!textState}
        selected={selected}
      >
        {label}
      </SegmentLabel>
    </>
  );
}

export default WheelSegment;
