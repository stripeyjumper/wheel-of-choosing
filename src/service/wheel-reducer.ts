import { v4 as uuid } from "uuid";
import { WheelManagerState, WheelSegment } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const defaultWheelId = uuid();

const defaultState: WheelManagerState = {
  wheels: [
    {
      id: defaultWheelId,
      label: "Wheel of choosing",
      segments: [
        { id: uuid(), label: "Name 1" },
        { id: uuid(), label: "Name 2" },
        { id: uuid(), label: "Name 3" },
        { id: uuid(), label: "Name 4" },
        { id: uuid(), label: "Name 5" },
      ],
      isSpinning: false,
    },
  ],
  selectedWheelId: defaultWheelId,
  isSpinning: false,
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
  nextSegments: { id: string; label: string }[]
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
    const { label, id } = nextSegments[index];
    if (remainingSegments.length) {
      results[index] = { ...remainingSegments[0], label };
      remainingSegments.splice(0, 1);
    } else {
      results[index] = {
        id,
        label,
        selected: false,
        removed: false,
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
        segments: { id: string; label: string }[];
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
    const { selectedWheelId, wheels } = state;

    return {
      ...state,
      wheels: updateItemInArray(wheels, selectedWheelId, (wheel) => {
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
        selectedWheelId: id,
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

    const nextWheels = deleteItemFromArray(state.wheels, id);
    let selectedWheelId: string | undefined = state.selectedWheelId;

    if (id === selectedWheelId) {
      const deletedIndex = state.wheels.findIndex(
        ({ id: wheelId }) => wheelId === id
      );
      const index = Math.min(deletedIndex, nextWheels.length - 1);
      selectedWheelId = index >= 0 ? nextWheels[index].id : undefined;
    }

    return {
      ...state,
      wheels: nextWheels,
      selectedWheelId,
    };
  },
  selectWheel(state: WheelManagerState, action: PayloadAction<{ id: string }>) {
    const { id } = action.payload;
    return {
      ...state,
      wheels: updateItemInArray(
        state.wheels,
        state.selectedWheelId,
        (wheel) => ({ ...wheel, isSpinning: false })
      ),
      selectedWheelId: id,
    };
  },
  replaceState(
    state: WheelManagerState,
    action: PayloadAction<WheelManagerState>
  ) {
    const nextState = action.payload;
    return { ...nextState };
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
} = wheelSlice.actions;

export default wheelSlice.reducer;
