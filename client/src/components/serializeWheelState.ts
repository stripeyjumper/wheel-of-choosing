import { v4 as uuid } from "uuid";
import { compress, decompress } from "lzutf8";
import { WheelManagerState } from "./types";

/** Compact format for serializing wheel state */
interface SavedState {
  w: {
    l: string;
    s: string[];
  }[];
  i: number;
}

/** Prepare wheel state to be saved */
function mapToSavedState({
  wheels,
  selectedWheelId,
}: WheelManagerState): SavedState {
  return {
    i: wheels.findIndex(({ id }) => id === selectedWheelId),
    w: wheels.map(({ label, segments }) => ({
      l: label as string,
      s: segments
        .filter(({ label }) => !!label && !!label.trim())
        .map(({ label: segmentLabel }) => segmentLabel.trim()),
    })),
  };
}

/** Hydrate wheel state from saved data */
function mapFromSavedState(savedState: SavedState): WheelManagerState {
  const { w: savedWheels, i: selectedWheelIndex } = savedState;
  const wheels = savedWheels.map(({ l: label, s: segments }) => ({
    id: uuid(),
    label,
    segments: segments.map((segmentLabel) => ({
      id: uuid(),
      label: segmentLabel,
      selected: false,
      removed: false,
    })),
    isSpinning: false,
  }));

  return {
    wheels,
    selectedWheelId: wheels[selectedWheelIndex || 0].id,
    isSpinning: false,
  };
}
/**
 * Serialize wheel state to a base64 string.
 * Transient state like hidden segments is not preserved.
 * */
export function serializeWheelState(state: WheelManagerState) {
  return encodeURI(
    compress(JSON.stringify(mapToSavedState(state)), {
      outputEncoding: "Base64",
    })
  );
}

/** Get fully hydrated wheel state from a base64 string */
export function deserializeWheelState(data: string): WheelManagerState {
  return mapFromSavedState(
    JSON.parse(decompress(data, { inputEncoding: "Base64" }))
  );
}
