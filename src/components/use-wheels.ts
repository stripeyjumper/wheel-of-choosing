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
} from "./types";

const defaultWheelId = uuid();

const defaultState: WheelManagerState = {
  wheels: [
    {
      id: defaultWheelId,
      segments: [{ id: uuid(), label: "toot" }],
    },
  ],
  currentWheelId: defaultWheelId,
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

function getRandomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
              { id: uuid(), label, selected: false, removed: false },
              ...wheel.segments,
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
      const { currentWheelId, wheels } = state;

      return {
        ...state,
        wheels: updateItemInArray(wheels, currentWheelId, (wheel) => {
          const { segments } = wheel;
          const visibleSegments = segments.filter(
            ({ removed, selected }) => !removed && !selected
          );

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
          };
        }),
        isSpinning: true,
      };
    }
    case "END_SPIN": {
      return {
        ...state,
        isSpinning: false,
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
    default:
      throw new Error();
  }
}

export function useWheels(initialState = defaultState) {
  const [{ wheels, currentWheelId, isSpinning }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const selectedWheel = wheels.find(({ id }) => id === currentWheelId) as Wheel;

  return {
    dispatch,
    wheels,
    isSpinning,
    selectedWheel,
  };
}
