const { validateWheels } = require("./validate-wheels");

const wheels = {
  wheels: [
    {
      id: "1",
      label: "label here",
      segments: [
        {
          id: "2",
          label: "A segment here",
          selected: false,
          removed: false,
        },
      ],
      isSpinning: false,
    },
  ],
  selectedWheelId: "2",
};

test("Validates wheel state", () => {
  expect(validateWheels(wheels)).toEqual(true);
});

test("Validates wheel state from string", () => {
  expect(validateWheels(JSON.stringify(wheels))).toEqual(true);
});

// test("Fails with invalid wheel state", () => {
//   expect(validateWheels({ ...wheels, naughty: true })).toEqual(false);
// });
