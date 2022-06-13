import {
  serializeWheelState,
  deserializeWheelState,
} from "./serialize-wheel-state";
import { WheelManagerState } from "./types";

const validState: WheelManagerState = {
  wheels: [
    {
      id: "wheel-1",
      label: "First wheel",
      segments: [
        {
          id: "segment-1",
          label: "First segment,:",
          selected: false,
          removed: false,
          shufflePosition: 0.2,
        },
        {
          id: "segment-2",
          label: "Second segment,",
          selected: false,
          removed: false,
          shufflePosition: 0.1,
        },
      ],
      isSpinning: true,
    },
  ],
  selectedWheelIndex: 1,
  prevSelectedWheelIndex: undefined,
  showDataUrl: false,
};

jest.mock("uuid", () => ({
  v4: () => "uuid",
}));

describe("serialize wheel state", () => {
  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.12345);
  });

  afterEach(() => {
    jest.spyOn(global.Math, "random").mockRestore();
  });

  it("Serializes and deserializes correctly", () => {
    expect(deserializeWheelState(serializeWheelState(validState)))
      .toMatchInlineSnapshot(`
      Object {
        "selectedWheelIndex": 1,
        "showDataUrl": false,
        "wheels": Array [
          Object {
            "id": "uuid",
            "isSpinning": false,
            "label": "First wheel",
            "segments": Array [
              Object {
                "id": "uuid",
                "label": "First segment,:",
                "removed": false,
                "selected": false,
                "shufflePosition": 0.12345,
              },
              Object {
                "id": "uuid",
                "label": "Second segment,",
                "removed": false,
                "selected": false,
                "shufflePosition": 0.12345,
              },
            ],
          },
        ],
      }
    `);
  });
});
