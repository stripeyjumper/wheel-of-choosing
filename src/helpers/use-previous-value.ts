import { useEffect, useRef } from "react";

export function usePreviousValue<TValue>(value: TValue) {
  const ref = useRef<TValue>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
