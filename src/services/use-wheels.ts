import { useEffect, useMemo, useState } from "react";
import { WheelManagerState, Wheel, LegacyWheelManagerState } from "./types";
import { debounce } from "lodash";
import {
  serializeWheelState,
  deserializeWheelState,
} from "./serialize-wheel-state";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserHistory } from "history";

import { replaceState } from "./wheel-reducer";

const history = createBrowserHistory();
const LOCAL_STORAGE_KEY = "wheel_state";

function getStateFromLocalStorage() {
  const savedState = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  return savedState ? deserializeWheelState(savedState) : null;
}

function getLegacyStateFromLocalStorage() {
  const savedState = window.localStorage.getItem("wheels");
  let result: WheelManagerState | null = null;
  if (savedState) {
    window.localStorage.removeItem("wheels");
    try {
      const data = JSON.parse(savedState) as LegacyWheelManagerState;
      if (data.selectedWheelId) {
        const selectedWheelIndex = data.wheels.findIndex(
          ({ id }) => id === data.selectedWheelId
        );
        result = {
          wheels: data.wheels,
          selectedWheelIndex,
          showDataUrl: false,
        };
      }
    } catch (err) {
      console.error("Error getting wheel state from local storage");
    }
  }
  return result;
}

function getStateFromQueryString() {
  const { wheels } = queryString.parse(window.location.search);
  if (wheels && typeof wheels === "string") {
    return deserializeWheelState(wheels);
  }
  return null;
}

export function useWheels(): {
  loading: boolean;
  wheels: Wheel[];
  selectedWheel: Wheel;
  serializedState?: string | null;
  scrollDirection: "up" | "down" | null;
} {
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

  const {
    wheels,
    selectedWheelIndex,
    prevSelectedWheelIndex,
    showDataUrl,
  } = state;

  const selectedWheel = wheels[selectedWheelIndex] as Wheel;

  const scrollDirection = useMemo(() => {
    if (
      prevSelectedWheelIndex === undefined ||
      prevSelectedWheelIndex === selectedWheelIndex
    ) {
      return null;
    }
    return prevSelectedWheelIndex < selectedWheelIndex ? "down" : "up";
  }, [selectedWheelIndex, prevSelectedWheelIndex]);

  // Debounced function to serialize and save the wheel state
  const handleAutoSave = useMemo(
    () =>
      debounce(
        (nextState: WheelManagerState) => {
          const serialized = serializeWheelState(nextState);
          setSerializedState(serialized);
          window.localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
          if (showDataUrl && serialized && serialized.length <= 1024) {
            history.replace({
              pathname: "/",
              search: `?wheels=${encodeURIComponent(serialized)}`,
            });
          } else {
            history.replace({ pathname: "/", search: "" });
          }
        },
        1000, // Wait 1 second before saving
        { leading: true, trailing: true }
      ),
    [showDataUrl]
  );

  useEffect(() => {
    if (!loading) {
      handleAutoSave(state);
    }
  }, [state, handleAutoSave, loading]);

  return {
    loading,
    wheels,
    selectedWheel,
    serializedState,
    scrollDirection,
  };
}
