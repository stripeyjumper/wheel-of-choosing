import {
  serializeWheelState,
  deserializeWheelState,
} from "./serialize-wheel-state";

const validState = {
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
        },
        {
          id: "segment-2",
          label: "Second segment,",
          selected: false,
          removed: false,
        },
      ],
      isSpinning: false,
    },
  ],
  selectedWheelIndex: 0,
  prevSelectedWheelIndex: undefined,
  isSpinning: false,
  showDataUrl: false,
};

jest.mock("uuid", () => {
  let i = 0;
  return {
    v4: () => {
      i += 1;
      return `uuid-${i}`;
    },
  };
});

test("Ok here", () => {
  expect(deserializeWheelState(serializeWheelState(validState)))
    .toMatchInlineSnapshot(`
    Object {
      "isSpinning": false,
      "selectedWheelIndex": 0,
      "showDataUrl": false,
      "wheels": Array [
        Object {
          "id": "uuid-1",
          "isSpinning": false,
          "label": "First wheel",
          "segments": Array [
            Object {
              "id": "uuid-2",
              "label": "First segment,:",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-3",
              "label": "Second segment,",
              "removed": false,
              "selected": false,
            },
          ],
        },
      ],
    }
  `);
});

const serialized =
  "eyJ2IjoiMSIsImkiOjAsInciOlt7ImwiOiJXaGVlbCBvZiBjaG9vc2luZyIsInMiOlsiSWFuIEUiLCJTYW50b3NoIiwiS2lyc3RlbiIsIkFuZHJldyIsIlJhaHVsIiwiSm/EF8QzV8QpYXJ0aGlrYSIsIk1hbmFnZXMgYSBuZXR3b3JrIG9mIiwib3JnYW5pc2F0aW9ucywgaW5zdGl0dcYOIiwiY29tcGFuaWVzLCBzdXBwbGllcsYYdXN0b23EDSBpbmRpdmlkdWFscyBhbmTkANpudGVncsZTIHRoYXQgcmVwcmVzZW50IHRoZSIsImRpc2NvdmVyZWTEMyByZWFsLXdvcmzEPnJlbMY7aGlwxz9leGlzdCBiZXR3ZeUA9nRoZW0uIiwiTm90ZTogVGhpcyBBUEkgaXMgY3VycmVudGx5IGnEKWRldmVsb3BlbW50xWltYXkgYuQAgXN1YmplY3QgdG8gYnJlYWtpbmcgY2hhbmdlcyIsInVudGls5ACrxQQxLjAuMCByZWxlYXNlLiBGcm9t5gCEzhogd2Ugd2lsbCBmb2xsb+QBlHNlbWFudGljIHZlcnNpb27EZeQAhmhhdmUg5AGUY2xlYXIgZOQBHWFj5AD0IHBvaWN55ADbVW5sZXNzIOQBJXdpc2Ugc3RhdGVkLCBzdHLmAhtwcm9wZXJ0aWVzx1AgbWF4aW115ACcbGVuZ3Ro5AJMNTEy5ADYcmFjdGVycy4iXX0s7AJuMucCZM8XM8kXXX0=";

test.only("deserialize", () => {
  expect(deserializeWheelState(serialized)).toMatchInlineSnapshot(`
    Object {
      "isSpinning": false,
      "selectedWheelIndex": 0,
      "showDataUrl": false,
      "wheels": Array [
        Object {
          "id": "uuid-1",
          "isSpinning": false,
          "label": "Wheel of choosing",
          "segments": Array [
            Object {
              "id": "uuid-2",
              "label": "Ian E",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-3",
              "label": "Santosh",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-4",
              "label": "Kirsten",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-5",
              "label": "Andrew",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-6",
              "label": "Rahul",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-7",
              "label": "Jon",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-8",
              "label": "Ian W",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-9",
              "label": "Karthika",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-10",
              "label": "Manages a network of",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-11",
              "label": "organisations, institutions,",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-12",
              "label": "companies, suppliers,",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-13",
              "label": "customers, individuals and",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-14",
              "label": "integrations that represent the",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-15",
              "label": "discovered and real-world",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-16",
              "label": "relationships that exist between",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-17",
              "label": "them.",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-18",
              "label": "Note: This API is currently in",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-19",
              "label": "developemnt and may be",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-20",
              "label": "subject to breaking changes",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-21",
              "label": "until the the 1.0.0 release. From",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-22",
              "label": "the 1.0.0 release we will follow",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-23",
              "label": "semantic versioning and have a",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-24",
              "label": "clear depreaction poicy.",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-25",
              "label": "Unless overwise stated, string",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-26",
              "label": "properties have a maximum",
              "removed": false,
              "selected": false,
            },
            Object {
              "id": "uuid-27",
              "label": "length of 512 characters.",
              "removed": false,
              "selected": false,
            },
          ],
        },
        Object {
          "id": "uuid-28",
          "isSpinning": false,
          "label": "Wheel 2",
          "segments": Array [],
        },
        Object {
          "id": "uuid-29",
          "isSpinning": false,
          "label": "Wheel 3",
          "segments": Array [],
        },
      ],
    }
  `);
});
