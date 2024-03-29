import { v4 as uuid } from "uuid";
import { compress, decompress } from "lzutf8";
import { WheelManagerState } from "./types";
import Ajv, { JTDSchemaType } from "ajv/dist/jtd";

const schemaVersion = "1";

/** Compact format for serializing wheel state */
interface SavedState {
  /** Version number */
  v: string;
  /** Wheels */
  w: {
    /** Label */
    l: string;
    /** Segment names  */
    s: string[];
  }[];
  /** Selected wheel index */
  i: number;
}

const schema: JTDSchemaType<SavedState> = {
  properties: {
    v: { type: "string" },
    w: {
      elements: {
        properties: {
          l: {
            type: "string",
          },
          s: {
            elements: {
              type: "string",
            },
          },
        },
      },
    },
    i: {
      type: "int32",
    },
  },
};

const validateSavedState = new Ajv().compile(schema);

/** Prepare wheel state to be saved */
function mapToSavedState({
  wheels,
  selectedWheelIndex,
}: WheelManagerState): SavedState {
  return {
    v: schemaVersion,
    i: selectedWheelIndex,
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
      shufflePosition: Math.random(),
    })),
    isSpinning: false,
  }));

  return {
    wheels,
    selectedWheelIndex: selectedWheelIndex || 0,
    showDataUrl: false,
  };
}
/**
 * Serialize wheel state to a base64 string.
 * Transient state like hidden segments is not preserved.
 * */
export function serializeWheelState(state: WheelManagerState) {
  return compress(JSON.stringify(mapToSavedState(state)), {
    outputEncoding: "Base64",
  });
}

/** Get fully hydrated wheel state from a base64 string */
export function deserializeWheelState(data: string): WheelManagerState | null {
  let result: WheelManagerState | null = null;
  try {
    const json = decompress(data, {
      inputEncoding: "Base64",
    });
    const savedState = JSON.parse(json) as SavedState;

    if (!validateSavedState(savedState)) {
      throw new Error("Saved state failed validation");
    }

    if (!savedState.w.length) {
      throw new Error("No wheels found in saved state");
    }

    result = mapFromSavedState(savedState);
  } catch (e: any) {
    console.error(`Error deserializing wheel data: ${e.message}`);
  }

  return result;
}
