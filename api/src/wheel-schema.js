const wheelSegmentSchema = {
  properties: {
    id: { type: "string" },
    label: { type: "string" },
  },
  optionalProperties: {
    selected: { type: "boolean" },
    removed: { type: "boolean" },
  },
};

const wheelSchema = {
  properties: {
    id: { type: "string" },
    segments: {
      elements: wheelSegmentSchema,
    },
  },
  optionalProperties: {
    label: { type: "string" },
  },
};

const wheelManagerSchema = {
  properties: {
    wheels: {
      elements: wheelSchema,
    },
    isSpinning: { type: "boolean" },
  },
  optionalProperties: {
    selectedWheelId: { type: "string" },
  },
};

exports.wheelSchema = wheelManagerSchema;
