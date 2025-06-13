/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from "react";
import { debounce } from "lodash";
/**
 * https://trippingoncode.com/react-debounce-hook/
 * https://lodash.com/docs/4.17.15#debounce
 */
export const useDebounceFn = (fnToDebounce, delay = 500) => {
  // Return an error if the delay received is not a number
  if (isNaN(delay)) {
    throw new Error("Delay value should be a number.");
  }
  // Return an error if fnToDebounce is not a function
  if (!fnToDebounce || typeof fnToDebounce !== "function") {
    throw new Error("Debounce must have a function");
  }

  // Wrap the debounce implementation from lodash in useCallback to avoid re-rendering multiple times, but only re-render when fnToDebounce or delay changes
  return useCallback(debounce(fnToDebounce, delay), [fnToDebounce, delay]);
};
