import { useEffect, useMemo, useReducer } from "react";
import { v4 as uuid } from "uuid";
import {
  Action,
  WheelManagerState,
  Wheel,
  WheelSegment,
  UpdateSegmentsAction,
  ResetWheelAction,
  CreateWheelAction,
  UpdateWheelAction,
  DeleteWheelAction,
  SelectWheelAction,
  StartSpinAction,
} from "./types";
import { debounce } from "lodash";

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

function updateSegments(segments: WheelSegment[], labels: string[]) {
  const remainingSegments = [...segments];
  const nextSegments: (WheelSegment | null)[] = Array(labels.length).fill(null);
  const missingIndexes: number[] = [];

  // Use existing segments where the names match
  labels.forEach((label, i) => {
    const index = remainingSegments.findIndex(
      (segment) => segment.label === label
    );
    if (index > -1) {
      nextSegments[i] = remainingSegments[index];
      remainingSegments.splice(index, 1);
    } else {
      missingIndexes.push(i);
    }
  });

  // Re-use existing segments with updated names, if possible
  missingIndexes.forEach((index) => {
    const label = labels[index];
    if (remainingSegments.length) {
      nextSegments[index] = { ...remainingSegments[0], label };
      remainingSegments.splice(0, 1);
    } else {
      nextSegments[index] = {
        id: uuid(),
        label,
        selected: false,
        removed: false,
      };
    }
  });

  return nextSegments as WheelSegment[];
}

function reducer(state: WheelManagerState, action: Action): WheelManagerState {
  switch (action.type) {
    case "UPDATE_SEGMENTS": {
      const { id, labels } = action as UpdateSegmentsAction;

      return {
        ...state,
        wheels: updateItemInArray(state.wheels, id, (wheel) => ({
          ...wheel,
          segments: updateSegments(wheel.segments, labels),
        })),
      };
    }
    case "START_SPIN": {
      const { id, nextSelectedSegmentId } = action as StartSpinAction;
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
    }
    case "END_SPIN": {
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
    }
    case "RESET_WHEEL": {
      const { id } = action as ResetWheelAction;

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
    }
    case "CREATE_WHEEL": {
      const { label } = action as CreateWheelAction;
      const id = uuid();
      return {
        ...state,
        wheels: [
          ...state.wheels,
          {
            id,
            label: label || `Wheel ${state.wheels.length + 1}`,
            segments: [],
            isSpinning: false,
          },
        ],
        selectedWheelId: id,
      };
    }
    case "UPDATE_WHEEL": {
      const { id, label } = action as UpdateWheelAction;

      return {
        ...state,
        wheels: updateItemInArray(state.wheels, id, (wheel) => ({
          ...wheel,
          label,
        })),
      };
    }
    case "DELETE_WHEEL": {
      const { id } = action as DeleteWheelAction;

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
    }
    case "SELECT_WHEEL": {
      const { id } = action as SelectWheelAction;
      return {
        ...state,
        wheels: updateItemInArray(
          state.wheels,
          state.selectedWheelId,
          (wheel) => ({ ...wheel, isSpinning: false })
        ),
        selectedWheelId: id,
      };
    }
    default:
      throw new Error();
  }
}

function getStateFromLocalStorage() {
  const savedState = window.localStorage.getItem("wheels");
  return savedState ? JSON.parse(savedState) : null;
}

function saveStateToLocalStorage(state: WheelManagerState) {
  const stateToSave = {
    ...state,
    wheels: state.wheels.map((wheel) => ({
      ...wheel,
      isSpinning: false,
      segments: wheel.segments.map((segment) => ({
        ...segment,
        removed: false,
        selected: false,
      })),
    })),
  };

  window.localStorage.setItem("wheels", JSON.stringify(stateToSave));
}

const debouncedSave = debounce(saveStateToLocalStorage, 1000, {
  leading: false,
  trailing: true,
});

export function useWheels() {
  const savedState = useMemo(() => getStateFromLocalStorage(), []);
  const initialState = savedState || defaultState;
  const [state, dispatch] = useReducer(reducer, initialState);

  const { wheels, selectedWheelId, isSpinning } = state;

  const selectedWheel = wheels.find(
    ({ id }) => id === selectedWheelId
  ) as Wheel;

  useEffect(() => {
    debouncedSave(state);
  }, [state]);

  return {
    dispatch,
    wheels,
    isSpinning,
    selectedWheel,
  };
}
