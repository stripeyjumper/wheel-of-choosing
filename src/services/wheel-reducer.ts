import { v4 as uuid } from "uuid";
import { WheelManagerState, WheelSegment } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const defaultState: WheelManagerState = {
  wheels: [
    {
      id: uuid(),
      label: "Wheel of choosing",
      segments: [1, 2, 3, 4, 5].map((i) => ({
        id: uuid(),
        label: `Name ${i}`,
        shufflePosition: Math.random(),
      })),
      isSpinning: false,
    },
  ],
  selectedWheelIndex: 0,
  prevSelectedWheelIndex: undefined,
  isSpinning: false,
  showDataUrl: false,
};

function updateItemInArray<TItem extends { id: any }>(
  array: TItem[],
  itemId: any,
  updateItemCallback: (item: TItem) => TItem
): TItem[] {
  return array.map((item) =>
    item.id !== itemId ? item : updateItemCallback(item)
  );
}

function deleteItemFromArray<TItem extends { id: any }>(
  array: TItem[],
  itemId: any
): TItem[] {
  const index = array.findIndex(({ id }) => id === itemId);
  if (index === -1) {
    throw new Error("Item not found");
  }
  const result = [...array];
  result.splice(index, 1);

  return result;
}

function mergeSegments(
  segments: WheelSegment[],
  nextSegments: { id: string; label: string; shufflePosition: number }[]
) {
  const remainingSegments = [...segments];
  const results: (WheelSegment | null)[] = Array(nextSegments.length).fill(
    null
  );
  const missingIndexes: number[] = [];

  // Use existing segments where the names match
  nextSegments.forEach(({ label }, i) => {
    const index = remainingSegments.findIndex(
      (segment) => segment.label === label
    );
    if (index > -1) {
      results[i] = remainingSegments[index];
      remainingSegments.splice(index, 1);
    } else {
      missingIndexes.push(i);
    }
  });

  // Re-use existing segments with updated names, if possible
  missingIndexes.forEach((index) => {
    const { id, label, shufflePosition } = nextSegments[index];
    if (remainingSegments.length) {
      results[index] = { ...remainingSegments[0], label };
      remainingSegments.splice(0, 1);
    } else {
      results[index] = {
        id,
        label,
        selected: false,
        removed: false,
        shufflePosition,
      };
    }
  });

  return results as WheelSegment[];
}

const reducers = {
  updateSegments: {
    reducer(
      state: WheelManagerState,
      action: PayloadAction<{
        id: string;
        segments: { id: string; label: string; shufflePosition: number }[];
      }>
    ) {
      const { id, segments: nextSegments } = action.payload;

      return {
        ...state,
        wheels: updateItemInArray(state.wheels, id, (wheel) => ({
          ...wheel,
          segments: mergeSegments(wheel.segments, nextSegments),
        })),
      };
    },
    prepare({ id, labels }: { id: string; labels: string[] }) {
      return {
        payload: {
          id,
          segments: labels.map((label) => ({
            id: uuid(),
            label,
            shufflePosition: Math.random(),
          })),
        },
      };
    },
  },
  startSpin(
    state: WheelManagerState,
    action: PayloadAction<{ id: string; nextSelectedSegmentId: string }>
  ) {
    const { id, nextSelectedSegmentId } = action.payload;
    const { wheels } = state;

    return {
      ...state,
      wheels: updateItemInArray(wheels, id, (wheel) => {
        const { segments } = wheel;

        const visibleSegments = segments.filter(
          ({ removed, selected }) => !removed && !selected
        );

        if (!visibleSegments.length) {
          return wheel;
        }

        const nextSegments = wheel.segments.map(
          ({ removed, selected, ...rest }) => ({
            ...rest,
            removed: removed || selected,
            selected: rest.id === nextSelectedSegmentId,
          })
        );

        return {
          ...wheel,
          segments: nextSegments,
          isSpinning: true,
        };
      }),
    };
  },
  endSpin(state: WheelManagerState) {
    const { selectedWheelIndex, wheels } = state;
    const { id } = wheels[selectedWheelIndex];
    return {
      ...state,
      wheels: updateItemInArray(wheels, id, (wheel) => {
        if (wheel.isSpinning) {
          return {
            ...wheel,
            isSpinning: false,
          };
        }
        return wheel;
      }),
    };
  },
  resetWheel(state: WheelManagerState, action: PayloadAction<{ id: string }>) {
    const { id } = action.payload;

    return {
      ...state,
      wheels: updateItemInArray(state.wheels, id, (wheel) => ({
        ...wheel,
        segments: wheel.segments.map(({ removed, selected, ...rest }) => ({
          removed: false,
          selected: false,
          ...rest,
        })),
        isSpinning: false,
      })),
    };
  },
  createWheel: {
    reducer(state: WheelManagerState, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;
      return {
        ...state,
        wheels: [
          ...state.wheels,
          {
            id,
            label: `Wheel ${state.wheels.length + 1}`,
            segments: [],
            isSpinning: false,
          },
        ],
        prevSelectedWheelIndex: state.selectedWheelIndex,
        selectedWheelIndex: state.wheels.length,
      };
    },
    prepare() {
      return {
        payload: {
          id: uuid(),
        },
      };
    },
  },
  updateWheel(
    state: WheelManagerState,
    action: PayloadAction<{ id: string; label: string }>
  ) {
    const { id, label } = action.payload;

    return {
      ...state,
      wheels: updateItemInArray(state.wheels, id, (wheel) => ({
        ...wheel,
        label,
      })),
    };
  },
  deleteWheel(state: WheelManagerState, action: PayloadAction<{ id: string }>) {
    const { id } = action.payload;

    if (state.wheels.length <= 1) {
      throw new Error("The last wheel cannot be deleted");
    }

    const prevSelectedWheelIndex = state.selectedWheelIndex;
    const nextWheels = deleteItemFromArray(state.wheels, id);

    const selectedWheelIndex = Math.min(
      prevSelectedWheelIndex,
      nextWheels.length - 1
    );

    return {
      ...state,
      wheels: nextWheels,
      prevSelectedWheelIndex,
      selectedWheelIndex,
    };
  },
  selectWheel(state: WheelManagerState, action: PayloadAction<{ id: string }>) {
    const { id } = action.payload;
    const prevSelectedWheelIndex = state.selectedWheelIndex;
    const selectedWheelIndex = state.wheels.findIndex(
      ({ id: wheelId }) => wheelId === id
    );
    return {
      ...state,
      wheels: updateItemInArray(
        state.wheels,
        state.wheels[prevSelectedWheelIndex].id,
        (wheel) => ({ ...wheel, isSpinning: false })
      ),
      prevSelectedWheelIndex,
      selectedWheelIndex,
    };
  },
  replaceState(_: WheelManagerState, action: PayloadAction<WheelManagerState>) {
    const nextState = action.payload;
    return { ...nextState };
  },
  setShowDataUrl(state: WheelManagerState, action: PayloadAction<boolean>) {
    return {
      ...state,
      showDataUrl: action.payload,
    };
  },
};

const wheelSlice = createSlice({
  name: "wheels",
  initialState: defaultState,
  reducers,
});

export const {
  updateSegments,
  startSpin,
  endSpin,
  resetWheel,
  updateWheel,
  createWheel,
  deleteWheel,
  selectWheel,
  replaceState,
  setShowDataUrl,
} = wheelSlice.actions;

export default wheelSlice.reducer;
