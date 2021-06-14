import { useEffect, useMemo, useState } from "react";
import { WheelManagerState, Wheel } from "./types";
import { debounce } from "lodash";
import {
  serializeWheelState,
  deserializeWheelState,
} from "./serialize-wheel-state";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";

import { replaceState } from "./wheel-reducer";

const LOCAL_STORAGE_KEY = "wheel_state";

function getStateFromLocalStorage() {
  const savedState = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  return savedState ? deserializeWheelState(savedState) : null;
}

function getLegacyStateFromLocalStorage() {
  const savedState = window.localStorage.getItem("wheels");
  let result = null;
  if (savedState) {
    window.localStorage.removeItem("wheels");
    try {
      result = JSON.parse(savedState) as WheelManagerState;
    } catch (err) {
      console.error("Error getting wheel state from local storage");
    }
  }
  return result;
}

function getStateFromQueryString() {
  const { wheels } = queryString.parse(window.location.search);
  if (wheels && typeof wheels === "string") {
    const state = deserializeWheelState(wheels);
    if (state) {
      const { pathname, origin } = window.location;
      window.history.replaceState(
        {},
        "Wheel of choosing",
        `${origin}${pathname}`
      );
      return state;
    }
  }
  return null;
}

export function useWheels() {
  const dispatch = useDispatch();
  const state = useSelector<WheelManagerState, WheelManagerState>((s) => s);

  const [loading, setLoading] = useState(true);
  const [serializedState, setSerializedState] = useState<string | null>(null);

  // Get initial state from querystring or localstorage
  useEffect(() => {
    const savedState =
      getStateFromQueryString() ||
      getStateFromLocalStorage() ||
      getLegacyStateFromLocalStorage();

    if (savedState) {
      dispatch(replaceState(savedState));
    }
    setLoading(false);
  }, [dispatch]);

  const { wheels, selectedWheelId, isSpinning } = state;

  const selectedWheel = wheels.find(
    ({ id }) => id === selectedWheelId
  ) as Wheel;

  // Debounced function to serialize and save the wheel state
  const handleAutoSave = useMemo(
    () =>
      debounce(
        (nextState: WheelManagerState) => {
          const serialized = serializeWheelState(nextState);
          setSerializedState(serialized);
          window.localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
        },
        1000, // Wait 1 second before saving
        { leading: false, trailing: true }
      ),
    []
  );

  useEffect(() => {
    if (!loading) {
      handleAutoSave(state);
    }
  }, [state, handleAutoSave, loading]);

  return {
    loading,
    wheels,
    isSpinning,
    selectedWheel,
    serializedState,
  };
}
