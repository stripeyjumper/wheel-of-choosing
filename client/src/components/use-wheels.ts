import { useReducer } from "react";
import { v4 as uuid } from "uuid";
import {
  Action,
  WheelManagerState,
  Wheel,
  CreateSegmentAction,
  UpdateSegmentAction,
  DeleteSegmentAction,
  ResetWheelAction,
  CreateWheelAction,
  UpdateWheelAction,
  DeleteWheelAction,
  SelectWheelAction,
} from "./types";
import { getRandomInteger } from "./get-random-integer";

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

function reducer(state: WheelManagerState, action: Action): WheelManagerState {
  switch (action.type) {
    case "CREATE_SEGMENT": {
      const { wheelId, label } = action as CreateSegmentAction;

      return {
        ...state,
        wheels: updateItemInArray(state.wheels, wheelId, (wheel) => {
          return {
            ...wheel,
            segments: [
              ...wheel.segments,
              { id: uuid(), label, selected: false, removed: false },
            ],
          };
        }),
      };
    }
    case "UPDATE_SEGMENT": {
      const { wheelId, id, label } = action as UpdateSegmentAction;

      return {
        ...state,
        wheels: updateItemInArray(state.wheels, wheelId, (wheel) => ({
          ...wheel,
          segments: updateItemInArray(wheel.segments, id, (segment) => ({
            ...segment,
            label,
          })),
        })),
      };
    }
    case "DELETE_SEGMENT": {
      const { wheelId, id } = action as DeleteSegmentAction;

      return {
        ...state,
        wheels: updateItemInArray(state.wheels, wheelId, (wheel) => ({
          ...wheel,
          segments: deleteItemFromArray(wheel.segments, id),
        })),
      };
    }
    case "START_SPIN": {
      const { selectedWheelId, wheels } = state;

      return {
        ...state,
        wheels: updateItemInArray(wheels, selectedWheelId, (wheel) => {
          const { segments } = wheel;

          const visibleSegments = segments.filter(
            ({ removed, selected }) => !removed && !selected
          );

          if (!visibleSegments.length) {
            return wheel;
          }

          // Randomly pick the next segment to spin to
          const selectedSegmentIndex = getRandomInteger(
            0,
            visibleSegments.length - 1
          );

          const { id: selectedSegmentId } = visibleSegments[
            selectedSegmentIndex
          ];

          const nextSegments = wheel.segments.map(
            ({ removed, selected, ...rest }) => ({
              ...rest,
              removed: removed || selected,
              selected: rest.id === selectedSegmentId,
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
        console.log("Changing selected wheel!", selectedWheelId);
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
        selectedWheelId: id,
      };
    }
    default:
      throw new Error();
  }
}

export function useWheels(initialState = defaultState) {
  const [{ wheels, selectedWheelId, isSpinning }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const selectedWheel = wheels.find(
    ({ id }) => id === selectedWheelId
  ) as Wheel;

  return {
    dispatch,
    wheels,
    isSpinning,
    selectedWheel,
  };
}
